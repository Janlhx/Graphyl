import { Handle, Position } from "@xyflow/react";
import type { NodeProps, Node } from "@xyflow/react";
import { motion } from "framer-motion";
import { BookOpen, Table2, Target, Lightbulb } from "lucide-react";
import { getCategoryStyle } from "../lib/colors";
import { cn } from "../lib/cn";
import type { NodeData, NodeCategory } from "../types";

// Icon per category for a refined, non-generic look.
const CATEGORY_ICON: Record<NodeCategory, typeof BookOpen> = {
  concept: BookOpen,
  table: Table2,
  practice: Target,
  example: Lightbulb,
};

type GraphylNodeType = Node<NodeData, "customNode">;

// Dark, high-end node card with a neon accent indicator, spring entrance and a
// category-colored hover glow. No loud fills — Linear / Raycast aesthetic.
function GraphylNode({ data, selected }: NodeProps<GraphylNodeType>) {
  const style = getCategoryStyle(data.category);
  const Icon = CATEGORY_ICON[data.category] ?? BookOpen;
  const isPractice = data.category === "practice";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      whileHover={{ y: -2 }}
      className={cn(
        "group relative w-[260px] rounded-2xl border border-zinc-800 bg-zinc-900/90 px-4 py-3",
        "backdrop-blur-md shadow-lg transition-shadow duration-300",
        style.glow,
        selected && "border-white/20"
      )}
      style={{
        boxShadow: selected
          ? `0 0 0 1px rgba(${style.glowRgb},0.5), 0 0 30px -6px rgba(${style.glowRgb},0.35)`
          : undefined,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-1.5 !w-1.5 !border-0"
        style={{ background: style.accent }}
      />

      <div className="flex items-center gap-2.5">
        {/* Neon indicator dot (with soft pulse for practice). */}
        <span className="relative flex h-2.5 w-2.5 flex-shrink-0 items-center justify-center">
          {isPractice && (
            <span
              className="absolute inline-flex h-full w-full rounded-full animate-pulse-ring"
              style={{ background: style.accent }}
            />
          )}
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
            style={{
              background: style.accent,
              boxShadow: `0 0 8px ${style.accent}`,
            }}
          />
        </span>

        <span
          className={cn(
            "rounded-md px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider",
            style.badge
          )}
        >
          {style.label}
        </span>

        <Icon
          size={14}
          className="ml-auto text-zinc-500 transition-colors group-hover:text-zinc-300"
        />
      </div>

      <div className="mt-2.5 text-[13px] font-semibold leading-snug tracking-tight text-zinc-100">
        {data.label}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-1.5 !w-1.5 !border-0"
        style={{ background: style.accent }}
      />
    </motion.div>
  );
}

export default GraphylNode;
