import { CanvasElement } from "./types";

function toIdent(name: string, fallback: string): string {
  const cleaned = name
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
  const id = cleaned || fallback;
  return /^[A-Za-z]/.test(id) ? id : `El${id}`;
}

function styleLiteral(
  el: CanvasElement,
  extra: Record<string, string | number> = {}
): string {
  const s = el.style;
  const entries: Array<[string, string]> = [
    ["position", `"absolute"`],
    ["left", String(el.x)],
    ["top", String(el.y)],
    ["width", String(el.width)],
    ["height", String(el.height)],
    ["opacity", String(s.opacity / 100)],
  ];
  if (s.fill && s.fill !== "transparent") {
    entries.push(["background", JSON.stringify(s.fill)]);
  }
  if (s.color) entries.push(["color", JSON.stringify(s.color)]);
  if (s.fontSize) entries.push(["fontSize", String(s.fontSize)]);
  if (s.fontWeight) entries.push(["fontWeight", String(s.fontWeight)]);
  if (s.radius) {
    entries.push(["borderRadius", String(s.radius === 999 ? 9999 : s.radius)]);
  }
  if (s.padding) entries.push(["padding", String(s.padding)]);

  for (const [k, v] of Object.entries(extra)) {
    entries.push([
      k,
      typeof v === "string" && !/^\d/.test(v) && v[0] !== `"`
        ? JSON.stringify(v)
        : String(v),
    ]);
  }

  return `{ ${entries.map(([k, v]) => `${k}: ${v}`).join(", ")} }`;
}

