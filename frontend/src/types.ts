// Types that mirror the sacred graph-schema contract between the FastAPI
// backend (LLM) and the React Flow frontend.

export type NodeCategory = "concept" | "table" | "practice" | "example";

// A single row of a comparison/summary table. Keys are the column names.
export type TableRow = Record<string, string>;

export interface NodeData {
  category: NodeCategory;
  label: string;
  content: string;
  // Only present for category "table".
  tableData?: TableRow[] | null;
  // Only present for category "practice".
  solution?: string | null;
  // Index signature required by React Flow's generic node data.
  [key: string]: unknown;
}

export interface GraphNode {
  id: string;
  type: "customNode";
  data: NodeData;
  // Position is computed on the frontend by dagre; the backend omits it.
  position?: { x: number; y: number };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

export interface GraphData {
  title: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
}
