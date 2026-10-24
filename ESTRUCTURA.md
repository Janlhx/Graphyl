# Estructura del proyecto — Graphyl

Graphyl convierte texto o apuntes en un **grafo de aprendizaje (DAG)**
interactivo. Backend en FastAPI, frontend en React + React Flow.

```
kiro-day/
├── backend/                  # API (FastAPI, un solo archivo)
│   ├── main.py               # POST /api/generate-graph + GET /health + mock fallback
│   └── requirements.txt      # fastapi, uvicorn, pydantic, openai (opcional)
│
├── frontend/                 # App web (Vite + React + TS + Tailwind)
│   ├── index.html
│   ├── serve_dist.py         # Sirve el build estático detrás del proxy /proxy/5173/
│   ├── vite.config.ts        # base, host, proxy
│   ├── tailwind.config.js    # tema Obsidian & Zinc + animaciones
│   └── src/
│       ├── App.tsx           # Layout: lienzo + command bar + drawer
│       ├── main.tsx          # Entry point
│       ├── index.css         # Estilos globales (dark, spotlight, React Flow)
│       ├── types.ts          # Tipos del esquema graph-schema
│       ├── components/
│       │   ├── CommandBar.tsx     # Barra de comandos flotante (Raycast + border beam)
│       │   ├── GraphCanvas.tsx    # Lienzo React Flow (dots + spotlight)
│       │   ├── GraphylNode.tsx    # Nodo custom con glow neón + animación spring
│       │   ├── DataPulseEdge.tsx  # Aristas animadas tipo pulso de datos
│       │   └── NodeDrawer.tsx     # Panel lateral animado (+ confetti en practice)
│       └── lib/
│           ├── api.ts         # fetch al backend
│           ├── layout.ts      # Auto-layout vertical con dagre
│           ├── colors.ts      # Paleta neón por categoría de nodo
│           ├── cn.ts          # Helper clsx + tailwind-merge
│           └── demo.ts        # Texto de ejemplo (Ciencia de Datos)
│
└── .kiro/                    # Configuración del entorno Kiro
    ├── steering/             # Reglas del proyecto (producto, tech, frontend)
    ├── skills/               # graph-schema: contrato JSON backend ↔ frontend
    ├── agents/               # arquitecto, backend-dev, frontend-dev, tech-lead
    ├── specs/                # Spec del MVP (requirements, design, tasks)
    ├── hooks/                # guard-shell: bloquea comandos destructivos
    └── settings/mcp.json     # Servidores MCP (draw.io, shadcn)
```

## Categorías de nodo

| Categoría  | Color            | Contenido                          |
|------------|------------------|------------------------------------|
| `concept`  | Cyan             | Teoría / teorema + fórmula clave   |
| `table`    | Violeta          | Tabla comparativa (`tableData`)    |
| `practice` | Rojo coral       | Ejercicio + solución oculta        |
| `example`  | Verde esmeralda  | Caso de uso aplicado               |

## Cómo arrancar

**Backend** (puerto 8000):
```bash
cd backend
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Frontend** (puerto 5173):
```bash
cd frontend
npm install
npm run build
python3 serve_dist.py     # o: npm run dev (desarrollo)
```

> Sin `OPENAI_API_KEY` el backend usa un grafo de demostración (fallback),
> así que la app funciona siempre.
```
