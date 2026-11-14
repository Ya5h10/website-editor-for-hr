import { CanvasElement } from "./types";
import { buildTailwindClassName } from "./tailwindStyles";

function classNameJsx(el: CanvasElement): string {
  const tw = buildTailwindClassName(el.tailwind, el.tailwindExtra);
  if (!tw) return "{className}";
  return `{[${escapeStr(tw)}, className].filter(Boolean).join(" ")}`;
}

export type ExportScope = "page" | "element";

export interface GenerateOptions {
  pageName?: string;
  componentName?: string;
  /** Export the full page or a single selected element. */
  scope?: ExportScope;
  /** Required when scope === "element". */
  elementId?: string;
}

function toPascal(name: string, fallback: string): string {
  const cleaned = name
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");
  const id = cleaned || fallback;
  return /^[A-Za-z]/.test(id) ? id : `El${id}`;
}

function escapeStr(value: string): string {
  return JSON.stringify(value);
}

function px(n: number): string {
  return Number.isInteger(n) ? `${n}` : n.toFixed(1);
}

/** Unique PascalCase component name, avoiding collisions. */
function uniqueName(
  preferred: string,
  used: Set<string>,
  fallback: string
): string {
  let base = toPascal(preferred, fallback);
  if (!used.has(base)) {
    used.add(base);
    return base;
  }
  let i = 2;
  while (used.has(`${base}${i}`)) i += 1;
  const next = `${base}${i}`;
  used.add(next);
  return next;
}

function componentNameFor(el: CanvasElement, used: Set<string>): string {
  if (el.id === "nav") return uniqueName("SiteNav", used, "SiteNav");
  if (el.id === "cta") return uniqueName("PrimaryButton", used, "PrimaryButton");
  if (el.id === "ticker" || el.name === "Hero Media") {
    return uniqueName("HeroMedia", used, "HeroMedia");
  }
  const byType: Record<string, string> = {
    hero: "Hero",
    button: "Button",
    text: "TextBlock",
    image: "ImageBlock",
    feature_split: "FeatureSplit",
    values_grid: "ValuesGrid",
    features: "FeatureGrid",
    stack: "Stack",
    frame: "Frame",
  };
  return uniqueName(el.name || byType[el.type] || "Block", used, "Block");
}

function styleObjectLiteral(
  entries: Array<[string, string | number | undefined | null]>,
  indent = "  "
): string {
  const lines = entries
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => {
      if (typeof v === "number") return `${indent}  ${k}: ${v},`;
      if (typeof v === "string" && /^-?\d+(\.\d+)?$/.test(v)) {
        return `${indent}  ${k}: ${v},`;
      }
      return `${indent}  ${k}: ${escapeStr(String(v))},`;
    });
  return `{\n${lines.join("\n")}\n${indent}}`;
}

interface BuiltComponent {
  name: string;
  element: CanvasElement;
  source: string;
  propsTypeName: string;
}

