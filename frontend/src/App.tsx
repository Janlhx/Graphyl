import { useCallback, useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Network, Waypoints } from "lucide-react";
import GraphCanvas from "./components/GraphCanvas";
import NodeDrawer from "./components/NodeDrawer";
import CommandBar from "./components/CommandBar";
import { generateGraph } from "./lib/api";
import { DEMO_TEXT } from "./lib/demo";
import type { GraphData, NodeData } from "./types";

function App() {
  const [text, setText] = useState("");
  const [graph, setGraph] = useState<GraphData | null>(null);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runGeneration = useCallback(async (input: string) => {
    if (!input.trim()) {
      setError("Pega algún texto antes de generar la ruta de aprendizaje.");
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedNode(null);

    try {
      const data = await generateGraph(input);
      setGraph(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido.";
      setError(
        `No se pudo generar el grafo. ¿Está el backend en marcha en el ` +
          `puerto 8000? Detalle: ${message}`
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGenerate = () => void runGeneration(text);

  const handleLoadDemo = () => {
    setText(DEMO_TEXT);
    void runGeneration(DEMO_TEXT);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Top-left brand mark. */}
      <div className="pointer-events-none absolute left-6 top-5 z-30 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur-xl">
          <Waypoints size={16} className="text-sky-400" />
        </div>
        <div className="leading-none">
          <span className="text-[15px] font-semibold tracking-tight text-zinc-100">
            Graphyl
          </span>
          {graph && (
            <p className="mt-0.5 font-mono text-[10px] text-zinc-500">
              {graph.nodes.length} nodos · ruta generada
            </p>
          )}
        </div>
      </div>

      {/* Full-bleed canvas. */}
      <main className="absolute inset-0">
        {graph ? (
          <ReactFlowProvider>
            <GraphCanvas graph={graph} onNodeSelect={setSelectedNode} />
          </ReactFlowProvider>
        ) : (
          <EmptyState />
        )}
      </main>

      {/* Error toast. */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="absolute left-1/2 top-5 z-40 flex -translate-x-1/2 items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-950/60 px-4 py-3 text-sm text-rose-200 backdrop-blur-xl"
          >
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <span className="max-w-md">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Raycast-style floating command bar. */}
      <CommandBar
        text={text}
        onTextChange={setText}
        onGenerate={handleGenerate}
        onLoadDemo={handleLoadDemo}
        loading={loading}
      />

      {/* Animated right-side drawer. */}
      <NodeDrawer node={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  );
}

// Elegant empty state shown before the first graph is generated.
function EmptyState() {
  return (
    <div className="graphyl-spotlight flex h-full flex-col items-center justify-center gap-5 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl"
      >
        <Network size={28} className="text-zinc-400" />
      </motion.div>
      <div className="max-w-sm">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          Convierte apuntes en rutas
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">
          Pega cualquier texto y Graphyl construye un grafo de aprendizaje
          interactivo paso a paso. Prueba{" "}
          <span className="font-medium text-zinc-300">Ejemplo</span> para
          empezar.
        </p>
      </div>
    </div>
  );
}

export default App;