function renderElementJsx(el: CanvasElement, indent = "      "): string {
  const key = el.id;

  switch (el.type) {
    case "button":
      return `${indent}<button key="${key}" type="button" style={${styleLiteral(el, {
        display: `"flex"`,
        alignItems: `"center"`,
        justifyContent: `"center"`,
        border: `"none"`,
        cursor: `"pointer"`,
      })}}>
${indent}  {${JSON.stringify(el.props.label || "Button")}}
${indent}</button>`;

    case "image":
      return `${indent}<div key="${key}" style={${styleLiteral(el)}}>
${indent}  ${
        el.props.imageUrl
          ? `<img src={${JSON.stringify(el.props.imageUrl)}} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} />`
          : `<div style={{ width: "100%", height: "100%", background: "linear-gradient(145deg,#1a1a1a,#3a3a3a)" }} />`
      }
${indent}  <span style={{ position: "absolute", left: 12, bottom: 12, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
${indent}    {${JSON.stringify(el.props.label || el.name)}}
${indent}  </span>
${indent}</div>`;

    case "hero":
      return `${indent}<section key="${key}" style={${styleLiteral(el)}}>
${indent}  <h1 style={{ margin: 0, fontSize: ${el.style.fontSize}, fontWeight: ${el.style.fontWeight}, lineHeight: 1.05, letterSpacing: "-0.03em", color: ${JSON.stringify(el.style.color)} }}>
${indent}    {${JSON.stringify(el.props.heading || "")}}
${indent}  </h1>
${indent}  <p style={{ marginTop: 16, maxWidth: 560, fontSize: 15, color: "rgba(255,255,255,0.6)" }}>
${indent}    {${JSON.stringify(el.props.subheading || "")}}
${indent}  </p>
${indent}</section>`;

    case "feature_split": {
      const imageLeft = el.props.layout !== "image_right";
      const media = `<div style={{ minHeight: 120, borderRadius: 8, background: "linear-gradient(145deg,#27272a,#09090b)", border: "1px solid rgba(255,255,255,0.1)" }} />`;
      const copy = `<div>
${indent}    <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 600, color: "#fff" }}>{${JSON.stringify(el.props.heading || "")}}</h2>
${indent}    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "rgba(255,255,255,0.6)" }}>{${JSON.stringify(el.props.content || "")}}</p>
${indent}  </div>`;
      return `${indent}<section key="${key}" style={${styleLiteral(el, {
        display: `"grid"`,
        gridTemplateColumns: `"1fr 1fr"`,
        gap: 24,
      })}}>
${indent}  ${imageLeft ? `${media}\n${indent}  ${copy}` : `${copy}\n${indent}  ${media}`}
${indent}</section>`;
    }

    case "values_grid":
      return `${indent}<section key="${key}" style={${styleLiteral(el)}}>
${indent}  <h2 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 500, color: "#fff" }}>{${JSON.stringify(el.props.heading || "")}}</h2>
${indent}  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
${(el.props.items || [])
  .map(
    (item) => `${indent}    <div>
${indent}      <div style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>{${JSON.stringify(item.title)}}</div>
${indent}      <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{${JSON.stringify(item.text)}}</p>
${indent}    </div>`
  )
  .join("\n")}
${indent}  </div>
${indent}</section>`;

    case "features":
      return `${indent}<section key="${key}" style={${styleLiteral(el, {
        display: `"grid"`,
        gridTemplateColumns: `"repeat(3, 1fr)"`,
        gap: 24,
        borderTop: `"1px solid rgba(255,255,255,0.1)"`,
        paddingTop: 24,
      })}}>
${(el.props.features || [])
  .map(
    (f) => `${indent}  <div>
${indent}    <div style={{ fontSize: 15, fontWeight: 500, color: "#fff", marginBottom: 4 }}>{${JSON.stringify(f.title)}}</div>
${indent}    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "rgba(255,255,255,0.55)" }}>{${JSON.stringify(f.description)}}</p>
${indent}  </div>`
  )
  .join("\n")}
${indent}</section>`;

    case "text":
      return `${indent}<div key="${key}" style={${styleLiteral(el, {
        whiteSpace: `"pre-wrap"`,
        lineHeight: 1.15,
        letterSpacing: `"-0.02em"`,
      })}}>
${indent}  {${JSON.stringify(el.props.text || el.props.heading || el.name)}}
${indent}</div>`;

    case "stack":
    case "frame":
    default:
      if (el.id === "nav") {
        return `${indent}<nav key="${key}" style={${styleLiteral(el, {
          display: `"flex"`,
          alignItems: `"center"`,
          justifyContent: `"space-between"`,
          padding: `"0 40px"`,
          borderBottom: `"1px solid rgba(255,255,255,0.1)"`,
        })}}>
${indent}  <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.2em" }}>HAUS</div>
${indent}  <div style={{ display: "flex", gap: 32, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
${indent}    <span>Work</span><span>Services</span><span>About</span><span style={{ color: "#fff" }}>Get in Touch</span>
${indent}  </div>
${indent}</nav>`;
      }
      if (el.name === "Hero Media" || el.id === "ticker") {
        const cards = ["Studio", "Product", "Brand", "Motion", "Web"];
        return `${indent}<div key="${key}" style={${styleLiteral(el, {
          display: `"flex"`,
          gap: 12,
          overflow: `"hidden"`,
        })}}>
${cards
  .map(
    (label) => `${indent}  <div style={{ flex: "0 0 200px", height: "100%", borderRadius: 12, background: "linear-gradient(145deg,#1a1a1a,#3a3a3a)", position: "relative" }}>
${indent}    <span style={{ position: "absolute", left: 12, bottom: 12, fontSize: 12, color: "rgba(255,255,255,0.8)" }}>${label}</span>
${indent}  </div>`
  )
  .join("\n")}
${indent}</div>`;
      }
      return `${indent}<div key="${key}" style={${styleLiteral(el)}}>
${indent}  {${JSON.stringify(el.props.heading || el.props.text || el.name)}}
${indent}</div>`;
  }
}

/** Generate a standalone React (.jsx) component from the current canvas. */
export function generateReactCode(
  elements: CanvasElement[],
  options: { componentName?: string; pageName?: string } = {}
): string {
  const componentName = toIdent(options.componentName || "SitePage", "SitePage");
  const visible = elements.filter((el) => el.visible !== false);
  const height = Math.max(
    900,
    ...visible.map((el) => el.y + el.height + 40),
    0
  );

  const body = visible.map((el) => renderElementJsx(el)).join("\n\n");

  return `import React from "react";

/**
 * Auto-generated from the Framer-style editor canvas.
 * Page: ${options.pageName || "Home"}
 * Elements: ${visible.length}
 *
 * Drop this file into a React / Next.js app and render <${componentName} />.
 */
export default function ${componentName}() {
  return (
    <div
      style={{
        position: "relative",
        width: 1200,
        minHeight: ${height},
        margin: "0 auto",
        background: "#000000",
        color: "#ffffff",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif',
        overflow: "hidden",
      }}
    >
${body || "      null"}
    </div>
  );
}
`;
}

export function generateReactFilename(pageName = "Home"): string {
  return `${toIdent(pageName, "Home")}Page.jsx`;
}
