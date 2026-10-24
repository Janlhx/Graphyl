import dagre from "dagre";
import { Position } from "@xyflow/react";
import type { Edge, Node } from "@xyflow/react";
import type { NodeData } from "../types";

// Approximate node dimensions used by dagre to compute spacing.
const NODE_WIDTH = 260;
const NODE_HEIGHT = 90;

// Runs a top-to-bottom (TB) dagre layout over nodes + edges that have no
// position yet, returning the same nodes with computed positions.
export function layoutGraph(
  nodes: Node<NodeData>[],
  edges: Edge[]
): Node<NodeData>[] {
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ rankdir: "TB", nodesep: 60, ranksep: 90 });

  nodes.forEach((node) => {
    graph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);

  return nodes.map((node) => {
    const { x, y } = graph.node(node.id);
    return {
      ...node,
      // Target/source handles are vertical for a TB flow.
      targetPosition: Position.Top,
      sourcePosition: Position.Bottom,
      // dagre returns the node center; React Flow expects the top-left corner.
      position: {
        x: x - NODE_WIDTH / 2,
        y: y - NODE_HEIGHT / 2,
      },
    };
  });
}
