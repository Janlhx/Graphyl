import { motion } from "framer-motion";
import { Loader2, Sparkles, Wand2 } from "lucide-react";

interface CommandBarProps {
  text: string;
  onTextChange: (value: string) => void;
  onGenerate: () => void;
  onLoadDemo: () => void;
  loading: boolean;
}

// Floating Raycast-style command bar with glassmorphism and an animated
// conic "border beam" that spins while the graph is being generated.
function CommandBar({
  text,
  onTextChange,
  onGenerate,
  onLoadDemo,
  loading,
}: CommandBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd/Ctrl + Enter triggers generation.
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      onGenerate();
    }
  };

  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 240, damping: 26 }}
      className="pointer-events-none absolute inset-x-0 bottom-6 z-30 flex justify-center px-4"
    >
      <div className="pointer-events-auto relative w-full max-w-2xl">
        {/* Animated border beam (only visible while generating). */}
        {loading && (
          <div className="absolute -inset-px overflow-hidden rounded-2xl">
            <div
              className="absolute left-1/2 top-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 animate-border-beam"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, #38bdf8 40deg, #a855f7 90deg, transparent 130deg)",
              }}
            />
          </div>
        )}

        {/* Glass surface. */}
        <div className="relative rounded-2xl border border-white/10 bg-zinc-950/80 p-2.5 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-end gap-2">
            <div className="flex flex-1 items-start gap-2.5 px-2.5 py-1.5">
              <Sparkles size={16} className="mt-2 flex-shrink-0 text-sky-400" />
              <textarea
                value={text}
                onChange={(e) => onTextChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pega tus apuntes y genera la ruta de aprendizaje…  (⌘↵)"
                rows={1}
                className="max-h-40 min-h-[40px] w-full resize-none bg-transparent py-1.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
              />
            </div>

            <div className="flex flex-shrink-0 items-center gap-2">
              <button
                onClick={onLoadDemo}
                disabled={loading}
                className="hidden items-center gap-1.5 rounded-xl border border-white/[0.08] px-3 py-2.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.06] disabled:opacity-50 sm:inline-flex"
              >
                <Wand2 size={14} />
                Ejemplo
              </button>

              <button
                onClick={onGenerate}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-all hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Sparkles size={15} />
                )}
                {loading ? "Generando" : "Generar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default CommandBar;
