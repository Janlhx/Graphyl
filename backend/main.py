"""GraphLearn backend — FastAPI single-file service.

KISS principle: no database, no auth, fully stateless.
Single core endpoint: POST /api/generate-graph.

It turns raw study text into a directed acyclic graph (DAG) following the
"sacred" JSON contract defined in the graph-schema skill. If an OpenAI key is
present it asks the LLM for strict JSON; otherwise (or on any failure) it falls
back to a rich pre-built demo mock so the demo never breaks.
"""

import json
import os
from typing import Any, Dict, List, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------

app = FastAPI(title="GraphLearn API", version="1.0.0")

# Wide-open CORS for the demo frontend (Vite dev server, etc.).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

VALID_CATEGORIES = {"concept", "table", "practice", "example"}


# ---------------------------------------------------------------------------
# Request model
# ---------------------------------------------------------------------------


class GenerateRequest(BaseModel):
    text: str


# ---------------------------------------------------------------------------
# Demo mock — rich, complete, Spanish content about ML fundamentals
# ---------------------------------------------------------------------------


def build_mock_graph() -> Dict[str, Any]:
    """Return a super-complete demo DAG about Machine Learning fundamentals.

    Covers all four categories (concept, table, practice, example), forms a
    top-down DAG with 7 connected nodes, and uses rich Spanish markdown.
    """
    return {
        "title": "Fundamentos de Machine Learning",
        "nodes": [
            {
                "id": "1",
                "type": "customNode",
                "data": {
                    "category": "concept",
                    "label": "¿Qué es el Machine Learning?",
                    "content": (
                        "El **Machine Learning (ML)** es una rama de la "
                        "Inteligencia Artificial que permite a los sistemas "
                        "**aprender patrones a partir de datos** sin ser "
                        "programados explícitamente para cada tarea.\n\n"
                        "La idea central: en lugar de escribir reglas a mano, "
                        "entrenamos un **modelo** que ajusta sus parámetros "
                        "para minimizar el error sobre los datos.\n\n"
                        "Fórmula clave del aprendizaje supervisado:\n\n"
                        "$$\\hat{y} = f_\\theta(x)$$\n\n"
                        "donde $x$ son las características de entrada, "
                        "$\\theta$ los parámetros aprendidos y $\\hat{y}$ la "
                        "predicción del modelo."
                    ),
                },
            },
            {
                "id": "2",
                "type": "customNode",
                "data": {
                    "category": "table",
                    "label": "Tipos de aprendizaje",
                    "content": (
                        "El ML se organiza en **tres grandes paradigmas** "
                        "según cómo se presenten los datos y la señal de "
                        "aprendizaje. Esta tabla resume sus diferencias "
                        "fundamentales."
                    ),
                    "tableData": [
                        {
                            "Tipo": "Supervisado",
                            "Datos": "Etiquetados (x, y)",
                            "Objetivo": "Predecir y a partir de x",
                            "Ejemplo": "Regresión, clasificación",
                        },
                        {
                            "Tipo": "No supervisado",
                            "Datos": "Sin etiquetas (solo x)",
                            "Objetivo": "Descubrir estructura oculta",
                            "Ejemplo": "Clustering, PCA",
                        },
                        {
                            "Tipo": "Por refuerzo",
                            "Datos": "Recompensas del entorno",
                            "Objetivo": "Maximizar recompensa acumulada",
                            "Ejemplo": "Agentes, control, juegos",
                        },
                    ],
                },
            },
            {
                "id": "3",
                "type": "customNode",
                "data": {
                    "category": "concept",
                    "label": "Entrenamiento y función de pérdida",
                    "content": (
                        "**Entrenar** un modelo significa encontrar los "
                        "parámetros $\\theta$ que minimizan una **función de "
                        "pérdida** $L$, que mide cuánto se equivoca el modelo.\n\n"
                        "Para regresión suele usarse el **error cuadrático "
                        "medio (MSE)**:\n\n"
                        "$$L(\\theta) = \\frac{1}{n} \\sum_{i=1}^{n} "
                        "(y_i - \\hat{y}_i)^2$$\n\n"
                        "La optimización se realiza típicamente con "
                        "**descenso de gradiente**, actualizando los "
                        "parámetros en la dirección que reduce la pérdida:\n\n"
                        "$$\\theta \\leftarrow \\theta - \\alpha "
                        "\\nabla_\\theta L$$\n\n"
                        "donde $\\alpha$ es la **tasa de aprendizaje**."
                    ),
                },
            },
            {
                "id": "4",
                "type": "customNode",
                "data": {
                    "category": "table",
                    "label": "Métricas de evaluación",
                    "content": (
                        "Tras entrenar, evaluamos el modelo con **métricas** "
                        "adecuadas a la tarea. Elegir la métrica correcta es "
                        "tan importante como el propio modelo."
                    ),
                    "tableData": [
                        {
                            "Métrica": "Accuracy",
                            "Tarea": "Clasificación",
                            "Qué mide": "% de aciertos totales",
                        },
                        {
                            "Métrica": "Precision",
                            "Tarea": "Clasificación",
                            "Qué mide": "Aciertos entre los positivos predichos",
                        },
                        {
                            "Métrica": "Recall",
                            "Tarea": "Clasificación",
                            "Qué mide": "Positivos reales detectados",
                        },
                        {
                            "Métrica": "RMSE",
                            "Tarea": "Regresión",
                            "Qué mide": "Raíz del error cuadrático medio",
                        },
                    ],
                },
            },
            {
                "id": "5",
                "type": "customNode",
                "data": {
                    "category": "concept",
                    "label": "Overfitting vs Underfitting",
                    "content": (
                        "El gran enemigo del ML es la **mala generalización**.\n\n"
                        "- **Underfitting (subajuste)**: el modelo es demasiado "
                        "simple y no captura el patrón. Alto error en "
                        "entrenamiento *y* en test.\n"
                        "- **Overfitting (sobreajuste)**: el modelo memoriza el "
                        "ruido de los datos de entrenamiento. Error bajo en "
                        "entrenamiento pero alto en test.\n\n"
                        "El equilibrio se describe con el **trade-off "
                        "sesgo-varianza**:\n\n"
                        "$$\\text{Error} = \\text{Sesgo}^2 + "
                        "\\text{Varianza} + \\text{Ruido}$$\n\n"
                        "Técnicas para mitigar overfitting: **regularización** "
                        "(L1/L2), **validación cruzada** y **más datos**."
                    ),
                },
            },
            {
                "id": "6",
                "type": "customNode",
                "data": {
                    "category": "example",
                    "label": "Caso práctico: predecir precios de casas",
                    "content": (
                        "Aplicamos todo lo anterior a un caso real: **predecir "
                        "el precio de una vivienda**.\n\n"
                        "1. **Datos**: superficie, nº de habitaciones, "
                        "ubicación, antigüedad → precio.\n"
                        "2. **Modelo**: una **regresión lineal** "
                        "$\\hat{y} = \\theta_0 + \\theta_1 x_1 + \\dots$.\n"
                        "3. **Pérdida**: MSE sobre el conjunto de "
                        "entrenamiento.\n"
                        "4. **Evaluación**: medimos **RMSE** sobre un conjunto "
                        "de test separado.\n\n"
                        "Si el RMSE en test es mucho mayor que en "
                        "entrenamiento, sospechamos **overfitting** y aplicamos "
                        "regularización."
                    ),
                },
            },
            {
                "id": "7",
                "type": "customNode",
                "data": {
                    "category": "practice",
                    "label": "Reto: calcula el MSE a mano",
                    "content": (
                        "**Ejercicio.** Un modelo predice los siguientes "
                        "precios (en miles de €) frente a los valores reales:\n\n"
                        "| Casa | Real ($y$) | Predicho ($\\hat{y}$) |\n"
                        "|------|-----------|----------------------|\n"
                        "| A    | 200       | 190                  |\n"
                        "| B    | 300       | 320                  |\n"
                        "| C    | 250       | 250                  |\n\n"
                        "Calcula el **error cuadrático medio (MSE)**. "
                        "Pulsa **Ver Solución** cuando lo tengas."
                    ),
                    "solution": (
                        "**Solución paso a paso:**\n\n"
                        "1. Calcular el error de cada casa $(y - \\hat{y})$:\n"
                        "   - Casa A: $200 - 190 = 10$\n"
                        "   - Casa B: $300 - 320 = -20$\n"
                        "   - Casa C: $250 - 250 = 0$\n\n"
                        "2. Elevar cada error al cuadrado:\n"
                        "   - $10^2 = 100$\n"
                        "   - $(-20)^2 = 400$\n"
                        "   - $0^2 = 0$\n\n"
                        "3. Sumar los errores cuadrados: $100 + 400 + 0 = 500$.\n\n"
                        "4. Dividir entre el número de casas ($n = 3$):\n\n"
                        "   $$MSE = \\frac{500}{3} \\approx 166.67$$\n\n"
                        "**Resultado: el MSE es aproximadamente 166.67** "
                        "(en miles de €²)."
                    ),
                },
            },
        ],
        "edges": [
            {"id": "e1-2", "source": "1", "target": "2", "animated": True},
            {"id": "e1-3", "source": "1", "target": "3", "animated": True},
            {"id": "e3-4", "source": "3", "target": "4", "animated": True},
            {"id": "e3-5", "source": "3", "target": "5", "animated": True},
            {"id": "e4-6", "source": "4", "target": "6", "animated": True},
            {"id": "e5-6", "source": "5", "target": "6", "animated": True},
            {"id": "e6-7", "source": "6", "target": "7", "animated": True},
        ],
    }


