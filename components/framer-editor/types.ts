import { TailwindClassMap, emptyTailwind } from "./tailwindStyles";

export type { TailwindClassMap };

export type EditorMode = "canvas" | "cms" | "code";

export type InsertKind =
  | "frame"
  | "text"
  | "image"
  | "stack"
  | "button"
  | "hero"
  | "feature_split"
  | "values_grid"
  | "features"
  | "custom";

export type CanvasElementType = InsertKind;

export interface ElementStyle {
  fill: string;
  color: string;
  fontSize: number;
  fontWeight: number;
  opacity: number;
  radius: number;
  padding: number;
  widthMode: "fixed" | "fill" | "fit";
  heightMode: "fixed" | "fill" | "fit";
}

export interface CanvasElement {
  id: string;
  type: CanvasElementType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  locked?: boolean;
  visible?: boolean;
  /** Parent layer id — null/undefined = root on the page artboard. */
  parentId?: string | null;
  style: ElementStyle;
  /** Structured Tailwind utility picks (one class per property). */
  tailwind?: TailwindClassMap;
  /** Freeform extra Tailwind / custom classes. */
  tailwindExtra?: string;
  /** Orbit / content props */
  props: {
    heading?: string;
    subheading?: string;
    content?: string;
    text?: string;
    label?: string;
    imageUrl?: string;
    layout?: "image_left" | "image_right";
    items?: Array<{ title: string; text: string; image_url?: string }>;
    features?: Array<{ title: string; description: string }>;
    brandColor?: string;
    /** Custom code component source (React function component). */
    customCode?: string;
    componentName?: string;
  };
}

/** Elements that can contain nested children. */
export const CONTAINER_TYPES: CanvasElementType[] = [
  "frame",
  "stack",
  "hero",
  "feature_split",
  "custom",
];

export function canHaveChildren(el: Pick<CanvasElement, "type">): boolean {
  return CONTAINER_TYPES.includes(el.type);
}

export function getRootElements(elements: CanvasElement[]): CanvasElement[] {
  return elements.filter((el) => !el.parentId);
}

export function getChildElements(
  elements: CanvasElement[],
  parentId: string
): CanvasElement[] {
  return elements
    .filter((el) => el.parentId === parentId)
    .slice()
    .sort((a, b) => a.y - b.y || a.x - b.x);
}

export function getDescendantIds(
  elements: CanvasElement[],
  parentId: string
): string[] {
  const kids = elements.filter((el) => el.parentId === parentId);
  return kids.flatMap((k) => [k.id, ...getDescendantIds(elements, k.id)]);
}

export const DEFAULT_CUSTOM_CODE = `export default function CustomBlock({ children, title = "Custom block" }) {
  return (
    <div className="w-full h-full rounded-xl border border-white/10 bg-zinc-900/80 p-5 text-white">
      <div className="text-[13px] font-semibold tracking-wide text-white/90">
        {title}
      </div>
      <p className="mt-1 text-[12px] text-white/55">
        Edit this component's code in the Style panel.
      </p>
      <div className="mt-4 flex flex-col gap-2">{children}</div>
    </div>
  );
}
`;

export const defaultStyle = (
  overrides: Partial<ElementStyle> = {}
): ElementStyle => ({
  fill: "transparent",
  color: "#ffffff",
  fontSize: 16,
  fontWeight: 500,
  opacity: 100,
  radius: 0,
  padding: 0,
  widthMode: "fixed",
  heightMode: "fit",
  ...overrides,
});

