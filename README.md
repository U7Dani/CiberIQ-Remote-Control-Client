# CiberIQ Remote Control — cliente público

Conecta tu propio ordenador con ChatGPT mediante el servicio MCP de CiberIQ Remote Control. Este repositorio público contiene **únicamente el lanzador verificable**, no el backend privado, los datos de usuarios ni las credenciales del servidor.

## Instalar desde GitHub

Requiere **Windows x64** y **Node.js 22.12+**.

~~~powershell
npx --yes github:U7Dani/CiberIQ-Remote-Control-Client#client-v0.2.3 remote
~~~

O clona el repositorio e instala el lanzador localmente:

~~~powershell
git clone https://github.com/U7Dani/CiberIQ-Remote-Control-Client.git
cd CiberIQ-Remote-Control-Client
npm install -g .
ciberiq-remote-control remote
~~~

**Cuando esté publicado en npm**, también se podrá utilizar:

~~~powershell
npx --yes ciberiq-remote-control@latest remote
~~~

Este último comando aún no funciona en la Registry pública hasta completar la publicación de npm.

## Vincular el ordenador y conectar ChatGPT

1. Ejecuta el comando `remote`. El cliente descarga el agente oficial desde HTTPS y verifica el **SHA-256 fijado en esta versión** antes de instalarlo; si no coincide, no ejecuta nada.
2. Se abrirá la web de [CiberIQ Remote Control](https://remote-control.ciberiq.com). Inicia sesión con Google y comprueba que el código mostrado **coincide exactamente** con el de la consola.
3. Autoriza el dispositivo. Mantén abierta la terminal mientras quieras que el ordenador figure online.
4. Abre ChatGPT y conecta el complemento **CiberIQ Remote Control** cuando esté aprobado y disponible en el directorio. Para desarrollo, quienes tengan acceso a conectores MCP personalizados pueden usar `https://remote-control.ciberiq.com/mcp`.
5. Completa OAuth con la misma cuenta de CiberIQ. El asistente tendrá acceso solamente a los dispositivos y carpetas que autorices.

**No se necesita una API key personal de OpenAI.** Los cálculos y las operaciones del agente ocurren en el equipo del usuario, no en la VPS.

## Administrar el acceso

~~~powershell
ciberiq-remote-control status
ciberiq-remote-control permissions
ciberiq-remote-control permissions --add-workspace "C:\Users\me\Proyectos"
ciberiq-remote-control permissions --allow-write "C:\Users\me\Proyectos\demo"
ciberiq-remote-control permissions --enable-terminal
ciberiq-remote-control revoke
~~~

El permiso predeterminado es **solo lectura**, limitado a carpetas autorizadas en el dispositivo. Escritura y ejecución requieren confirmación local explícita. Puedes revocar la conexión desde la consola o desde el equipo.

## Compatibilidad, privacidad y soporte

La distribución pública verificada de esta versión es **Windows x64**; macOS y Linux todavía no están certificados para instalación pública. El MCP de ChatGPT requiere la publicación por OpenAI, independiente de GitHub/npm.

Privacidad: https://remote-control.ciberiq.com/privacy

Condiciones: https://remote-control.ciberiq.com/terms

Soporte: contacto@ciberiq.com

El código de este repositorio es el **lanzador**. No constituye una publicación del código privado del backend ni del agente completo. El instalador Windows descargable no se anuncia como firmado digitalmente sin una firma Authenticode verificada.