function buildElementComponent(
  el: CanvasElement,
  name: string,
  opts: { standalone: boolean }
): BuiltComponent {
  const propsType = `${name}Props`;
  const s = el.style;
  const radius = s.radius === 999 ? 9999 : s.radius;
  const opacity = s.opacity / 100;

  let source = "";

  switch (el.type) {
    case "button": {
      source = `export type ${propsType} = {
  label?: string;
  onClick?: () => void;
  className?: string;
};

export function ${name}({
  label = ${escapeStr(el.props.label || "Button")},
  onClick,
  className,
}: ${propsType}) {
  return (
    <button
      type="button"
      className=${classNameJsx(el)}
      onClick={onClick}
      style={${styleObjectLiteral([
        ["display", "inline-flex"],
        ["alignItems", "center"],
        ["justifyContent", "center"],
        ["minWidth", px(el.width)],
        ["height", px(el.height)],
        ["padding", `0 ${Math.max(16, s.padding || 20)}px`],
        ["border", "none"],
        ["borderRadius", radius],
        ["background", s.fill || "#ffffff"],
        ["color", s.color || "#000000"],
        ["fontSize", s.fontSize || 13],
        ["fontWeight", s.fontWeight || 600],
        ["letterSpacing", "0.01em"],
        ["cursor", "pointer"],
        ["opacity", opacity],
        ["transition", "transform 160ms ease, opacity 160ms ease"],
      ])}}
    >
      {label}
    </button>
  );
}
`;
      break;
    }

    case "image": {
      source = `export type ${propsType} = {
  src?: string;
  alt?: string;
  caption?: string;
  className?: string;
};

export function ${name}({
  src = ${escapeStr(el.props.imageUrl || "")},
  alt = ${escapeStr(el.props.label || el.name || "Image")},
  caption = ${escapeStr(el.props.label || el.name || "")},
  className,
}: ${propsType}) {
  return (
    <figure
      className=${classNameJsx(el)}
      style={${styleObjectLiteral([
        ["position", "relative"],
        ["width", "100%"],
        ["maxWidth", px(el.width)],
        ["height", px(el.height)],
        ["margin", 0],
        ["overflow", "hidden"],
        ["borderRadius", radius || 12],
        ["background", s.fill || "#1f2937"],
        ["opacity", opacity],
      ])}}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <div
          aria-hidden
          style={{
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(145deg, #1a1a1a 0%, #3a3a3a 100%)",
          }}
        />
      )}
      {caption ? (
        <figcaption
          style={{
            position: "absolute",
            left: 12,
            bottom: 12,
            margin: 0,
            fontSize: 12,
            color: "rgba(255,255,255,0.75)",
          }}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
`;
      break;
    }

    case "hero": {
      source = `export type ${propsType} = {
  heading?: string;
  subheading?: string;
  className?: string;
};

export function ${name}({
  heading = ${escapeStr(
    el.props.heading ||
      "We are a multidisciplinary creative studio."
  )},
  subheading = ${escapeStr(el.props.subheading || "")},
  className,
}: ${propsType}) {
  return (
    <section
      className=${classNameJsx(el)}
      aria-labelledby="${name}-heading"
      style={${styleObjectLiteral([
        ["width", "100%"],
        ["maxWidth", px(el.width)],
        ["padding", s.padding ? `${s.padding}px` : undefined],
        ["opacity", opacity],
      ])}}
    >
      <h1
        id="${name}-heading"
        style={${styleObjectLiteral([
          ["margin", 0],
          ["maxWidth", 920],
          ["fontSize", `clamp(2rem, 4vw, ${s.fontSize || 48}px)`],
          ["fontWeight", s.fontWeight || 600],
          ["lineHeight", 1.05],
          ["letterSpacing", "-0.03em"],
          ["color", s.color || "#ffffff"],
        ])}}
      >
        {heading}
      </h1>
      {subheading ? (
        <p
          style={{
            marginTop: 16,
            maxWidth: 560,
            fontSize: 15,
            lineHeight: 1.55,
            color: "rgba(255,255,255,0.62)",
          }}
        >
          {subheading}
        </p>
      ) : null}
    </section>
  );
}
`;
      break;
    }

    case "feature_split": {
      const imageLeft = el.props.layout !== "image_right";
      source = `export type ${propsType} = {
  heading?: string;
  content?: string;
  imageLeft?: boolean;
  imageSrc?: string;
  className?: string;
};

export function ${name}({
  heading = ${escapeStr(el.props.heading || "Feature")},
  content = ${escapeStr(el.props.content || "")},
  imageLeft = ${imageLeft},
  imageSrc = ${escapeStr(el.props.imageUrl || "")},
  className,
}: ${propsType}) {
  const media = (
    <div
      style={{
        minHeight: 160,
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.1)",
        background: imageSrc
          ? undefined
          : "linear-gradient(145deg, #27272a 0%, #09090b 100%)",
      }}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : null}
    </div>
  );

  const copy = (
    <div>
      <h2
        style={{
          margin: "0 0 8px",
          fontSize: 20,
          fontWeight: 600,
          color: "#ffffff",
        }}
      >
        {heading}
      </h2>
      <p
        style={{
          margin: 0,
          fontSize: 14,
          lineHeight: 1.55,
          color: "rgba(255,255,255,0.62)",
        }}
      >
        {content}
      </p>
    </div>
  );

  return (
    <section
      className=${classNameJsx(el)}
      style={${styleObjectLiteral([
        ["display", "grid"],
        ["gridTemplateColumns", "minmax(0, 1fr) minmax(0, 1fr)"],
        ["gap", 24],
        ["alignItems", "center"],
        ["width", "100%"],
        ["maxWidth", px(el.width)],
        ["padding", s.padding ? `${s.padding}px` : 24],
        ["borderRadius", radius || 8],
        ["background", s.fill && s.fill !== "transparent" ? s.fill : "#0a0a0a"],
        ["opacity", opacity],
      ])}}
    >
      {imageLeft ? (
        <>
          {media}
          {copy}
        </>
      ) : (
        <>
          {copy}
          {media}
        </>
      )}
    </section>
  );
}
`;
      break;
    }

    case "values_grid": {
      const items = el.props.items || [];
      source = `export type ${propsType} = {
  heading?: string;
  items?: Array<{ title: string; text: string }>;
  className?: string;
};

export function ${name}({
  heading = ${escapeStr(el.props.heading || "Our values")},
  items = ${JSON.stringify(items, null, 2).replace(/\n/g, "\n  ")},
  className,
}: ${propsType}) {
  return (
    <section
      className=${classNameJsx(el)}
      aria-labelledby="${name}-heading"
      style={${styleObjectLiteral([
        ["width", "100%"],
        ["maxWidth", px(el.width)],
        ["opacity", opacity],
      ])}}
    >
      <h2
        id="${name}-heading"
        style={{
          margin: "0 0 16px",
          fontSize: 15,
          fontWeight: 500,
          color: "#ffffff",
        }}
      >
        {heading}
      </h2>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 16,
        }}
      >
        {items.map((item) => (
          <li key={item.title}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#ffffff" }}>
              {item.title}
            </div>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 12,
                lineHeight: 1.5,
                color: "rgba(255,255,255,0.55)",
              }}
            >
              {item.text}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
`;
      break;
    }

    case "features": {
      const features = el.props.features || [];
      source = `export type ${propsType} = {
  features?: Array<{ title: string; description: string }>;
  className?: string;
};

export function ${name}({
  features = ${JSON.stringify(features, null, 2).replace(/\n/g, "\n  ")},
  className,
}: ${propsType}) {
  return (
    <section
      className=${classNameJsx(el)}
      aria-label="Capabilities"
      style={${styleObjectLiteral([
        ["display", "grid"],
        ["gridTemplateColumns", "repeat(3, minmax(0, 1fr))"],
        ["gap", 24],
        ["width", "100%"],
        ["maxWidth", px(el.width)],
        ["paddingTop", 24],
        ["borderTop", "1px solid rgba(255,255,255,0.1)"],
        ["opacity", opacity],
      ])}}
    >
      {features.map((feature) => (
        <article key={feature.title}>
          <h3
            style={{
              margin: "0 0 6px",
              fontSize: 15,
              fontWeight: 500,
              color: "#ffffff",
            }}
          >
            {feature.title}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              lineHeight: 1.55,
              color: "rgba(255,255,255,0.55)",
            }}
          >
            {feature.description}
          </p>
        </article>
      ))}
    </section>
  );
}
`;
      break;
    }

    case "text": {
      const isHeadline =
        (s.fontSize || 16) >= 40 ||
        el.id === "headline" ||
        /headline/i.test(el.name);
      const Tag = isHeadline ? "h1" : el.id === "subcopy" ? "p" : "p";
      const text = el.props.text || el.props.heading || el.name;
      source = `export type ${propsType} = {
  children?: React.ReactNode;
  className?: string;
};

export function ${name}({
  children = ${escapeStr(text)},
  className,
}: ${propsType}) {
  return (
    <${Tag}
      className=${classNameJsx(el)}
      style={${styleObjectLiteral([
        ["margin", 0],
        ["maxWidth", px(el.width)],
        ["fontSize", `clamp(${Math.max(14, Math.round((s.fontSize || 16) * 0.55))}px, 3.2vw, ${s.fontSize || 16}px)`],
        ["fontWeight", s.fontWeight || 400],
        ["lineHeight", isHeadline ? 1.12 : 1.55],
        ["letterSpacing", isHeadline ? "-0.025em" : "0"],
        ["color", s.color || "#ffffff"],
        ["opacity", opacity],
        ["whiteSpace", "pre-wrap"],
      ])}}
    >
      {children}
    </${Tag}>
  );
}
`;
      break;
    }

    case "stack":
    case "frame":
    default: {
      if (el.id === "nav") {
        source = `export type ${propsType} = {
  brand?: string;
  links?: Array<{ label: string; href?: string }>;
  className?: string;
};

export function ${name}({
  brand = "HAUS",
  links = [
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Get in Touch", href: "#contact" },
  ],
  className,
}: ${propsType}) {
  return (
    <header
      className=${classNameJsx(el)}
      style={${styleObjectLiteral([
        ["position", "sticky"],
        ["top", 0],
        ["zIndex", 10],
        ["display", "flex"],
        ["alignItems", "center"],
        ["justifyContent", "space-between"],
        ["width", "100%"],
        ["height", px(el.height || 64)],
        ["padding", "0 40px"],
        ["borderBottom", "1px solid rgba(255,255,255,0.1)"],
        ["background", s.fill || "#000000"],
        ["opacity", opacity],
      ])}}
    >
      <a
        href="#top"
        style={{
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: "0.2em",
          color: "#ffffff",
          textDecoration: "none",
        }}
      >
        {brand}
      </a>
      <nav aria-label="Primary">
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            gap: 32,
            margin: 0,
            padding: 0,
          }}
        >
          {links.map((link, index) => (
            <li key={link.label}>
              <a
                href={link.href || "#"}
                style={{
                  fontSize: 13,
                  color:
                    index === links.length - 1
                      ? "#ffffff"
                      : "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
`;
        break;
      }

      if (el.id === "ticker" || el.name === "Hero Media") {
        const cards = ["Studio", "Product", "Brand", "Motion", "Web"];
        source = `export type ${propsType} = {
  items?: string[];
  className?: string;
};

export function ${name}({
  items = ${JSON.stringify(cards)},
  className,
}: ${propsType}) {
  return (
    <div
      className=${classNameJsx(el)}
      role="list"
      aria-label="Selected work"
      style={${styleObjectLiteral([
        ["display", "flex"],
        ["gap", 12],
        ["width", "100%"],
        ["maxWidth", px(el.width)],
        ["height", px(el.height)],
        ["overflowX", "auto"],
        ["overflowY", "hidden"],
        ["opacity", opacity],
      ])}}
    >
      {items.map((label) => (
        <div
          key={label}
          role="listitem"
          style={{
            position: "relative",
            flex: "0 0 200px",
            height: "100%",
            borderRadius: 12,
            background: "linear-gradient(145deg, #1a1a1a 0%, #3a3a3a 100%)",
          }}
        >
          <span
            style={{
              position: "absolute",
              left: 12,
              bottom: 12,
              fontSize: 12,
              color: "rgba(255,255,255,0.8)",
            }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
`;
        break;
      }

      source = `export type ${propsType} = {
  title?: string;
  children?: React.ReactNode;
  className?: string;
};

export function ${name}({
  title = ${escapeStr(el.props.heading || el.props.text || el.name)},
  children,
  className,
}: ${propsType}) {
  return (
    <div
      className=${classNameJsx(el)}
      style={${styleObjectLiteral([
        ["width", "100%"],
        ["maxWidth", px(el.width)],
        ["minHeight", px(el.height)],
        ["padding", s.padding || 16],
        ["borderRadius", radius || 10],
        [
          "background",
          s.fill && s.fill !== "transparent" ? s.fill : "#151515",
        ],
        ["opacity", opacity],
      ])}}
    >
      {children ?? (
        <p style={{ margin: 0, color: s.color || "#ffffff", fontSize: s.fontSize || 16 }}>
          {title}
        </p>
      )}
    </div>
  );
}
`;
    }
  }

  if (opts.standalone) {
    source += `
export default ${name};
`;
  }

  return { name, element: el, source, propsTypeName: propsType };
}

