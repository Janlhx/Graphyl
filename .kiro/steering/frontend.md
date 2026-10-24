---
inclusion: fileMatch
fileMatchPattern: "**/*.{tsx,jsx}"
---

# Reglas de Frontend (GraphLearn)

## Estética
- Diseño **limpio tipo modo oscuro / moderno**.
- Fondo oscuro, tipografía clara, espaciado generoso.

## Nodos customizados (React Flow)
- Un único componente de nodo custom (`customNode`) que renderiza su contenido
  según `data.category`.
- Cada nodo lleva **borde y badge con el color de su tipo**:
  - `concept` → **Azul**
  - `table` → **Morado**
  - `practice` → **Rojo**
  - `example` → **Verde**
- Handles de conexión arriba (target) y abajo (source) para el layout vertical.

## Panel lateral (Drawer)
- **Drawer a la derecha** que se abre al seleccionar un nodo.
- Muestra el detalle del nodo: título, contenido markdown y, según el tipo:
  - `table` → renderiza `data.tableData` como tabla.
  - `practice` → botón **"Ver Solución"** que revela `data.solution`
    (oculta por defecto).
- Se cierra con un botón o al hacer clic fuera.

## Convenciones
- Componentes funcionales con hooks; nada de componentes de clase.
- Seguir siempre el esquema JSON de la skill `graph-schema`.
- Código en inglés; textos de UI en español.