# ---------------------------------------------------------------------------
# Validation — enforce the sacred JSON contract before responding
# ---------------------------------------------------------------------------


def is_valid_graph(graph: Any) -> bool:
    """Validate that the graph matches the graph-schema contract.

    Returns True only if the structure is safe to send to the frontend.
    Any deviation returns False so the caller can fall back to the mock.
    """
    if not isinstance(graph, dict):
        return False

    # title
    if not isinstance(graph.get("title"), str) or not graph["title"].strip():
        return False

    nodes = graph.get("nodes")
    edges = graph.get("edges")
    if not isinstance(nodes, list) or not isinstance(edges, list):
        return False
    if len(nodes) == 0:
        return False

    node_ids: set = set()
    for node in nodes:
        if not isinstance(node, dict):
            return False
        node_id = node.get("id")
        if not isinstance(node_id, str) or not node_id:
            return False
        if node.get("type") != "customNode":
            return False
        data = node.get("data")
        if not isinstance(data, dict):
            return False
        category = data.get("category")
        if category not in VALID_CATEGORIES:
            return False
        if not isinstance(data.get("label"), str) or not data["label"]:
            return False
        if not isinstance(data.get("content"), str) or not data["content"]:
            return False
        # Category-specific optional fields.
        if category == "table":
            table_data = data.get("tableData")
            if not isinstance(table_data, list) or len(table_data) == 0:
                return False
            if not all(isinstance(row, dict) for row in table_data):
                return False
        if category == "practice":
            solution = data.get("solution")
            if not isinstance(solution, str) or not solution:
                return False
        node_ids.add(node_id)

    # edges must reference existing nodes and keep the e<src>-<tgt> shape.
    for edge in edges:
        if not isinstance(edge, dict):
            return False
        source = edge.get("source")
        target = edge.get("target")
        if source not in node_ids or target not in node_ids:
            return False
        if not isinstance(edge.get("id"), str) or not edge["id"]:
            return False
        if edge.get("animated") is not True:
            return False

    return True