export function createElement(
  kind: InsertKind,
  overrides: Partial<CanvasElement> = {}
): CanvasElement {
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `el-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const base: CanvasElement = {
    id,
    type: kind,
    name: labelFor(kind),
    x: 80,
    y: 120,
    width: 320,
    height: 120,
    visible: true,
    locked: false,
    parentId: null,
    style: defaultStyle(),
    tailwind: emptyTailwind(),
    tailwindExtra: "",
    props: {},
    ...overrides,
  };

  switch (kind) {
    case "custom":
      return {
        ...base,
        name: "Custom",
        width: 360,
        height: 220,
        style: defaultStyle({ fill: "#111111", radius: 12, padding: 0 }),
        props: {
          componentName: "CustomBlock",
          customCode: DEFAULT_CUSTOM_CODE,
          heading: "Custom block",
        },
      };
    case "frame":
      return {
        ...base,
        width: 400,
        height: 240,
        style: defaultStyle({ fill: "#111111", radius: 12 }),
        props: { heading: "Frame" },
      };
    case "text":
      return {
        ...base,
        width: 480,
        height: 80,
        style: defaultStyle({ fontSize: 32, fontWeight: 600 }),
        props: {
          text: "New text block",
          heading: "New text block",
        },
      };
    case "image":
      return {
        ...base,
        width: 280,
        height: 320,
        style: defaultStyle({ fill: "#1f2937", radius: 12 }),
        props: { label: "Image", imageUrl: "" },
      };
    case "stack":
      return {
        ...base,
        width: 360,
        height: 160,
        style: defaultStyle({ fill: "#151515", radius: 10, padding: 16 }),
        props: { heading: "Stack" },
      };
    case "button":
      return {
        ...base,
        width: 180,
        height: 44,
        style: defaultStyle({
          fill: "#ffffff",
          color: "#000000",
          radius: 999,
          fontSize: 13,
          fontWeight: 600,
        }),
        props: { label: "Button" },
      };
    case "hero":
      return {
        ...base,
        name: "Hero",
        width: 1040,
        height: 280,
        x: 80,
        y: 100,
        style: defaultStyle({ fontSize: 48, fontWeight: 600 }),
        props: {
          heading: "We are a multidisciplinary creative studio.",
          subheading:
            "Haus partners with ambitious brands to craft digital experiences.",
          brandColor: "#0099ff",
        },
      };
    case "feature_split":
      return {
        ...base,
        name: "Feature Split",
        width: 1040,
        height: 220,
        style: defaultStyle({ fill: "#0a0a0a", radius: 8 }),
        props: {
          layout: "image_left",
          heading: "Feature split",
          content: "Describe the feature and supporting narrative here.",
          imageUrl: "",
        },
      };
    case "values_grid":
      return {
        ...base,
        name: "Values Grid",
        width: 1040,
        height: 220,
        style: defaultStyle(),
        props: {
          heading: "Our values",
          items: [
            { title: "Craft", text: "Detail-obsessed execution." },
            { title: "Clarity", text: "Simple systems that scale." },
            { title: "Care", text: "People over pixels." },
          ],
        },
      };
    case "features":
      return {
        ...base,
        name: "Features",
        width: 1040,
        height: 180,
        style: defaultStyle(),
        props: {
          heading: "Capabilities",
          features: [
            {
              title: "Design systems",
              description: "Reusable foundations across surfaces.",
            },
            {
              title: "Launch sites",
              description: "High-craft marketing with CMS and hosting.",
            },
            {
              title: "Product UI",
              description: "Interfaces for complex workflows.",
            },
          ],
        },
      };
    default:
      return base;
  }
}

export function labelFor(kind: InsertKind): string {
  switch (kind) {
    case "frame":
      return "Frame";
    case "text":
      return "Text";
    case "image":
      return "Image";
    case "stack":
      return "Stack";
    case "button":
      return "Button";
    case "hero":
      return "Hero";
    case "feature_split":
      return "Feature Split";
    case "values_grid":
      return "Values Grid";
    case "features":
      return "Features";
    case "custom":
      return "Code component";
    default:
      return "Element";
  }
}

export function createInitialElements(): CanvasElement[] {
  return [
    {
      id: "nav",
      type: "stack",
      name: "Navigation",
      x: 0,
      y: 0,
      width: 1200,
      height: 64,
      visible: true,
      style: defaultStyle({ fill: "#000000", padding: 40 }),
      props: { heading: "HAUS", label: "Navigation" },
    },
    {
      id: "headline",
      type: "text",
      name: "Headline",
      x: 40,
      y: 100,
      width: 920,
      height: 160,
      visible: true,
      style: defaultStyle({ fontSize: 56, fontWeight: 600, color: "#ffffff" }),
      props: {
        text: "We are a multidisciplinary creative studio specializing in digital experiences.",
        heading:
          "We are a multidisciplinary creative studio specializing in digital experiences.",
      },
    },
    {
      id: "subcopy",
      type: "text",
      name: "Subcopy",
      x: 40,
      y: 280,
      width: 560,
      height: 90,
      visible: true,
      style: defaultStyle({ fontSize: 16, fontWeight: 400, color: "#999999" }),
      props: {
        text: "Haus partners with ambitious brands to craft websites, product interfaces, and motion systems that feel intentional, calm, and unmistakably theirs.",
        heading:
          "Haus partners with ambitious brands to craft websites, product interfaces, and motion systems that feel intentional, calm, and unmistakably theirs.",
        subheading:
          "Haus partners with ambitious brands to craft websites, product interfaces, and motion systems that feel intentional, calm, and unmistakably theirs.",
      },
    },
    {
      id: "cta",
      type: "button",
      name: "CTA Stack",
      x: 40,
      y: 390,
      width: 180,
      height: 44,
      visible: true,
      style: defaultStyle({
        fill: "#ffffff",
        color: "#000000",
        radius: 999,
        fontSize: 13,
        fontWeight: 600,
      }),
      props: { label: "View selected work" },
    },
    {
      id: "ticker",
      type: "stack",
      name: "Hero Media",
      x: 40,
      y: 470,
      width: 1120,
      height: 280,
      visible: true,
      style: defaultStyle({ fill: "transparent", padding: 0 }),
      props: { heading: "Ticker", label: "Hero Media" },
    },
    {
      id: "features",
      type: "features",
      name: "Features",
      x: 40,
      y: 780,
      width: 1120,
      height: 160,
      visible: true,
      style: defaultStyle(),
      props: {
        heading: "Capabilities",
        features: [
          {
            title: "Design systems",
            description:
              "Reusable foundations that keep product and marketing surfaces aligned.",
          },
          {
            title: "Launch sites",
            description:
              "High-craft marketing sites with motion, CMS, and production hosting.",
          },
          {
            title: "Product UI",
            description:
              "Interfaces that feel precise, calm, and ready for complex workflows.",
          },
        ],
      },
    },
  ];
}
