<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Regla obligatoria del proyecto

Antes de escribir o modificar cualquier archivo de este repositorio, lee
`ESPECIFICACIONES.md` (raíz del proyecto) y trátalo como la fuente de verdad para
diseño, stack, límites del asistente y reglas de negocio.

Notas de cumplimiento:

- Si `ESPECIFICACIONES.md` contradice una suposición previa o la documentación por
  defecto de una librería, manda `ESPECIFICACIONES.md`.
- La sección 4 (Reglas de negocio) está marcada como POR DEFINIR: cuando una tarea
  dependa de ella, pregunta al cliente en lugar de inferir.
- Ningún cambio se considera terminado sin `npm run lint` y `npm run build` en verde.