# ---------------------------------------------------------------------------
# LLM generation (optional) — only used when OPENAI_API_KEY is present
# ---------------------------------------------------------------------------


def _build_prompt(text: str) -> str:
    """Build the instruction asking the LLM for strict schema-compliant JSON."""
    return (
        "Eres un diseñador de rutas de aprendizaje. A partir del TEXTO del "
        "usuario, genera un Grafo Dirigido Acíclico (DAG) de arriba a abajo "
        "como ruta de estudio paso a paso.\n\n"
        "Devuelve EXCLUSIVAMENTE un JSON válido con esta estructura EXACTA:\n"
        '{"title": str, "nodes": [{"id": str, "type": "customNode", '
        '"data": {"category": "concept|table|practice|example", "label": str, '
        '"content": str (markdown), "tableData": [objeto fila] solo si '
        'category=table, "solution": str solo si category=practice}}], '
        '"edges": [{"id": "e<source>-<target>", "source": str, "target": str, '
        '"animated": true}]}\n\n'
        "Reglas:\n"
        "- type SIEMPRE 'customNode'. NO incluyas 'position'.\n"
        "- Usa las 4 categorías cuando el contenido lo permita.\n"
        "- category=table requiere 'tableData' (array de objetos fila).\n"
        "- category=practice requiere 'solution' detallada paso a paso.\n"
        "- Mínimo 6 nodos conectados formando un DAG sin ciclos.\n"
        "- Contenido en español y en markdown.\n\n"
        f"TEXTO:\n{text}"
    )


def generate_with_llm(text: str) -> Optional[Dict[str, Any]]:
    """Try to generate a graph with OpenAI. Return None on any failure.

    The whole openai import/usage is wrapped so a missing library or a down
    network never breaks the service — the caller falls back to the mock.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None

    try:
        from openai import OpenAI  # imported lazily so absence never breaks boot

        client = OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            messages=[
                {
                    "role": "system",
                    "content": "You output only valid JSON, no prose.",
                },
                {"role": "user", "content": _build_prompt(text)},
            ],
            response_format={"type": "json_object"},
            temperature=0.4,
        )
        raw = response.choices[0].message.content
        graph = json.loads(raw)
        return graph
    except Exception:
        # Network error, bad key, invalid JSON, missing lib — all swallowed.
        return None


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.post("/api/generate-graph")
def generate_graph(request: GenerateRequest) -> Dict[str, Any]:
    """Generate a learning-path DAG from input text.

    Strategy: try the LLM (only if a key exists and input is non-trivial),
    validate the result against the contract, and fall back to the rich demo
    mock whenever anything is missing, fails, or is invalid.
    """
    text = (request.text or "").strip()

    graph: Optional[Dict[str, Any]] = None
    if text:
        graph = generate_with_llm(text)

    # Validate the LLM output; on any problem use the mock.
    if graph is None or not is_valid_graph(graph):
        graph = build_mock_graph()

    return graph
