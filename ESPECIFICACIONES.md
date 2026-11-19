# Hoja de limitaciones y especificaciones — MetaWeb Platform

> Lectura obligatoria. Esta hoja es la fuente de verdad del proyecto. Debe leerse
> antes de escribir o modificar cualquier archivo. Si algo aquí contradice una
> suposición previa, manda esta hoja. Si falta un dato, se pregunta; no se inventa.

Última actualización: 2026-11-13

---

## 1. Diseño y UI

### Paleta (basada en el logo oficial de MetaWeb Dev Solutions)
Fuente: https://metawebdevsolutions.com.mx/logo.svg — el logo usa solo dos colores.

| Token                | Valor    | Uso                                                            |
| -------------------- | -------- | -------------------------------------------------------------- |
| --primary            | #1D6E47  | Verde MetaWeb. Acción principal, botones sólidos.              |
| --color-brand        | #1D6E47  | Verde MetaWeb. Acento, marca, foco (--ring).                   |
| --color-brand-deep   | #000000  | Negro del logo. Fondos de marca (paneles, cabeceras), títulos. |
| --background         | #FFFFFF  | Fondo en modo claro.                                           |
| --background (.dark) | #0A0A0A  | Fondo en modo oscuro (igual que el sitio web).                 |
| Neutros              | blanco / negro | Base editorial. Contrastes fuertes, sin degradados decorativos. |

- El verde #1D6E47 se mantiene igual en modo claro y oscuro.
- Sobre fondos verdes o negros, el logo y el texto van en blanco.
- Solo se usan colores semánticos de shadcn (bg-primary, text-muted-foreground,
  border-border). Queda prohibido el color crudo (bg-blue-500, text-emerald-600).
  La única excepción son los tokens de marca ya declarados: brand y brand-deep.
- No usar los verdes genéricos de Tailwind (green-700, green-50, etc.) como color
  de marca; el único verde de marca es #1D6E47.
- No introducir colores fuera de esta paleta sin aprobación.
- Se prohíben los degradados excesivos y la estética genérica de IA.

### Estética
- Editorial, minimalista e institucional (referencia: Google Workspace / Google Classroom).
- Sin emojis en interfaces, reportes ni mensajes de sistema.
- Densidad visual alta: separación mínima entre elementos gráficos y texto.
- Layouts compactos y de altura completa (min-h-dvh), evitando scroll innecesario.

### Tipografía (reglas obligatorias)
1. Interfaz de la app (texto, botones, menús, tablas, formularios, dashboards):
   Usar SIEMPRE "Inter". Alternativa aceptada: "Geist".
   En tablas y cifras activar números tabulares (tabular-nums).
2. Títulos, landing pages y material de marketing:
   Usar "Clash Display" (fuente de marca de MetaWeb).
   NO usar Clash Display dentro de la interfaz de la app ni en tamaños pequeños.
3. Datos técnicos (IDs, códigos de rastreo, folios, logs, fragmentos de código):
   Usar "Geist Mono". Alternativa aceptada: "JetBrains Mono".
4. Fuentes de respaldo:
   Sans: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif
   Mono: ui-monospace, "SF Mono", Menlo, monospace
5. No introducir ninguna otra fuente sin aprobación.

Implementación:
- Las fuentes se cargan con next/font en src/app/layout.tsx y se exponen como
  --font-sans (Inter o Geist) y --font-mono (Geist Mono o JetBrains Mono).
  Si se agrega Clash Display, se expone como --font-display.
- globals.css referencia esos nombres de variable; no se renombran.
- Estado actual: implementada Geist (alternativa aceptada). El cambio a Inter se
  hace solo en src/app/layout.tsx, sin tocar los nombres de variable.

### Formas
- Radio base: 16px (--radius: 1rem) → rounded-lg = 16px.
- Componentes destacados (CTA): tipo cápsula, rounded-full.

### Reglas de composición (obligatorias)
- className se usa para layout, no para redefinir colores ni tipografía de un componente.
- Espaciado con gap-* en contenedores flex. Nunca space-x-* ni space-y-*.
- size-* cuando ancho y alto son iguales (size-8, no w-8 h-8).
- truncate en lugar de overflow-hidden text-ellipsis whitespace-nowrap.
- Clases condicionales siempre con cn().
- Sin z-index manual en overlays (Dialog, Sheet, Popover): lo manejan ellos.
- Íconos: lucide-react, dentro de Button con data-icon="inline-start" / "inline-end"
  y sin clases de tamaño.
- Formularios con FieldGroup + Field; nunca div con space-y-*.
- Notificaciones siempre con sileo (sileo.success, sileo.error...). No usar alert().

