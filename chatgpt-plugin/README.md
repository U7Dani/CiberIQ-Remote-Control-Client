# CiberIQ Remote Control — paquete para el directorio público de ChatGPT

Estado: **candidato de publicación**, no aprobado ni publicado aún por OpenAI.

## Archivos

- `plugin.json`: identidad, URLs de soporte/privacidad/condiciones, descripción del producto, icono y 5 pruebas positivas + 3 negativas para revisión.
- `mcp.json`: único servidor remoto OAuth MCP: `https://remote-control.ciberiq.com/mcp`.
- `assets/brand-ciberiq-original.png`: imagen cuadrada de la marca Ciber IQ, obtenida sin modificaciones de su sitio oficial.

## Procedimiento de publicación

1. Entrar en <https://platform.openai.com/> → Plugins, con permisos **Apps Management: Write** en la organización elegida.
2. Completar la **verificación individual de identidad del desarrollador** cuando la plataforma la solicite. No se requiere constituir una sociedad para seleccionar la opción individual.
3. Elegir *Upload new plugin* / *With MCP* y adjuntar el ZIP `ciberiq-chatgpt-plugin-0.2.5.zip` generado en el repositorio de distribución.
4. En MCPs, conectar el origen estable `https://remote-control.ciberiq.com/mcp`. Completar OAuth e introducir solo en el portal las credenciales de una cuenta de prueba dedicada, nunca las de un usuario real ni en GitHub.
5. El portal mostrará un **token único** para demostrar control del dominio. Publicar el valor exacto en `https://remote-control.ciberiq.com/.well-known/openai-apps-challenge`; no inventar ni compartir este token. Comprobar que lo devuelve de forma exacta y sin caché y completar la validación.
6. Ejecutar **Scan Tools** y corregir cualquier error sobre esquemas, anotaciones `readOnlyHint`, `openWorldHint` y `destructiveHint`, consentimiento y políticas.
7. Comprobar que un revisor puede iniciar sesión, vincular un dispositivo de prueba y ejecutar los cinco casos positivos y tres negativos. Adjuntar una grabación del flujo end-to-end si se solicita.
8. Enviar el borrador a **Review**. El estado `Approved` precede a la acción manual `Publish`; no dar por pública la app antes de ambos.

## Experiencia final de usuario

1. En ChatGPT, buscar **CiberIQ Remote Control** en el directorio de complementos y pulsar instalar.
2. Abrir una cuenta gratuita en `remote-control.ciberiq.com` con Google.
3. En Windows, ejecutar `npx --yes github:U7Dani/CiberIQ-Remote-Control-Client#v0.2.2 remote` (y cuando npm lo distribuya, `npx ciberiq-remote-control`).
4. Comparar el código del terminal con el navegador y autorizar el equipo.
5. Conectar ChatGPT mediante OAuth con **esa misma cuenta**. Solo podrá acceder a los dispositivos y carpetas autorizados localmente.

## Pendientes externos de la publicación

- Cuenta OpenAI Platform con permiso de publicación y verificación de identidad individual.
- Validación del dominio con token del portal y escaneo automatizado de MCP.
- Cuenta de revisión dedicada, vídeo de demostración y posibles cambios solicitados por OpenAI.
- Aprobación y pulsación de **Publish**.

No pedir contraseñas de Google, tokens OAuth, claves del servidor ni datos personales de usuarios en conversaciones.
