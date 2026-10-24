import type { NodeCategory } from "../types";

// Neon accent system for the Obsidian & Zinc design. Cards stay dark; each
// category is identified by an elegant neon indicator, badge and hover glow.
export interface CategoryStyle {
  // Spanish label for the badge.
  label: string;
  // Neon accent color (hex) for indicator dot, badge text and edge stroke.
  accent: string;
  // Tailwind classes for the category badge (translucent, neon text).
  badge: string;
  // Tailwind hover glow shadow for the node card.
  glow: string;
  // Soft rgba used for inline box-shadows / spotlights.
  glowRgb: string;
}

export const CATEGORY_STYLES: Record<NodeCategory, CategoryStyle> = {
  concept: {
    label: "Concepto",
    accent: "#38bdf8", // sky-400
    badge: "bg-sky-400/10 text-sky-300 ring-1 ring-inset ring-sky-400/20",
    glow: "hover:shadow-[0_0_25px_-5px_rgba(56,189,248,0.3)]",
    glowRgb: "56,189,248",
  },
  table: {
    label: "Tabla",
    accent: "#a855f7", // purple-500
    badge: "bg-purple-500/10 text-purple-300 ring-1 ring-inset ring-purple-500/20",
    glow: "hover:shadow-[0_0_25px_-5px_rgba(168,85,247,0.3)]",
    glowRgb: "168,85,247",
  },
  practice: {
    label: "Práctica",
    accent: "#f43f5e", // rose-500
    badge: "bg-rose-500/10 text-rose-300 ring-1 ring-inset ring-rose-500/20",
    glow: "hover:shadow-[0_0_25px_-5px_rgba(244,63,94,0.3)]",
    glowRgb: "244,63,94",
  },
  example: {
    label: "Ejemplo",
    accent: "#10b981", // emerald-500
    badge: "bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-500/20",
    glow: "hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.3)]",
    glowRgb: "16,185,129",
  },
};

export function getCategoryStyle(category: NodeCategory): CategoryStyle {
  return CATEGORY_STYLES[category] ?? CATEGORY_STYLES.concept;
}