function fileBanner(lines: string[]): string {
  return `/**
 * ${lines.join("\n * ")}
 *
 * Drop this file into a React or Next.js app and import the default export
 * (or any named section component) wherever you need it.
 */

`;
}

function usageBlock(importPath: string, names: string[], isPage: boolean): string {
  const primary = names[0];
  const named = names.slice(1);
  const importLine = isPage
    ? `import ${primary} from "${importPath}";`
    : `import ${primary} from "${importPath}";`;
  return `/*
 * Quick start
 * -----------
 * ${importLine}
 *
 * export default function App() {
 *   return <${primary} />;
 * }
 *
${
  named.length
    ? ` * Named sections also exported:\n * import { ${named.join(", ")} } from "${importPath}";\n *`
    : ""
}
 */
`;
}

/** Generate production-ready React TypeScript (.tsx) from the canvas. */
export function generateReactCode(
  elements: CanvasElement[],
  options: GenerateOptions = {}
): string {
  const scope: ExportScope = options.scope || "page";
  const pageName = options.pageName || "Home";
  const visible = elements
    .filter((el) => el.visible !== false)
    .slice()
    .sort((a, b) => a.y - b.y || a.x - b.x);

  const used = new Set<string>();

  if (scope === "element") {
    const target =
      visible.find((el) => el.id === options.elementId) ||
      elements.find((el) => el.id === options.elementId);
    if (!target) {
      return `// No element selected — pick a layer on the canvas, then export again.\nexport default function Empty() {\n  return null;\n}\n`;
    }
    const name =
      options.componentName ||
      componentNameFor(target, used);
    // ensure name reserved
    used.add(name);
    const built = buildElementComponent(target, name, { standalone: true });
    const importPath = `./${name}`;
    return (
      fileBanner([
        `Auto-generated React component from the editor canvas.`,
        `Scope: single element · ${target.name} (${target.type})`,
        `Artboard position: x=${target.x}, y=${target.y}, ${target.width}×${target.height}`,
      ]) +
      `import React from "react";\n\n` +
      usageBlock(importPath, [name], false) +
      "\n" +
      built.source
    );
  }

  // Full page
  const pageComponent =
    options.componentName || `${toPascal(pageName, "Home")}Page`;
  used.add(pageComponent);

  const builtList: BuiltComponent[] = visible.map((el) => {
    const name = componentNameFor(el, used);
    return buildElementComponent(el, name, { standalone: false });
  });

  // Compute vertical rhythm from canvas positions
  let prevBottom = 0;
  const sectionLits = builtList.map((b, index) => {
    const el = b.element;
    const gap = index === 0 ? el.y : Math.max(0, el.y - prevBottom);
    prevBottom = el.y + el.height;
    const padLeft = el.x;
    const styleBits: string[] = [];
    if (gap > 0) styleBits.push(`marginTop: ${gap}`);
    if (padLeft > 0 && el.id !== "nav") styleBits.push(`marginLeft: ${padLeft}`);
    if (el.id === "nav") {
      return `      <${b.name} />`;
    }
    const styleProp =
      styleBits.length > 0
        ? ` style={{ ${styleBits.join(", ")} }}`
        : "";
    // Pass className-less; use wrapper for layout offsets
    if (styleBits.length > 0) {
      return `      <div${styleProp}>\n        <${b.name} />\n      </div>`;
    }
    return `      <${b.name} />`;
  });

  const height = Math.max(
    900,
    ...visible.map((el) => el.y + el.height + 48),
    0
  );

  const namedExports = builtList.map((b) => b.name);

  const pageSource = `export type ${pageComponent}Props = {
  className?: string;
};

export default function ${pageComponent}({ className }: ${pageComponent}Props) {
  return (
    <main
      id="top"
      className={className}
      style={${styleObjectLiteral([
        ["position", "relative"],
        ["width", "100%"],
        ["maxWidth", 1200],
        ["minHeight", height],
        ["margin", "0 auto"],
        ["background", "#000000"],
        ["color", "#ffffff"],
        [
          "fontFamily",
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        ],
        ["overflow", "hidden"],
      ], "      ")}}
    >
${sectionLits.join("\n\n") || "      null"}
    </main>
  );
}
`;

  const sectionsSource = builtList.map((b) => b.source.trimEnd()).join("\n\n");

  return (
    fileBanner([
      `Auto-generated from the Framer-style editor canvas.`,
      `Page: ${pageName} · ${visible.length} visible layers`,
      `Layout: document flow with spacing derived from the Desktop 1200 artboard.`,
    ]) +
    `import React from "react";\n\n` +
    usageBlock(`./${pageComponent}`, [pageComponent, ...namedExports], true) +
    "\n" +
    sectionsSource +
    "\n\n" +
    pageSource
  );
}

export function generateReactFilename(
  pageName = "Home",
  scope: ExportScope = "page",
  elementName?: string
): string {
  if (scope === "element" && elementName) {
    return `${toPascal(elementName, "Component")}.tsx`;
  }
  return `${toPascal(pageName, "Home")}Page.tsx`;
}

export function describeExport(
  elements: CanvasElement[],
  options: GenerateOptions
): {
  title: string;
  subtitle: string;
  filename: string;
  componentCount: number;
} {
  const scope = options.scope || "page";
  if (scope === "element") {
    const el = elements.find((e) => e.id === options.elementId);
    const name = el
      ? componentNameFor(el, new Set())
      : "Component";
    return {
      title: el?.name || "Element",
      subtitle: el
        ? `Single component · ${el.type} · ${el.width}×${el.height}`
        : "Select a layer to export",
      filename: `${name}.tsx`,
      componentCount: el ? 1 : 0,
    };
  }
  const visible = elements.filter((e) => e.visible !== false);
  return {
    title: `${options.pageName || "Home"} page`,
    subtitle: `Full page · ${visible.length} section components`,
    filename: generateReactFilename(options.pageName, "page"),
    componentCount: visible.length + 1,
  };
}
