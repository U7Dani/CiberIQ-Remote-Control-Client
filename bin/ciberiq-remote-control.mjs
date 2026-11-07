#!/usr/bin/env node
/**
 * npx ciberiq-remote-control            -> pair this computer in the browser (first run) and connect it
 * npx ciberiq-remote-control status     -> local pairing status
 * npx ciberiq-remote-control permissions [--allow-write <dir> | --enable-terminal | ...]
 * npx ciberiq-remote-control revoke     -> revoke this computer on the server and wipe local credentials
 * npx ciberiq-remote-control update     -> download the agent bundle pinned by this launcher version
 *
 * The launcher is tiny. On first use it downloads the agent bundle named in manifest.json from the commercial server,
 * checks its SHA-256 against the value pinned INSIDE this npm package, unpacks it under the user's profile and runs it
 * with the current Node. A bundle whose hash does not match is never executed. No inbound port is opened.
 */
import { createHash } from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import { createWriteStream, existsSync, mkdirSync, readFileSync, renameSync, rmSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(readFileSync(join(here, '..', 'manifest.json'), 'utf8'));
const out = m => process.stdout.write(m + '\n'), err = m => process.stderr.write(m + '\n');

function fail(message) { err('CiberIQ Remote Control: ' + message); process.exit(1); }

const [major] = process.versions.node.split('.').map(Number);
if (major < 22) fail(`Node.js 22 or newer is required (found ${process.versions.node}).`);
const bundle = manifest.bundles?.[`${process.platform}-${process.arch}`];
if (!bundle) fail(`This operating system (${process.platform}-${process.arch}) is not supported yet. Supported: ${Object.keys(manifest.bundles || {}).join(', ')}.`);
if (!/^[a-f0-9]{64}$/.test(bundle.sha256) || !/^https:\/\//.test(bundle.url)) fail('Corrupt launcher manifest.');

const base = process.env.CIBERIQ_AGENT_RUNTIME_DIR || (process.platform === 'win32'
  ? join(process.env.LOCALAPPDATA || join(homedir(), 'AppData', 'Local'), 'CiberIQ-Remote-Control', 'agent')
  : join(process.env.XDG_DATA_HOME || join(homedir(), '.local', 'share'), 'ciberiq-remote-control', 'agent'));
const target = join(base, bundle.sha256.slice(0, 16));
const entry = join(target, 'scripts', 'commercial-agent.mjs');

async function download() {
  mkdirSync(base, { recursive: true });
  const tmp = join(base, `.download-${process.pid}-${Date.now()}`), file = tmp + '.tgz';
  try {
    out(`Downloading CiberIQ agent ${manifest.agentVersion} (${Math.round(bundle.size / 1048576)} MB)...`);
    const res = await fetch(bundle.url, { redirect: 'error', signal: AbortSignal.timeout(300_000) });
    if (!res.ok || !res.body) fail(`Download failed (HTTP ${res.status}).`);
    const hash = createHash('sha256');
    const counted = Readable.fromWeb(res.body).on('data', c => hash.update(c));
    await pipeline(counted, createWriteStream(file, { mode: 0o600 }));
    const got = hash.digest('hex');
    if (got !== bundle.sha256) fail('Integrity check FAILED: the downloaded agent does not match the version pinned in this package. Nothing was installed.');
    mkdirSync(tmp, { recursive: true });
    const tar = process.platform === 'win32' ? join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'tar.exe') : 'tar';
    const x = spawnSync(tar, ['-xzf', file, '-C', tmp], { stdio: 'ignore', windowsHide: true });
    if (x.status !== 0 || !existsSync(join(tmp, 'scripts', 'commercial-agent.mjs'))) fail('Could not unpack the agent bundle.');
    rmSync(target, { recursive: true, force: true });
    renameSync(tmp, target);
    out('Agent verified (SHA-256) and installed in ' + target);
  } finally {
    rmSync(file, { force: true }); rmSync(tmp, { recursive: true, force: true });
  }
}

const args = process.argv.slice(2);
const sub = args[0] && !args[0].startsWith('--') ? args.shift() : 'remote';
const known = ['remote', 'status', 'permissions', 'revoke', 'forget', 'update', 'version', 'help'];
if (!known.includes(sub)) fail(`Unknown command "${sub}". Commands: ${known.join(', ')}`);
if (sub === 'version') { out(`launcher ${manifest.launcherVersion} · agent ${manifest.agentVersion}`); process.exit(0); }
if (sub === 'help') { out(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(2, 7).map(l => l.replace(/^ \* ?/, '')).join('\n')); process.exit(0); }

if (sub === 'update' || !existsSync(entry) || !statSync(entry).isFile()) await download();
if (sub === 'update') { out('Up to date: agent ' + manifest.agentVersion); process.exit(0); }

const forwarded = sub === 'remote' && !args.includes('--server') && manifest.defaultServer ? [...args, '--server', manifest.defaultServer] : args;
const child = spawn(process.execPath, [entry, sub, ...forwarded], { cwd: target, stdio: 'inherit', windowsHide: false, env: { ...process.env, CIBERIQ_AGENT_VERSION: manifest.agentVersion, CIBERIQ_LAUNCHED: '1', CIBERIQ_LAUNCHER_CWD: process.cwd() } });
for (const s of ['SIGINT', 'SIGTERM']) process.on(s, () => child.kill(s));
child.on('exit', code => process.exit(code ?? 1));
