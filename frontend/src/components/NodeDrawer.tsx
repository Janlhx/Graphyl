import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import confetti from "canvas-confetti";
import { Eye, EyeOff, X } from "lucide-react";
import { getCategoryStyle } from "../lib/colors";
import { cn } from "../lib/cn";
import type { NodeData, TableRow } from "../types";

interface NodeDrawerProps {
  node: NodeData | null;
  onClose: () => void;
}

// Fire a short, tasteful confetti burst to celebrate revealing a solution.
function celebrate(color: string) {
  confetti({
    particleCount: 70,
    spread: 65,
    startVelocity: 35,
    scalar: 0.8,
    origin: { x: 0.82, y: 0.5 },
    colors: [color, "#ffffff", "#e4e4e7"],
    disableForReducedMotion: true,
  });
}

// Animated right-side drawer (spring physics) showing the selected node detail.
function NodeDrawer({ node, onClose }: NodeDrawerProps) {
  const [showSolution, setShowSolution] = useState(false);

  // Reset the solution reveal whenever a different node is opened.
  useEffect(() => {
    setShowSolution(false);
  }, [node]);

  const style = node ? getCategoryStyle(node.category) : null;

  const handleToggleSolution = () => {
    setShowSolution((prev) => {
      const next = !prev;
      if (next && style) celebrate(style.accent);
      return next;
    });
  };

  return (
    <AnimatePresence>
      {node && style && (
        <>
          {/* Click-outside overlay. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 z-20 flex h-full w-full max-w-md flex-col border-l border-white/[0.08] bg-zinc-950/80 backdrop-blur-2xl shadow-2xl"
            role="dialog"
            aria-label={node.label}
          >
            {/* Neon accent line at the very top. */}
            <div
              className="h-px w-full"
              style={{
                background: `linear-gradient(90deg, transparent, ${style.accent}, transparent)`,
              }}
            />

            <header className="flex items-start justify-between gap-3 border-b border-white/[0.06] p-5">
              <div>
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider",
                    style.badge
                  )}
                >
                  {style.label}
                </span>
                <h2 className="mt-2.5 text-lg font-bold tracking-tight text-zinc-50">
                  {node.label}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-zinc-100"
                aria-label="Cerrar panel"
              >
                <X size={18} />
              </button>
            </header>

            <div className="graphyl-scroll flex-1 overflow-y-auto p-5">
              <div className="graphyl-prose max-w-none text-[13.5px] leading-relaxed text-zinc-300">
                <ReactMarkdown>{node.content}</ReactMarkdown>
              </div>

              {node.category === "table" && node.tableData && (
                <TablePreview rows={node.tableData} accent={style.accent} />
              )}

              {node.category === "practice" && node.solution && (
                <div className="mt-6">
                  <button
                    onClick={handleToggleSolution}
                    className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-all"
                    style={{
                      color: style.accent,
                      borderColor: `${style.accent}40`,
                      background: `${style.accent}12`,
                    }}
                  >
                    {showSolution ? <EyeOff size={16} /> : <Eye size={16} />}
                    {showSolution ? "Ocultar Solución" : "Ver Solución"}
                  </button>

                  <AnimatePresence>
                    {showSolution && (
                      <motion.div
                        initial={{ opacity: 0, filter: "blur(8px)", height: 0 }}
                        animate={{
                          opacity: 1,
                          filter: "blur(0px)",
                          height: "auto",
                        }}
                        exit={{ opacity: 0, filter: "blur(8px)", height: 0 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="graphyl-prose mt-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-[13px] leading-relaxed text-zinc-200">
                          <ReactMarkdown>{node.solution}</ReactMarkdown>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// Renders row objects as a table; columns are the union of all keys.
function TablePreview({ rows, accent }: { rows: TableRow[]; accent: string }) {
  if (rows.length === 0) return null;

  const columns = Array.from(
    rows.reduce<Set<string>>((set, row) => {
      Object.keys(row).forEach((k) => set.add(k));
      return set;
    }, new Set())
  );

  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-white/[0.08]">
      <table className="w-full border-collapse text-left text-[13px]">
        <thead>
          <tr style={{ background: `${accent}14` }}>
            {columns.map((col) => (
              <th
                key={col}
                className="border-b border-white/[0.08] px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-wide text-zinc-200"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="odd:bg-white/[0.02]">
              {columns.map((col) => (
                <td
                  key={col}
                  className="border-b border-white/[0.04] px-3 py-2 text-zinc-300"
                >
                  {row[col] ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NodeDrawer;
