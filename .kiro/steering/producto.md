---
inclusion: always
---

# Producto: GraphLearn

## Qué estamos construyendo
Una web app donde el usuario pega cualquier texto o apuntes de estudio y la app
genera un **Grafo Dirigido Acíclico (DAG)** interactivo que funciona como una
**ruta de aprendizaje paso a paso**. El grafo se recorre de arriba a abajo:
cada nodo es un paso, y las aristas marcan el orden sugerido de estudio.

## Interacción núcleo
- El usuario pega texto → la app genera el grafo.
- Al hacer **clic en un nodo**, se abre un **panel lateral (Drawer)** a la
  derecha que muestra el detalle completo de ese nodo.

## Tipos de nodo (por color)
Los nodos se dividen por colores según su tipo (`category`):

- **Azul (`concept`)**: Teoría o teoremas explicados fácil + fórmula clave.
- **Morado (`table`)**: Tablas comparativas o resúmenes estructurados de datos
  extraídos del texto.
- **Rojo (`practice`)**: Reto práctico o ejercicio basado en el texto. Incluye
  un botón interactivo de **"Ver Solución"** cuya solución está **oculta por
  defecto** y se revela al pulsarlo.
- **Verde (`example`)**: Caso de uso práctico o ejemplo aplicado.

## Principios
- KISS: lo más simple que funcione para una demo rápida.
- Sin estado persistente: cada generación es independiente (stateless).
- Español como idioma del producto y de la comunicación del equipo.
