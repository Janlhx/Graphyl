---
inclusion: always
---

# Stack tecnológico (Principio KISS)

Mantén todo lo más simple posible: **CERO bases de datos, CERO autenticación,
todo stateless y directo al grano** para una demo funcional rápida.

## Frontend
- **React + Vite + TypeScript**.
- **TailwindCSS** para estilos.
- **`@xyflow/react`** (React Flow) para renderizar el grafo interactivo.
- **`dagre`** para el auto-layout automático de arriba a abajo (top-to-bottom).
- **`lucide-react`** para los iconos.

## Backend
- **Python + FastAPI**, en un solo archivo **`main.py`**.
- **Un único endpoint**: `POST /api/generate-graph`.
  - Recibe: `{"text": "..."}`.
  - Devuelve: el JSON **estricto** de `nodes` y `edges` (ver skill
    `graph-schema`).
- **Modo fallback/mock**: si falla la red o el LLM durante la demo, devuelve un
  grafo mock pre-cargado para que la demo nunca se caiga.

## Convenciones
- Código y comentarios en inglés; comunicación con el usuario en español.
- Sin bases de datos, sin auth, sin sesiones: todo stateless.
- El esquema JSON entre backend y frontend es SAGRADO: seguir siempre la skill
  `graph-schema`.
- Nada de secretos en el código ni en el repo.
