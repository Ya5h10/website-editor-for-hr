import { TAILWIND_PROPERTY_IDS } from "./tailwindCatalog";

/** Selected Tailwind class per property id (empty string = unset). */
export type TailwindClassMap = Partial<Record<string, string>>;

export function emptyTailwind(): TailwindClassMap {
  return {};
}

export function buildTailwindClassName(
  tw?: TailwindClassMap | null,
  extra?: string
): string {
  const parts: string[] = [];
  if (tw) {
    for (const id of TAILWIND_PROPERTY_IDS) {
      const v = tw[id];
      if (v) parts.push(v);
    }
    // Include any unknown keys too (forward-compat)
    for (const [k, v] of Object.entries(tw)) {
      if (!TAILWIND_PROPERTY_IDS.includes(k) && v) parts.push(v);
    }
  }
  if (extra?.trim()) {
    parts.push(
      ...extra
        .trim()
        .split(/\s+/)
        .filter(Boolean)
    );
  }
  return parts.join(" ");
}

export function countTailwindClasses(
  tw?: TailwindClassMap | null,
  extra?: string
): number {
  return buildTailwindClassName(tw, extra).split(/\s+/).filter(Boolean).length;
}

/** Groups that override legacy inline styles on the canvas. */
export function twOverridesInline(tw?: TailwindClassMap | null): {
  skipFill: boolean;
  skipColor: boolean;
  skipFontSize: boolean;
  skipFontWeight: boolean;
  skipPadding: boolean;
  skipRadius: boolean;
  skipOpacity: boolean;
} {
  const t = tw || {};
  return {
    skipFill: Boolean(t.bgColor || t.bgImage),
    skipColor: Boolean(t.textColor),
    skipFontSize: Boolean(t.fontSize),
    skipFontWeight: Boolean(t.fontWeight),
    skipPadding: Boolean(t.p || t.px || t.py || t.pt || t.pr || t.pb || t.pl),
    skipRadius: Boolean(t.rounded || t.roundedT || t.roundedB),
    skipOpacity: Boolean(t.opacity),
  };
}
