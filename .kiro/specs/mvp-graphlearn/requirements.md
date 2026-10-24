# Requisitos — MVP GraphLearn

## Visión
GraphLearn convierte texto o apuntes de estudio en un **DAG interactivo** que
funciona como ruta de aprendizaje paso a paso. Principio **KISS**: sin base de
datos, sin autenticación, todo stateless.

## Requisitos funcionales

### RF1 — Generar ruta desde texto
- Como usuario, pego texto en un `textarea` y pulso "Generar Ruta de Aprendizaje".
- El frontend llama a `POST /api/generate-graph` con `{"text": "..."}`.
- El backend devuelve el JSON del grafo (`title`, `nodes`, `edges`) según el
  contrato de la skill `graph-schema`.

### RF2 — Ejemplo demo
- Un botón "Cargar Ejemplo Demo" rellena el textarea (o dispara el fallback) con
  un tema de **Ciencia de Datos / IA** y genera la ruta sin necesidad de red.

### RF3 — Generación inteligente con fallback
- El backend usa un LLM si hay API key configurada.
- Si NO hay API key o falla la red, usa un **generador de demostración** que
  devuelve una ruta completa (mínimo 6 nodos) sobre Ciencia de Datos / IA.
- La ruta siempre incluye las **4 categorías**: `concept`, `table`, `practice`,
  `example`.

### RF4 — Visualización del grafo
- El lienzo central (React Flow) renderiza los nodos con auto-layout vertical
  calculado con `dagre` (de arriba a abajo, forma de árbol).
- Cada nodo tiene **borde y badge con el color de su categoría**:
  - Azul = `concept`, Morado = `table`, Rojo = `practice`, Verde = `example`.

### RF5 — Panel lateral (Drawer)
- Al hacer clic en un nodo se abre un panel a la derecha con su contenido rico
  (markdown).
- Si la categoría es `table`, se renderiza `tableData` como tabla.
- Si la categoría es `practice` (rojo), se muestra el problema y un botón
  **"Ver Solución"** que revela `solution` (oculta por defecto).

## Requisitos no funcionales
- **RNF1 (KISS)**: cero DB, cero auth, backend en un único `main.py`.
- **RNF2 (CORS)**: el backend habilita CORS para el dev server de Vite.
- **RNF3 (Resiliencia de demo)**: nunca debe caerse en vivo; fallback siempre
  disponible.
- **RNF4 (Contrato)**: backend y frontend respetan el esquema `graph-schema`.
