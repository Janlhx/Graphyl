import { useMemo } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import GraphylNode from "./GraphylNode";
import DataPulseEdge from "./DataPulseEdge";
import { layoutGraph } from "../lib/layout";
import type { GraphData, NodeData } from "../types";

const nodeTypes = { customNode: GraphylNode };
const edgeTypes = { dataPulse: DataPulseEdge };

interface GraphCanvasProps {
  graph: GraphData;
  onNodeSelect: (node: NodeData) => void;
}

// High-end React Flow canvas: dotted background, soft radial spotlight and
// animated data-pulse edges over a dagre top-to-bottom layout.
function GraphCanvas({ graph, onNodeSelect }: GraphCanvasProps) {
  const { nodes, edges } = useMemo(() => {
    const rawNodes: Node<NodeData>[] = graph.nodes.map((n) => ({
      id: n.id,
      type: "customNode",
      data: n.data,
      position: { x: 0, y: 0 },
    }));

    const rawEdges: Edge[] = graph.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: "dataPulse",
      animated: e.animated ?? true,
    }));

    return {
      nodes: layoutGraph(rawNodes, rawEdges),
      edges: rawEdges,
    };
  }, [graph]);

  return (
    <div className="graphyl-spotlight h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={(_, node) => onNodeSelect(node.data as NodeData)}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        proOptions={{ hideAttribution: true }}
        minZoom={0.3}
      >
        <Background
          variant={BackgroundVariant.Dots}
          color="#27272a"
          gap={20}
          size={1}
        />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

export default GraphCanvas;
