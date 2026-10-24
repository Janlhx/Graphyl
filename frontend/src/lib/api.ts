import type { GraphData } from "../types";

// Resolve the backend URL from the current page URL. Behind code-server the
// app is served at .../proxy/5173/ and the backend at .../proxy/8000/, so we
// swap the port segment. Locally (no /proxy/ segment) we fall back to the
// backend on localhost:8000.
function resolveApiUrl(): string {
  const { origin, pathname } = window.location;
  const proxyMatch = pathname.match(/\/proxy\/\d+\//);
  if (proxyMatch) {
    return `${origin}/proxy/8000/api/generate-graph`;
  }
  return "http://localhost:8000/api/generate-graph";
}

const API_URL = resolveApiUrl();

// Calls the backend to generate a learning-path graph from raw text.
export async function generateGraph(text: string): Promise<GraphData> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    throw new Error(`El servidor respondió con el estado ${res.status}.`);
  }

  return (await res.json()) as GraphData;
}
