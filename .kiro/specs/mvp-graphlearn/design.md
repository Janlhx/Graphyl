# Diseño — MVP GraphLearn

## Diagrama de arquitectura (draw.io)
Link del diagrama generado con el MCP de draw.io:

https://app.diagrams.net/?pv=0&grid=0#R1VhNc9s2EP01nJEP6lCiRMtHW7I6ae3YE7m%2Bg8CKRA0SDAhGVn59d0Hoi5Q9bSM7zoUCFgsQeO%2FtYqkgmubPvxtWZrdagAqGIROstPIbTLXSpgqiWTAcstpq%2FAmi6yCaGq1t08qfp6BojhSNX0hOw%2FkLowM3GpbMQGH%2FzQQrrYJm0jemamisbrc3wEyB9uB6GEzC4GKE7UvztZYWuK0Nw%2B7t4z0%2Be39%2BWiyC6BKblaQZs6tgON328GSZ71tmQUFVnTVvrOxa%2BTdaeMb9XmU2V2gYYHOpC7uQ32l8EG%2F6fgKNMyXTAtscTwoGDf4UYHCtF9EYbDFGTkDnYM0aXTYTPFrhuulvuisp8AzOFI%2B8LQOZZn7VyNuYJzPdrryDHhse%2FeNM1BWeok3EX1XNjNQduKqMldSsc3XJrTYt6KRSTlvOORIMJkuO9soa%2FQR7IzGfQLI8DXbxIXSDURe7Y9BNTgDdsqvguUG5QCFIno%2BoWNLxEI8ZfgHG7bb3wKRayUKgIGPEYxA6LLbNPrmgMhEEtp2TaKsLqFpum3XnSq%2FopcEofF4vXWduaOysNUGw1EATHrqv2FrXNL1nddkXelW03T9rofGdIa8rq3NiBknEriPz0HVm2Iq0FCoMN8MIKQEGeNbVkdF1IUB43awyRGpRMk6jK8wBr8tqDBMxOiaryTCJ4ngvRhUsKbpJX5IzdenNeFaaji%2BURXrjfGbuFN70QOMzT8qPB%2FekpdBBV6FHJToYn0CjSVejV4w%2FeYnOWWUv7z81aTJnsvitXL%2BiyendlwVtkiVSScuEbo3f3y0enF7nrJT4TKFAIVjop5TYW843N7f4xCXCxk04YUkMH6SJkmvLf86USnDrdGJNP6gu98jb23hE%2FgUFDlRfa8ip5TbQr3jmuidU43IJMT%2Ba5MT5RRKGH02N4%2FBnqlGpvCPHRgc9XXKpC8oa022WcdIMn%2BAlTS5QZGGhnSTXjeemcIiDC3rPcisaL5RTUj%2FhcJz6ZDIejT889dGRMuPN7sr90Nsjf4rXJWYIovCPxd3nppoLzum%2B8yXi1FEs8OIbXwXjWWMAke4M6D%2FbEwXHhJNq3J1bi%2BuCQ2l77HutzpwvzbcsUdDLNWWdnbU0eF9KDj2j%2F94zwzPLS3RH8AV0S8j%2FJCHBqmzr29ITDPBqOz%2Bmp4v4PGLx21xH76oCGHTgIyo39bU2NtMpZYHrnfVqB3B4CKZiCSi6zVLnsgFMwJLViuLNt26O%2B6WOnGZDtIvXAcVN69pwaFfNWKSlYPcLwi70BrAkwg%2Bvg%2BV%2BCMdhJ5L83es%2BaD4axu28h6UsFZN%2B9XuF0ZI3aLvP0f9LyqYe36ckeTdKog4lLqP52uOUnBwkkV%2BJoOQIQe8XM6MPFxenQ9EXVu8B47ijc17T%2FfixFf72Qt5VOKdngT7mt%2F%2FNubG9P%2Fai638A

## Componentes

### Backend (`backend/main.py`)
- FastAPI con un único endpoint `POST /api/generate-graph`.
- `CORSMiddleware` permitiendo el origen del dev server de Vite.
- Pydantic model `GenerateRequest { text: str }`.
- Lógica:
  1. Si hay `OPENAI_API_KEY` (u otra configurada) → llamar al LLM pidiendo JSON
     estricto, parsear y **validar** contra el esquema.
  2. Si no hay key, el LLM falla, o el JSON es inválido → devolver el **mock**
     de demo (ruta de Ciencia de Datos / IA, ≥ 6 nodos, 4 categorías).
- Salida SIEMPRE conforme a la skill `graph-schema` (sin `position`).

### Frontend (`frontend/`)
- Vite + React + TypeScript + TailwindCSS.
- Dependencias: `@xyflow/react`, `dagre`, `lucide-react`.
- Estructura de componentes:
  - `App.tsx`: estado (texto, grafo, nodo seleccionado), llamada a la API.
  - `GraphCanvas.tsx`: React Flow + layout con dagre (`rankdir: TB`).
  - `CustomNode.tsx`: nodo con borde/badge por color de categoría.
  - `NodeDrawer.tsx`: panel lateral derecho con contenido, tabla y
    "Ver Solución".
  - `lib/layout.ts`: helper dagre que asigna `position` a cada nodo.
  - `lib/colors.ts`: mapa categoría → color.
- Modo oscuro / diseño moderno con Tailwind.

## Contrato de datos
Definido en la skill `graph-schema` (fuente de verdad). Resumen:
`{ title, nodes[{ id, type:"customNode", data{ category, label, content,
tableData?, solution? } }], edges[{ id, source, target, animated }] }`.

## Decisiones KISS
- Sin estado de servidor: cada request es independiente.
- Sin build de producción requerido para la demo: basta `uvicorn` + `vite`.
- Colores fijos en el frontend; el backend solo manda `category`.
- El layout (posiciones) es responsabilidad del frontend (dagre), no del backend.
