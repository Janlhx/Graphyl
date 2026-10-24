---
name: graph-schema
description: Esquema JSON exacto que conecta el LLM en FastAPI con React Flow. Úsala siempre al programar el backend o el frontend del grafo.
---

# Esquema JSON del grafo (GraphLearn)

Este es el **contrato sagrado** entre el backend (FastAPI + LLM) y el frontend
(React Flow). La respuesta del endpoint `POST /api/generate-graph` **SIEMPRE**
debe tener exactamente esta estructura.

## Estructura exacta

```json
{
  "title": "string",
  "nodes": [
    {
      "id": "1",
      "type": "customNode",
      "data": {
        "category": "concept|table|practice|example",
        "label": "Título corto",
        "content": "Explicación markdown",
        "tableData": [{ "col1": "val1" }],
        "solution": "Solución oculta solo para category practice"
      }
    }
  ],
  "edges": [
    { "id": "e1-2", "source": "1", "target": "2", "animated": true }
  ]
}
```

## Reglas del contrato

- `title`: título general de la ruta de aprendizaje.
- `nodes[].id`: string único (ej. `"1"`, `"2"`, …).
- `nodes[].type`: SIEMPRE `"customNode"`.
- `nodes[].data.category`: uno de `concept` | `table` | `practice` | `example`.
  - `concept` → Azul: teoría/teorema + fórmula clave.
  - `table` → Morado: usar `tableData` (array de objetos fila).
  - `practice` → Rojo: usar `solution` (texto oculto hasta "Ver Solución").
  - `example` → Verde: caso de uso o ejemplo aplicado.
- `nodes[].data.label`: título corto del nodo.
- `nodes[].data.content`: explicación en markdown.
- `nodes[].data.tableData`: array de objetos **solo** para `category: table`.
  Las claves de cada objeto son las columnas. Omitir o `null` en otros tipos.
- `nodes[].data.solution`: string **solo** para `category: practice`. Omitir o
  `null` en otros tipos.
- `edges[].id`: formato `e<source>-<target>` (ej. `"e1-2"`).
- `edges[].source` / `edges[].target`: ids de nodos existentes.
- `edges[].animated`: `true` para marcar el flujo de la ruta.

## Notas de implementación

- El grafo debe ser un **DAG** (sin ciclos): las aristas van del paso previo al
  siguiente, formando una ruta de arriba a abajo.
- El **auto-layout vertical** lo calcula `dagre` en el frontend; el backend NO
  envía coordenadas `position`, solo nodos y aristas.
- El backend debe **validar** que su salida cumple este esquema antes de
  devolverla; si el LLM falla o la red cae, devolver el **mock** con esta misma
  estructura.