---

## 2. Stack y convenciones técnicas

### Versiones fijadas
| Paquete           | Versión                        |
| ----------------- | ------------------------------ |
| next              | 16.4.5 (App Router, Turbopack) |
| react / react-dom | 19.3.0                         |
| typescript        | 5 (strict: true)               |
| tailwindcss       | 4                              |
| shadcn (CLI)      | 4.23.0                         |
| sileo             | 0.1.6                          |
| Node / npm        | 24.16.0 / 11.13.0              |

### Convenciones
- Código en src/. Alias de importación: @/* → src/*.
- Tailwind v4 sin tailwind.config.js. Toda la configuración de tema vive en
  src/app/globals.css con bloques @theme inline y variables en :root / .dark.
- shadcn/ui con estilo base-nova y primitivas @base-ui/react.
  La utilidad cn se importa del paquete cn (no de clsx + tailwind-merge).
- Componentes nuevos: siempre con npx shadcn@latest add <componente>.
  Nunca pegar código de la documentación a mano.
- Next.js 16: middleware.ts está deprecado. El equivalente es src/proxy.ts
  exportando proxy. No crear middleware.ts.
- next.config.ts tiene activos cacheComponents: true y partialPrefetching: true.
  Cualquier componente que lea datos de la petición (cookies(), headers()) debe ir
  dentro de un límite <Suspense> o quedará fuera del prerenderizado.
- cookies() es asíncrono: siempre await cookies().
- Scripts disponibles: npm run dev, npm run build, npm run start, npm run lint.

---

## 3. Seguridad (obligatoria)

### 3.1 Credenciales y secretos
- .env* está en .gitignore. Nunca commitear credenciales, llaves de API, tokens ni
  contraseñas, ni siquiera en comentarios, ejemplos o pruebas.
- Variables sensibles sin prefijo NEXT_PUBLIC_; solo lo público lleva el prefijo.
- La llave service_role de Supabase y las llaves de S3 solo se usan en el servidor.
  Nunca se importan en componentes "use client" ni se envían al navegador.
- Los módulos que usan secretos llevan import "server-only" para impedir que se
  importen desde el cliente.
- Toda credencial se configura únicamente con autorización expresa del cliente.
- Si una credencial se expone por error, se avisa de inmediato al cliente para
  rotarla. No se intenta ocultar ni borrar del historial sin autorización.

### 3.2 Autenticación y sesiones
- La sesión se valida siempre en el servidor (Server Components, Server Actions,
  Route Handlers y src/proxy.ts). Nunca confiar en datos de sesión del cliente.
- Las rutas privadas se protegen en src/proxy.ts y, además, se vuelve a verificar
  la sesión dentro de cada página o acción que lea o modifique datos.
- Las cookies de sesión van con HttpOnly, Secure y SameSite=Lax (o Strict).
- Nunca guardar tokens ni datos sensibles en localStorage o sessionStorage.
- Los mensajes de error de login son genéricos ("Correo o contraseña incorrectos");
  nunca revelan si una cuenta existe.

### 3.3 Límite de intentos de login
- Máximo 3 intentos fallidos de inicio de sesión por cuenta y por dirección IP.
- Al tercer intento fallido, la cuenta se bloquea temporalmente por 15 minutos
  para esa IP.
- El conteo se guarda y se valida en el servidor, nunca en el navegador.
- Mensaje al usuario durante el bloqueo, en español: "Demasiados intentos. Intenta
  de nuevo en 15 minutos o recupera tu contraseña."
- El mensaje nunca revela si el correo existe ni cuántos intentos quedan.
- Un inicio de sesión exitoso reinicia el contador.
- La misma regla aplica a recuperación de contraseña y verificación de códigos.
- Cada bloqueo se registra en los logs (sin la contraseña intentada).

### 3.4 Autorización y datos (Supabase)
- Row Level Security (RLS) activado en TODAS las tablas sin excepción.
  Ninguna tabla se crea sin sus políticas RLS.
- Cada registro pertenece a una organización o usuario, y las políticas RLS
  filtran por ese dueño. Un usuario nunca puede leer ni modificar datos de otro.
- Los permisos por rol se validan en el servidor, nunca solo ocultando botones
  en la interfaz.
- Nunca usar la llave service_role para saltarse RLS en operaciones normales de
  usuario.

### 3.5 Validación de entradas
- Todo dato que llega del cliente (formularios, parámetros de URL, cuerpos de
  petición) se valida en el servidor antes de usarse, aunque ya se haya validado
  en el navegador.
- Nunca construir consultas SQL concatenando texto; usar siempre el cliente de
  Supabase o consultas parametrizadas.
- No usar dangerouslySetInnerHTML con contenido proveniente de usuarios.
- Las redirecciones solo van a rutas internas; nunca a una URL recibida como
  parámetro sin validar.

### 3.6 Archivos y almacenamiento (S3)
- Los buckets son privados por defecto. Nada se hace público sin autorización.
- Subidas y descargas con URLs firmadas de corta duración generadas en el servidor.
- Validar tipo y tamaño de archivo en el servidor antes de aceptarlo.
- Los nombres de archivo se generan en el servidor; nunca se usa el nombre que
  envía el usuario como ruta.

### 3.7 Cabeceras de seguridad
Obligatorias en todas las rutas. Se configuran en next.config.ts con la función
headers(), aplicadas a source: "/(.*)".

| Cabecera                  | Valor                                                | Para qué sirve |
| ------------------------- | ---------------------------------------------------- | -------------- |
| Strict-Transport-Security | max-age=63072000; includeSubDomains; preload         | Obliga a usar siempre HTTPS. |
| Content-Security-Policy   | Ver reglas de CSP abajo                              | Bloquea scripts y recursos no autorizados (XSS). |
| X-Frame-Options           | DENY                                                 | Impide que el sitio se cargue dentro de un iframe (clickjacking). |
| X-Content-Type-Options    | nosniff                                              | Evita que el navegador ejecute archivos con un tipo distinto al declarado. |
| Referrer-Policy           | strict-origin-when-cross-origin                      | No filtra rutas ni parámetros privados a otros sitios. |
| Permissions-Policy        | camera=(), microphone=(), geolocation=(), payment=() | Apaga funciones del navegador que la app no usa. |

Reglas de Content-Security-Policy (CSP):
- Base: default-src 'self'; frame-ancestors 'none'; base-uri 'self';
  form-action 'self'; object-src 'none'; upgrade-insecure-requests.
- Solo se permiten orígenes externos que la app realmente usa (por ejemplo, el
  dominio del proyecto de Supabase en connect-src y el bucket de S3 en img-src).
  Cada origen nuevo se agrega solo con autorización del cliente.
- Prohibido usar 'unsafe-eval'. 'unsafe-inline' solo si Next.js lo requiere y
  con autorización; de preferencia usar nonce generado en src/proxy.ts.
- Toda CSP nueva o modificada se prueba primero como
  Content-Security-Policy-Report-Only y se activa solo cuando no rompa nada.
- Si una función de la app requiere cámara, micrófono, ubicación o pagos, se
  ajusta Permissions-Policy solo para esa función y con autorización.
- Después de desplegar, revisar el dominio en https://securityheaders.com.
  El objetivo mínimo es calificación A.

Otras protecciones:
- Las Server Actions verifican sesión y permisos al inicio, igual que una API.
- No exponer la cabecera X-Powered-By (poweredByHeader: false en next.config.ts).

### 3.8 Errores
- La interfaz nunca muestra mensajes crudos de excepción, trazas, consultas SQL
  ni nombres internos. Se muestra un mensaje en español claro y accionable.

### 3.9 Logs y registros
- Prohibido registrar: contraseñas (aunque sean incorrectas), tokens, llaves de
  API, cookies de sesión, datos de tarjetas, RFC, CURP ni documentos personales.
- Los correos y teléfonos se registran enmascarados (ej. j***@dominio.com).
- Sí se registra: fecha y hora, tipo de evento, ID interno del usuario, ruta,
  resultado (éxito / error) e IP.
- Eventos que siempre se registran: inicios de sesión exitosos y fallidos,
  bloqueos por intentos, cambios de contraseña, cambios de rol o permisos, y
  errores del servidor.
- Prohibido console.log con datos de usuarios en código de producción.
- Los errores se registran completos solo en el servidor; al usuario se le muestra
  un mensaje en español claro y accionable.
- Solo personal autorizado puede consultar los logs.

### 3.10 Dependencias y npm audit
- No instalar paquetes nuevos sin autorización del cliente.
- Ejecutar npm audit:
  1. Antes de cerrar cualquier cambio que agregue o actualice paquetes.
  2. Antes de cada despliegue a producción.
- Vulnerabilidades altas o críticas: se detiene el despliegue y se reporta al
  cliente con el paquete afectado y la solución propuesta.
- Vulnerabilidades moderadas o bajas: se reportan y se corrigen en el siguiente
  cambio programado.
- Prohibido ejecutar npm audit fix --force sin autorización, porque puede subir
  versiones mayores y romper el proyecto.
- Mantener package-lock.json en el repositorio para fijar versiones exactas.

### 3.11 Datos personales
- Pedir y guardar solo los datos personales estrictamente necesarios.
- Cumplir con la Ley Federal de Protección de Datos Personales en Posesión de
  los Particulares (LFPDPPP) de México: aviso de privacidad visible y acceso
  restringido a la información personal.

### 3.12 Verificación
- Ningún cambio se da por terminado sin npm run lint y npm run build en verde.
- Antes de cada despliegue a producción, además, npm audit sin vulnerabilidades
  altas ni críticas.

---

## 4. Límites del asistente

1. No inventar información. Prohibido crear textos, cifras, nombres de módulos,
   campos, métricas o resultados que el cliente no haya proporcionado. Si falta un
   dato, se pregunta.
2. Respetar las ediciones manuales. Los textos escritos por el cliente no se
   reescriben. El asistente ajusta layout o estilo; no añade copy, chips, badges ni
   elementos gráficos no solicitados.
3. Nada de errores técnicos en pantalla. La interfaz nunca muestra mensajes crudos de
   excepción. Los errores se traducen a mensajes en español, claros y accionables.
4. Sin configuración no autorizada. No se crean archivos de entorno, proyectos de
   Supabase, buckets, ni se introducen llaves sin pedido explícito.
5. Sin Git sin autorización. No se ejecuta commit, push ni ningún comando destructivo
   (reset --hard, push --force, clean -f) salvo instrucción directa.
6. Cambio mínimo. Solo se toca lo necesario para lo solicitado. Sin refactorizaciones
   ni abstracciones preventivas. Tres líneas repetidas son mejor que una abstracción
   prematura.
7. Sin archivos innecesarios. Preferir editar lo existente antes que crear archivos
   nuevos. No crear documentación salvo pedido explícito.
8. Idioma. Respuestas, comentarios de código y textos de interfaz en español.
   Ortografía impecable.
9. Respuestas concisas. Directas, sin preámbulos ni justificaciones extensas.
10. Marca. Respetar siempre la paleta y las reglas de tipografía de la sección 1.
11. Seguridad primero. Ningún cambio puede debilitar las reglas de la sección 3
    (Seguridad). Si una instrucción entra en conflicto con ellas, se detiene el
    trabajo y se pregunta al cliente antes de continuar.

---

## 5. Reglas de negocio

> Estado: POR DEFINIR. Esta sección no puede completarse por inferencia.
> El asistente debe pedir estos datos antes de implementar lógica de negocio.

Datos requeridos:
- Alcance de la plataforma. Confirmar los módulos: ¿desarrollo?, ¿contaduría?,
  ¿ambos?, ¿qué más?
- Roles y permisos. Qué tipos de usuario existen y qué puede hacer cada uno.
- Flujo de acceso. Cómo se autentican (correo/contraseña, invitación, SSO, etc.)
  y qué pasa al iniciar sesión.
- Entidades principales. Clientes, proyectos, facturas, asientos, periodos, etc.,
  con sus campos obligatorios.
- Reglas de cálculo. Fórmulas, impuestos, monedas, redondeos, fechas de corte.
- Reglas de validación. Qué datos son obligatorios y qué combinaciones se rechazan.
- Reportes requeridos. Contenido, periodicidad (diario / mensual) y formato de salida.
- Nomenclatura. Nombres oficiales de módulos, estados y documentos tal como los
  escribe el cliente.

---

## 6. Estado actual del proyecto

| Área                            | Estado |
| ------------------------------- | ------ |
| Next.js + Tailwind + TypeScript | Configurado y compilando |
| shadcn/ui                       | Inicializado (estilo base-nova). Componentes: button, input, label, field, separator |
| sileo                           | <Toaster> global en src/app/layout.tsx (posición top-right, tema system) |
| Paleta                          | Actualizada a los colores del logo (#1D6E47 y #000000). Pendiente aplicarla en globals.css |
| Tipografía                      | Geist + Geist Mono vía next/font. Pendiente decidir si se cambia a Inter |
| Seguridad                       | Reglas definidas (sección 3). Pendiente aplicar cabeceras, RLS, límite de 3 intentos de login y logs |
| Login                           | src/app/login/page.tsx — diseño con OAuth Google y GitHub conectados vía Supabase. / redirige a /login |
| Supabase                        | Configurado: clientes en src/lib/supabase/ (client.ts, server.ts), proxy.ts para refresh de sesión, callback en /auth/callback. Variables en .env.local |
| Almacenamiento S3               | Paquetes instalados, sin configurar. Sin clientes ni variables de entorno |
| Reglas de negocio               | Pendientes de definir (sección 5) |
