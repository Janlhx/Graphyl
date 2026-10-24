import { BaseEdge, getBezierPath, type EdgeProps } from "@xyflow/react";

// Custom edge drawn as a subtle gradient "data pulse": a faint static track
// plus an animated dashed stroke that flows from source to target.
function DataPulseEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const gradientId = `pulse-gradient-${id}`;

  return (
    <>
      <defs>
        <linearGradient id={gradientId} gradientUnits="userSpaceOnUse"
          x1={sourceX} y1={sourceY} x2={targetX} y2={targetY}>
          <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#a855f7" stopOpacity={0.5} />
        </linearGradient>
      </defs>

      {/* Faint static track. */}
      <BaseEdge
        id={`${id}-track`}
        path={edgePath}
        style={{ stroke: "rgba(255,255,255,0.06)", strokeWidth: 1.5 }}
      />

      {/* Animated flowing dashes on top (the "pulse"). */}
      <path
        d={edgePath}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={1.75}
        strokeDasharray="6 10"
        className="animate-dash-flow"
      />
    </>
  );
}

export default DataPulseEdge;
