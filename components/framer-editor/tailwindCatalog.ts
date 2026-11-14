/** Complete Tailwind utility catalog for the design panel (Tailwind v3 defaults). */

export type TwOption = { value: string; label: string };

export type TwProperty = {
  id: string;
  label: string;
  /** Mutually exclusive — picking one replaces the previous for this property. */
  options: TwOption[];
  /** Allow clearing back to unset */
  clearable?: boolean;
};

export type TwCategory = {
  id: string;
  label: string;
  properties: TwProperty[];
};

const none: TwOption = { value: "", label: "—" };

function opts(...values: string[]): TwOption[] {
  return [none, ...values.map((value) => ({ value, label: value }))];
}

function numbered(
  prefix: string,
  scales: Array<string | number>,
  extras: string[] = []
): TwOption[] {
  return opts(
    ...extras,
    ...scales.map((s) => `${prefix}-${s}`)
  );
}

const SPACING = [
  "0",
  "px",
  "0.5",
  "1",
  "1.5",
  "2",
  "2.5",
  "3",
  "3.5",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "14",
  "16",
  "20",
  "24",
  "28",
  "32",
  "36",
  "40",
  "44",
  "48",
  "52",
  "56",
  "60",
  "64",
  "72",
  "80",
  "96",
] as const;

const FRACTIONS = [
  "1/2",
  "1/3",
  "2/3",
  "1/4",
  "2/4",
  "3/4",
  "1/5",
  "2/5",
  "3/5",
  "4/5",
  "1/6",
  "5/6",
  "1/12",
  "5/12",
  "7/12",
  "11/12",
  "full",
] as const;

const SIZING_EXTRAS = [
  "auto",
  "full",
  "screen",
  "svw",
  "svh",
  "lvw",
  "lvh",
  "dvw",
  "dvh",
  "min",
  "max",
  "fit",
] as const;

const COLORS = [
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
] as const;

const SHADES = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
] as const;

function colorClasses(prefix: string): TwOption[] {
  const values: string[] = [
    `${prefix}-inherit`,
    `${prefix}-current`,
    `${prefix}-transparent`,
    `${prefix}-black`,
    `${prefix}-white`,
  ];
  for (const c of COLORS) {
    for (const s of SHADES) {
      values.push(`${prefix}-${c}-${s}`);
    }
  }
  return opts(...values);
}

function prop(
  id: string,
  label: string,
  options: TwOption[],
  clearable = true
): TwProperty {
  return { id, label, options, clearable };
}

export const TAILWIND_CATEGORIES: TwCategory[] = [
  {
    id: "layout",
    label: "Layout",
    properties: [
      prop(
        "display",
        "Display",
        opts(
          "block",
          "inline-block",
          "inline",
          "flex",
          "inline-flex",
          "grid",
          "inline-grid",
          "contents",
          "hidden",
          "table",
          "table-row",
          "table-cell",
          "flow-root",
          "list-item"
        )
      ),
      prop(
        "aspectRatio",
        "Aspect ratio",
        opts("aspect-auto", "aspect-square", "aspect-video")
      ),
      prop(
        "container",
        "Container",
        opts("container")
      ),
      prop(
        "columns",
        "Columns",
        numbered("columns", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, "auto"])
      ),
      prop(
        "breakAfter",
        "Break after",
        opts(
          "break-after-auto",
          "break-after-avoid",
          "break-after-all",
          "break-after-page",
          "break-after-column"
        )
      ),
      prop(
        "breakBefore",
        "Break before",
        opts(
          "break-before-auto",
          "break-before-avoid",
          "break-before-all",
          "break-before-page",
          "break-before-column"
        )
      ),
      prop(
        "breakInside",
        "Break inside",
        opts(
          "break-inside-auto",
          "break-inside-avoid",
          "break-inside-avoid-page",
          "break-inside-avoid-column"
        )
      ),
      prop(
        "boxDecoration",
        "Box decoration",
        opts("box-decoration-clone", "box-decoration-slice")
      ),
      prop("boxSizing", "Box sizing", opts("box-border", "box-content")),
      prop(
        "float",
        "Float",
        opts("float-start", "float-end", "float-right", "float-left", "float-none")
      ),
      prop(
        "clear",
        "Clear",
        opts(
          "clear-start",
          "clear-end",
          "clear-left",
          "clear-right",
          "clear-both",
          "clear-none"
        )
      ),
      prop("isolation", "Isolation", opts("isolate", "isolation-auto")),
      prop(
        "objectFit",
        "Object fit",
        opts(
          "object-contain",
          "object-cover",
          "object-fill",
          "object-none",
          "object-scale-down"
        )
      ),
      prop(
        "objectPosition",
        "Object position",
        opts(
          "object-bottom",
          "object-center",
          "object-left",
          "object-left-bottom",
          "object-left-top",
          "object-right",
          "object-right-bottom",
          "object-right-top",
          "object-top"
        )
      ),
      prop(
        "overflow",
        "Overflow",
        opts(
          "overflow-auto",
          "overflow-hidden",
          "overflow-clip",
          "overflow-visible",
          "overflow-scroll",
          "overflow-x-auto",
          "overflow-y-auto",
          "overflow-x-hidden",
          "overflow-y-hidden",
          "overflow-x-scroll",
          "overflow-y-scroll"
        )
      ),
      prop(
        "overscroll",
        "Overscroll",
        opts(
          "overscroll-auto",
          "overscroll-contain",
          "overscroll-none",
          "overscroll-y-auto",
          "overscroll-y-contain",
          "overscroll-y-none",
          "overscroll-x-auto",
          "overscroll-x-contain",
          "overscroll-x-none"
        )
      ),
      prop(
        "position",
        "Position",
        opts("static", "fixed", "absolute", "relative", "sticky")
      ),
      prop(
        "inset",
        "Inset",
        numbered("inset", [...SPACING, "auto", "full", "1/2", "1/3", "2/3", "1/4", "3/4"])
      ),
      prop(
        "top",
        "Top",
        numbered("top", [...SPACING, "auto", "full", "1/2", "1/3", "2/3", "1/4", "3/4"])
      ),
      prop(
        "right",
        "Right",
        numbered("right", [...SPACING, "auto", "full", "1/2", "1/3", "2/3", "1/4", "3/4"])
      ),
      prop(
        "bottom",
        "Bottom",
        numbered("bottom", [...SPACING, "auto", "full", "1/2", "1/3", "2/3", "1/4", "3/4"])
      ),
      prop(
        "left",
        "Left",
        numbered("left", [...SPACING, "auto", "full", "1/2", "1/3", "2/3", "1/4", "3/4"])
      ),
      prop("visibility", "Visibility", opts("visible", "invisible", "collapse")),
      prop(
        "zIndex",
        "Z-index",
        numbered("z", [0, 10, 20, 30, 40, 50, "auto"])
      ),
    ],
  },
  {
    id: "flexbox-grid",
    label: "Flexbox & Grid",
    properties: [
      prop(
        "flexBasis",
        "Flex basis",
        numbered("basis", [...SPACING, ...FRACTIONS, "auto", "full"])
      ),
      prop(
        "flexDirection",
        "Flex direction",
        opts("flex-row", "flex-row-reverse", "flex-col", "flex-col-reverse")
      ),
      prop(
        "flexWrap",
        "Flex wrap",
        opts("flex-wrap", "flex-wrap-reverse", "flex-nowrap")
      ),
      prop("flex", "Flex", opts("flex-1", "flex-auto", "flex-initial", "flex-none")),
      prop("flexGrow", "Flex grow", opts("grow", "grow-0")),
      prop("flexShrink", "Flex shrink", opts("shrink", "shrink-0")),
      prop(
        "order",
        "Order",
        numbered("order", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, "first", "last", "none"])
      ),
      prop(
        "gridTemplateColumns",
        "Grid columns",
        numbered("grid-cols", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, "none", "subgrid"])
      ),
      prop(
        "gridColumn",
        "Grid column",
        opts(
          "col-auto",
          "col-span-1",
          "col-span-2",
          "col-span-3",
          "col-span-4",
          "col-span-5",
          "col-span-6",
          "col-span-7",
          "col-span-8",
          "col-span-9",
          "col-span-10",
          "col-span-11",
          "col-span-12",
          "col-span-full",
          "col-start-1",
          "col-start-2",
          "col-start-auto",
          "col-end-1",
          "col-end-2",
          "col-end-auto"
        )
      ),
      prop(
        "gridTemplateRows",
        "Grid rows",
        numbered("grid-rows", [1, 2, 3, 4, 5, 6, "none", "subgrid"])
      ),
      prop(
        "gridRow",
        "Grid row",
        opts(
          "row-auto",
          "row-span-1",
          "row-span-2",
          "row-span-3",
          "row-span-4",
          "row-span-5",
          "row-span-6",
          "row-span-full",
          "row-start-auto",
          "row-end-auto"
        )
      ),
      prop(
        "gridAutoFlow",
        "Grid auto flow",
        opts(
          "grid-flow-row",
          "grid-flow-col",
          "grid-flow-dense",
          "grid-flow-row-dense",
          "grid-flow-col-dense"
        )
      ),
      prop(
        "gridAutoColumns",
        "Grid auto columns",
        opts("auto-cols-auto", "auto-cols-min", "auto-cols-max", "auto-cols-fr")
      ),
      prop(
        "gridAutoRows",
        "Grid auto rows",
        opts("auto-rows-auto", "auto-rows-min", "auto-rows-max", "auto-rows-fr")
      ),
      prop("gap", "Gap", numbered("gap", [...SPACING])),
      prop("gapX", "Gap X", numbered("gap-x", [...SPACING])),
      prop("gapY", "Gap Y", numbered("gap-y", [...SPACING])),
      prop(
        "justifyContent",
        "Justify content",
        opts(
          "justify-normal",
          "justify-start",
          "justify-end",
          "justify-center",
          "justify-between",
          "justify-around",
          "justify-evenly",
          "justify-stretch"
        )
      ),
      prop(
        "justifyItems",
        "Justify items",
        opts(
          "justify-items-start",
          "justify-items-end",
          "justify-items-center",
          "justify-items-stretch"
        )
      ),
      prop(
        "justifySelf",
        "Justify self",
        opts(
          "justify-self-auto",
          "justify-self-start",
          "justify-self-end",
          "justify-self-center",
          "justify-self-stretch"
        )
      ),
      prop(
        "alignContent",
        "Align content",
        opts(
          "content-normal",
          "content-center",
          "content-start",
          "content-end",
          "content-between",
          "content-around",
          "content-evenly",
          "content-baseline",
          "content-stretch"
        )
      ),
      prop(
        "alignItems",
        "Align items",
        opts(
          "items-start",
          "items-end",
          "items-center",
          "items-baseline",
          "items-stretch"
        )
      ),
      prop(
        "alignSelf",
        "Align self",
        opts(
          "self-auto",
          "self-start",
          "self-end",
          "self-center",
          "self-stretch",
          "self-baseline"
        )
      ),
      prop(
        "placeContent",
        "Place content",
        opts(
          "place-content-center",
          "place-content-start",
          "place-content-end",
          "place-content-between",
          "place-content-around",
          "place-content-evenly",
          "place-content-baseline",
          "place-content-stretch"
        )
      ),
      prop(
        "placeItems",
        "Place items",
        opts(
          "place-items-start",
          "place-items-end",
          "place-items-center",
          "place-items-baseline",
          "place-items-stretch"
        )
      ),
      prop(
        "placeSelf",
        "Place self",
        opts(
          "place-self-auto",
          "place-self-start",
          "place-self-end",
          "place-self-center",
          "place-self-stretch"
        )
      ),
    ],
  },
  {
    id: "spacing",
    label: "Spacing",
    properties: [
      prop("p", "Padding", numbered("p", [...SPACING])),
      prop("px", "Padding X", numbered("px", [...SPACING])),
      prop("py", "Padding Y", numbered("py", [...SPACING])),
      prop("pt", "Padding top", numbered("pt", [...SPACING])),
      prop("pr", "Padding right", numbered("pr", [...SPACING])),
      prop("pb", "Padding bottom", numbered("pb", [...SPACING])),
      prop("pl", "Padding left", numbered("pl", [...SPACING])),
      prop(
        "m",
        "Margin",
        numbered("m", [...SPACING, "auto"])
      ),
      prop("mx", "Margin X", numbered("mx", [...SPACING, "auto"])),
      prop("my", "Margin Y", numbered("my", [...SPACING, "auto"])),
      prop("mt", "Margin top", numbered("mt", [...SPACING, "auto"])),
      prop("mr", "Margin right", numbered("mr", [...SPACING, "auto"])),
      prop("mb", "Margin bottom", numbered("mb", [...SPACING, "auto"])),
      prop("ml", "Margin left", numbered("ml", [...SPACING, "auto"])),
      prop("spaceX", "Space X", numbered("space-x", [...SPACING])),
      prop("spaceY", "Space Y", numbered("space-y", [...SPACING])),
    ],
  },
  {
    id: "sizing",
    label: "Sizing",
    properties: [
      prop(
        "w",
        "Width",
        numbered("w", [...SPACING, ...FRACTIONS, ...SIZING_EXTRAS])
      ),
      prop(
        "minW",
        "Min width",
        numbered("min-w", [0, ...FRACTIONS.filter((f) => f === "full"), "min", "max", "fit"])
      ),
      prop(
        "maxW",
        "Max width",
        opts(
          "max-w-0",
          "max-w-none",
          "max-w-xs",
          "max-w-sm",
          "max-w-md",
          "max-w-lg",
          "max-w-xl",
          "max-w-2xl",
          "max-w-3xl",
          "max-w-4xl",
          "max-w-5xl",
          "max-w-6xl",
          "max-w-7xl",
          "max-w-full",
          "max-w-min",
          "max-w-max",
          "max-w-fit",
          "max-w-prose",
          "max-w-screen-sm",
          "max-w-screen-md",
          "max-w-screen-lg",
          "max-w-screen-xl",
          "max-w-screen-2xl"
        )
      ),
      prop(
        "h",
        "Height",
        numbered("h", [...SPACING, ...FRACTIONS, ...SIZING_EXTRAS])
      ),
      prop(
        "minH",
        "Min height",
        numbered("min-h", [0, "full", "screen", "svh", "lvh", "dvh", "min", "max", "fit"])
      ),
      prop(
        "maxH",
        "Max height",
        numbered("max-h", [...SPACING, "none", "full", "screen", "svh", "lvh", "dvh", "min", "max", "fit"])
      ),
      prop(
        "size",
        "Size",
        numbered("size", [...SPACING, ...FRACTIONS, "auto", "full", "min", "max", "fit"])
      ),
    ],
  },
  {
    id: "typography",
    label: "Typography",
    properties: [
      prop(
        "fontFamily",
        "Font family",
        opts("font-sans", "font-serif", "font-mono")
      ),
      prop(
        "fontSize",
        "Font size",
        opts(
          "text-xs",
          "text-sm",
          "text-base",
          "text-lg",
          "text-xl",
          "text-2xl",
          "text-3xl",
          "text-4xl",
          "text-5xl",
          "text-6xl",
          "text-7xl",
          "text-8xl",
          "text-9xl"
        )
      ),
      prop(
        "fontSmoothing",
        "Font smoothing",
        opts("antialiased", "subpixel-antialiased")
      ),
      prop("fontStyle", "Font style", opts("italic", "not-italic")),
      prop(
        "fontWeight",
        "Font weight",
        opts(
          "font-thin",
          "font-extralight",
          "font-light",
          "font-normal",
          "font-medium",
          "font-semibold",
          "font-bold",
          "font-extrabold",
          "font-black"
        )
      ),
      prop(
        "fontStretch",
        "Font stretch",
        opts(
          "font-stretch-ultra-condensed",
          "font-stretch-extra-condensed",
          "font-stretch-condensed",
          "font-stretch-semi-condensed",
          "font-stretch-normal",
          "font-stretch-semi-expanded",
          "font-stretch-expanded",
          "font-stretch-extra-expanded",
          "font-stretch-ultra-expanded"
        )
      ),
      prop(
        "fontVariantNumeric",
        "Font variant numeric",
        opts(
          "normal-nums",
          "ordinal",
          "slashed-zero",
          "lining-nums",
          "oldstyle-nums",
          "proportional-nums",
          "tabular-nums",
          "diagonal-fractions",
          "stacked-fractions"
        )
      ),
      prop(
        "letterSpacing",
        "Letter spacing",
        opts(
          "tracking-tighter",
          "tracking-tight",
          "tracking-normal",
          "tracking-wide",
          "tracking-wider",
          "tracking-widest"
        )
      ),
      prop(
        "lineClamp",
        "Line clamp",
        numbered("line-clamp", [1, 2, 3, 4, 5, 6, "none"])
      ),
      prop(
        "lineHeight",
        "Line height",
        opts(
          "leading-3",
          "leading-4",
          "leading-5",
          "leading-6",
          "leading-7",
          "leading-8",
          "leading-9",
          "leading-10",
          "leading-none",
          "leading-tight",
          "leading-snug",
          "leading-normal",
          "leading-relaxed",
          "leading-loose"
        )
      ),
      prop(
        "listStyleImage",
        "List style image",
        opts("list-image-none")
      ),
      prop(
        "listStylePosition",
        "List style position",
        opts("list-inside", "list-outside")
      ),
      prop(
        "listStyleType",
        "List style type",
        opts("list-none", "list-disc", "list-decimal")
      ),
      prop(
        "textAlign",
        "Text align",
        opts(
          "text-left",
          "text-center",
          "text-right",
          "text-justify",
          "text-start",
          "text-end"
        )
      ),
      prop("textColor", "Text color", colorClasses("text")),
      prop(
        "textDecoration",
        "Text decoration",
        opts("underline", "overline", "line-through", "no-underline")
      ),
      prop("textDecorationColor", "Decoration color", colorClasses("decoration")),
      prop(
        "textDecorationStyle",
        "Decoration style",
        opts(
          "decoration-solid",
          "decoration-double",
          "decoration-dotted",
          "decoration-dashed",
          "decoration-wavy"
        )
      ),
      prop(
        "textDecorationThickness",
        "Decoration thickness",
        opts(
          "decoration-auto",
          "decoration-from-font",
          "decoration-0",
          "decoration-1",
          "decoration-2",
          "decoration-4",
          "decoration-8"
        )
      ),
      prop(
        "textUnderlineOffset",
        "Underline offset",
        numbered("underline-offset", [0, 1, 2, 4, 8, "auto"])
      ),
      prop(
        "textTransform",
        "Text transform",
        opts("uppercase", "lowercase", "capitalize", "normal-case")
      ),
      prop(
        "textOverflow",
        "Text overflow",
        opts("truncate", "text-ellipsis", "text-clip")
      ),
      prop(
        "textWrap",
        "Text wrap",
        opts("text-wrap", "text-nowrap", "text-balance", "text-pretty")
      ),
      prop(
        "textIndent",
        "Text indent",
        numbered("indent", [...SPACING])
      ),
      prop(
        "verticalAlign",
        "Vertical align",
        opts(
          "align-baseline",
          "align-top",
          "align-middle",
          "align-bottom",
          "align-text-top",
          "align-text-bottom",
          "align-sub",
          "align-super"
        )
      ),
      prop(
        "whitespace",
        "Whitespace",
        opts(
          "whitespace-normal",
          "whitespace-nowrap",
          "whitespace-pre",
          "whitespace-pre-line",
          "whitespace-pre-wrap",
          "whitespace-break-spaces"
        )
      ),
      prop(
        "wordBreak",
        "Word break",
        opts("break-normal", "break-words", "break-all", "break-keep")
      ),
      prop(
        "hyphens",
        "Hyphens",
        opts("hyphens-none", "hyphens-manual", "hyphens-auto")
      ),
      prop("content", "Content", opts("content-none")),
    ],
  },
  {
    id: "backgrounds",
    label: "Backgrounds",
    properties: [
      prop(
        "bgAttachment",
        "Background attachment",
        opts("bg-fixed", "bg-local", "bg-scroll")
      ),
      prop(
        "bgClip",
        "Background clip",
        opts(
          "bg-clip-border",
          "bg-clip-padding",
          "bg-clip-content",
          "bg-clip-text"
        )
      ),
      prop("bgColor", "Background color", colorClasses("bg")),
      prop(
        "bgOrigin",
        "Background origin",
        opts("bg-origin-border", "bg-origin-padding", "bg-origin-content")
      ),
      prop(
        "bgPosition",
        "Background position",
        opts(
          "bg-bottom",
          "bg-center",
          "bg-left",
          "bg-left-bottom",
          "bg-left-top",
          "bg-right",
          "bg-right-bottom",
          "bg-right-top",
          "bg-top"
        )
      ),
      prop(
        "bgRepeat",
        "Background repeat",
        opts(
          "bg-repeat",
          "bg-no-repeat",
          "bg-repeat-x",
          "bg-repeat-y",
          "bg-repeat-round",
          "bg-repeat-space"
        )
      ),
      prop(
        "bgSize",
        "Background size",
        opts("bg-auto", "bg-cover", "bg-contain")
      ),
      prop(
        "bgImage",
        "Background image",
        opts(
          "bg-none",
          "bg-gradient-to-t",
          "bg-gradient-to-tr",
          "bg-gradient-to-r",
          "bg-gradient-to-br",
          "bg-gradient-to-b",
          "bg-gradient-to-bl",
          "bg-gradient-to-l",
          "bg-gradient-to-tl"
        )
      ),
      prop(
        "from",
        "Gradient from",
        colorClasses("from")
      ),
      prop("via", "Gradient via", colorClasses("via")),
      prop("to", "Gradient to", colorClasses("to")),
    ],
  },
  {
    id: "borders",
    label: "Borders",
    properties: [
      prop(
        "rounded",
        "Border radius",
        opts(
          "rounded-none",
          "rounded-sm",
          "rounded",
          "rounded-md",
          "rounded-lg",
          "rounded-xl",
          "rounded-2xl",
          "rounded-3xl",
          "rounded-full"
        )
      ),
      prop(
        "roundedT",
        "Radius top",
        opts(
          "rounded-t-none",
          "rounded-t-sm",
          "rounded-t",
          "rounded-t-md",
          "rounded-t-lg",
          "rounded-t-xl",
          "rounded-t-2xl",
          "rounded-t-3xl",
          "rounded-t-full"
        )
      ),
      prop(
        "roundedB",
        "Radius bottom",
        opts(
          "rounded-b-none",
          "rounded-b-sm",
          "rounded-b",
          "rounded-b-md",
          "rounded-b-lg",
          "rounded-b-xl",
          "rounded-b-2xl",
          "rounded-b-3xl",
          "rounded-b-full"
        )
      ),
      prop(
        "borderWidth",
        "Border width",
        opts("border-0", "border-2", "border-4", "border-8", "border")
      ),
      prop(
        "borderT",
        "Border top width",
        opts("border-t-0", "border-t-2", "border-t-4", "border-t-8", "border-t")
      ),
      prop(
        "borderR",
        "Border right width",
        opts("border-r-0", "border-r-2", "border-r-4", "border-r-8", "border-r")
      ),
      prop(
        "borderB",
        "Border bottom width",
        opts("border-b-0", "border-b-2", "border-b-4", "border-b-8", "border-b")
      ),
      prop(
        "borderL",
        "Border left width",
        opts("border-l-0", "border-l-2", "border-l-4", "border-l-8", "border-l")
      ),
      prop("borderColor", "Border color", colorClasses("border")),
      prop(
        "borderStyle",
        "Border style",
        opts(
          "border-solid",
          "border-dashed",
          "border-dotted",
          "border-double",
          "border-hidden",
          "border-none"
        )
      ),
      prop(
        "divideX",
        "Divide X",
        opts("divide-x-0", "divide-x-2", "divide-x-4", "divide-x-8", "divide-x")
      ),
      prop(
        "divideY",
        "Divide Y",
        opts("divide-y-0", "divide-y-2", "divide-y-4", "divide-y-8", "divide-y")
      ),
      prop("divideColor", "Divide color", colorClasses("divide")),
      prop(
        "divideStyle",
        "Divide style",
        opts(
          "divide-solid",
          "divide-dashed",
          "divide-dotted",
          "divide-double",
          "divide-none"
        )
      ),
      prop(
        "outlineWidth",
        "Outline width",
        opts("outline-0", "outline-1", "outline-2", "outline-4", "outline-8")
      ),
      prop("outlineColor", "Outline color", colorClasses("outline")),
      prop(
        "outlineStyle",
        "Outline style",
        opts(
          "outline-none",
          "outline",
          "outline-dashed",
          "outline-dotted",
          "outline-double"
        )
      ),
      prop(
        "outlineOffset",
        "Outline offset",
        numbered("outline-offset", [0, 1, 2, 4, 8])
      ),
      prop(
        "ringWidth",
        "Ring width",
        opts("ring-0", "ring-1", "ring-2", "ring", "ring-4", "ring-8", "ring-inset")
      ),
      prop("ringColor", "Ring color", colorClasses("ring")),
      prop(
        "ringOffsetWidth",
        "Ring offset width",
        opts("ring-offset-0", "ring-offset-1", "ring-offset-2", "ring-offset-4", "ring-offset-8")
      ),
      prop("ringOffsetColor", "Ring offset color", colorClasses("ring-offset")),
    ],
  },
  {
    id: "effects",
    label: "Effects",
    properties: [
      prop(
        "shadow",
        "Box shadow",
        opts(
          "shadow-sm",
          "shadow",
          "shadow-md",
          "shadow-lg",
          "shadow-xl",
          "shadow-2xl",
          "shadow-inner",
          "shadow-none"
        )
      ),
      prop("shadowColor", "Shadow color", colorClasses("shadow")),
      prop(
        "opacity",
        "Opacity",
        numbered("opacity", [0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100])
      ),
      prop(
        "mixBlend",
        "Mix blend",
        opts(
          "mix-blend-normal",
          "mix-blend-multiply",
          "mix-blend-screen",
          "mix-blend-overlay",
          "mix-blend-darken",
          "mix-blend-lighten",
          "mix-blend-color-dodge",
          "mix-blend-color-burn",
          "mix-blend-hard-light",
          "mix-blend-soft-light",
          "mix-blend-difference",
          "mix-blend-exclusion",
          "mix-blend-hue",
          "mix-blend-saturation",
          "mix-blend-color",
          "mix-blend-luminosity",
          "mix-blend-plus-darker",
          "mix-blend-plus-lighter"
        )
      ),
      prop(
        "bgBlend",
        "Background blend",
        opts(
          "bg-blend-normal",
          "bg-blend-multiply",
          "bg-blend-screen",
          "bg-blend-overlay",
          "bg-blend-darken",
          "bg-blend-lighten",
          "bg-blend-color-dodge",
          "bg-blend-color-burn",
          "bg-blend-hard-light",
          "bg-blend-soft-light",
          "bg-blend-difference",
          "bg-blend-exclusion",
          "bg-blend-hue",
          "bg-blend-saturation",
          "bg-blend-color",
          "bg-blend-luminosity"
        )
      ),
    ],
  },
  {
    id: "filters",
    label: "Filters",
    properties: [
      prop(
        "blur",
        "Blur",
        opts("blur-none", "blur-sm", "blur", "blur-md", "blur-lg", "blur-xl", "blur-2xl", "blur-3xl")
      ),
      prop(
        "brightness",
        "Brightness",
        numbered("brightness", [0, 50, 75, 90, 95, 100, 105, 110, 125, 150, 200])
      ),
      prop(
        "contrast",
        "Contrast",
        numbered("contrast", [0, 50, 75, 100, 125, 150, 200])
      ),
      prop(
        "dropShadow",
        "Drop shadow",
        opts(
          "drop-shadow-sm",
          "drop-shadow",
          "drop-shadow-md",
          "drop-shadow-lg",
          "drop-shadow-xl",
          "drop-shadow-2xl",
          "drop-shadow-none"
        )
      ),
      prop("grayscale", "Grayscale", opts("grayscale-0", "grayscale")),
      prop(
        "hueRotate",
        "Hue rotate",
        numbered("hue-rotate", [0, 15, 30, 60, 90, 180])
      ),
      prop("invert", "Invert", opts("invert-0", "invert")),
      prop(
        "saturate",
        "Saturate",
        numbered("saturate", [0, 50, 100, 150, 200])
      ),
      prop("sepia", "Sepia", opts("sepia-0", "sepia")),
      prop(
        "backdropBlur",
        "Backdrop blur",
        opts(
          "backdrop-blur-none",
          "backdrop-blur-sm",
          "backdrop-blur",
          "backdrop-blur-md",
          "backdrop-blur-lg",
          "backdrop-blur-xl",
          "backdrop-blur-2xl",
          "backdrop-blur-3xl"
        )
      ),
      prop(
        "backdropBrightness",
        "Backdrop brightness",
        numbered("backdrop-brightness", [0, 50, 75, 90, 95, 100, 105, 110, 125, 150, 200])
      ),
      prop(
        "backdropContrast",
        "Backdrop contrast",
        numbered("backdrop-contrast", [0, 50, 75, 100, 125, 150, 200])
      ),
      prop(
        "backdropGrayscale",
        "Backdrop grayscale",
        opts("backdrop-grayscale-0", "backdrop-grayscale")
      ),
      prop(
        "backdropHueRotate",
        "Backdrop hue rotate",
        numbered("backdrop-hue-rotate", [0, 15, 30, 60, 90, 180])
      ),
      prop(
        "backdropInvert",
        "Backdrop invert",
        opts("backdrop-invert-0", "backdrop-invert")
      ),
      prop(
        "backdropOpacity",
        "Backdrop opacity",
        numbered("backdrop-opacity", [0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100])
      ),
      prop(
        "backdropSaturate",
        "Backdrop saturate",
        numbered("backdrop-saturate", [0, 50, 100, 150, 200])
      ),
      prop(
        "backdropSepia",
        "Backdrop sepia",
        opts("backdrop-sepia-0", "backdrop-sepia")
      ),
    ],
  },
  {
    id: "tables",
    label: "Tables",
    properties: [
      prop(
        "borderCollapse",
        "Border collapse",
        opts("border-collapse", "border-separate")
      ),
      prop(
        "borderSpacing",
        "Border spacing",
        numbered("border-spacing", [...SPACING])
      ),
      prop("tableLayout", "Table layout", opts("table-auto", "table-fixed")),
      prop("captionSide", "Caption side", opts("caption-top", "caption-bottom")),
    ],
  },
  {
    id: "transitions",
    label: "Transitions & Animation",
    properties: [
      prop(
        "transition",
        "Transition",
        opts(
          "transition-none",
          "transition-all",
          "transition",
          "transition-colors",
          "transition-opacity",
          "transition-shadow",
          "transition-transform"
        )
      ),
      prop(
        "duration",
        "Duration",
        numbered("duration", [0, 75, 100, 150, 200, 300, 500, 700, 1000])
      ),
      prop(
        "ease",
        "Timing",
        opts("ease-linear", "ease-in", "ease-out", "ease-in-out")
      ),
      prop(
        "delay",
        "Delay",
        numbered("delay", [0, 75, 100, 150, 200, 300, 500, 700, 1000])
      ),
      prop(
        "animate",
        "Animation",
        opts(
          "animate-none",
          "animate-spin",
          "animate-ping",
          "animate-pulse",
          "animate-bounce"
        )
      ),
    ],
  },
  {
    id: "transforms",
    label: "Transforms",
    properties: [
      prop(
        "scale",
        "Scale",
        numbered("scale", [0, 50, 75, 90, 95, 100, 105, 110, 125, 150])
      ),
      prop(
        "scaleX",
        "Scale X",
        numbered("scale-x", [0, 50, 75, 90, 95, 100, 105, 110, 125, 150])
      ),
      prop(
        "scaleY",
        "Scale Y",
        numbered("scale-y", [0, 50, 75, 90, 95, 100, 105, 110, 125, 150])
      ),
      prop(
        "rotate",
        "Rotate",
        numbered("rotate", [0, 1, 2, 3, 6, 12, 45, 90, 180])
      ),
      prop(
        "translateX",
        "Translate X",
        numbered("translate-x", [...SPACING, "full", "1/2", "1/3", "2/3", "1/4", "3/4"])
      ),
      prop(
        "translateY",
        "Translate Y",
        numbered("translate-y", [...SPACING, "full", "1/2", "1/3", "2/3", "1/4", "3/4"])
      ),
      prop("skewX", "Skew X", numbered("skew-x", [0, 1, 2, 3, 6, 12])),
      prop("skewY", "Skew Y", numbered("skew-y", [0, 1, 2, 3, 6, 12])),
      prop(
        "transformOrigin",
        "Transform origin",
        opts(
          "origin-center",
          "origin-top",
          "origin-top-right",
          "origin-right",
          "origin-bottom-right",
          "origin-bottom",
          "origin-bottom-left",
          "origin-left",
          "origin-top-left"
        )
      ),
    ],
  },
  {
    id: "interactivity",
    label: "Interactivity",
    properties: [
      prop("accentColor", "Accent color", colorClasses("accent")),
      prop(
        "appearance",
        "Appearance",
        opts("appearance-none", "appearance-auto")
      ),
      prop(
        "cursor",
        "Cursor",
        opts(
          "cursor-auto",
          "cursor-default",
          "cursor-pointer",
          "cursor-wait",
          "cursor-text",
          "cursor-move",
          "cursor-help",
          "cursor-not-allowed",
          "cursor-none",
          "cursor-context-menu",
          "cursor-progress",
          "cursor-cell",
          "cursor-crosshair",
          "cursor-vertical-text",
          "cursor-alias",
          "cursor-copy",
          "cursor-no-drop",
          "cursor-grab",
          "cursor-grabbing",
          "cursor-all-scroll",
          "cursor-col-resize",
          "cursor-row-resize",
          "cursor-n-resize",
          "cursor-e-resize",
          "cursor-s-resize",
          "cursor-w-resize",
          "cursor-ne-resize",
          "cursor-nw-resize",
          "cursor-se-resize",
          "cursor-sw-resize",
          "cursor-ew-resize",
          "cursor-ns-resize",
          "cursor-nesw-resize",
          "cursor-nwse-resize",
          "cursor-zoom-in",
          "cursor-zoom-out"
        )
      ),
      prop("caretColor", "Caret color", colorClasses("caret")),
      prop(
        "pointerEvents",
        "Pointer events",
        opts("pointer-events-none", "pointer-events-auto")
      ),
      prop(
        "resize",
        "Resize",
        opts("resize-none", "resize-y", "resize-x", "resize")
      ),
      prop(
        "scrollBehavior",
        "Scroll behavior",
        opts("scroll-auto", "scroll-smooth")
      ),
      prop(
        "scrollSnapAlign",
        "Scroll snap align",
        opts("snap-start", "snap-end", "snap-center", "snap-align-none")
      ),
      prop(
        "scrollSnapStop",
        "Scroll snap stop",
        opts("snap-normal", "snap-always")
      ),
      prop(
        "scrollSnapType",
        "Scroll snap type",
        opts(
          "snap-none",
          "snap-x",
          "snap-y",
          "snap-both",
          "snap-mandatory",
          "snap-proximity"
        )
      ),
      prop(
        "touchAction",
        "Touch action",
        opts(
          "touch-auto",
          "touch-none",
          "touch-pan-x",
          "touch-pan-left",
          "touch-pan-right",
          "touch-pan-y",
          "touch-pan-up",
          "touch-pan-down",
          "touch-pinch-zoom",
          "touch-manipulation"
        )
      ),
      prop(
        "userSelect",
        "User select",
        opts("select-none", "select-text", "select-all", "select-auto")
      ),
      prop(
        "willChange",
        "Will change",
        opts(
          "will-change-auto",
          "will-change-scroll",
          "will-change-contents",
          "will-change-transform"
        )
      ),
    ],
  },
  {
    id: "svg",
    label: "SVG",
    properties: [
      prop("fill", "Fill", colorClasses("fill")),
      prop("stroke", "Stroke", colorClasses("stroke")),
      prop(
        "strokeWidth",
        "Stroke width",
        opts("stroke-0", "stroke-1", "stroke-2")
      ),
    ],
  },
  {
    id: "accessibility",
    label: "Accessibility",
    properties: [
      prop(
        "srOnly",
        "Screen reader",
        opts("sr-only", "not-sr-only")
      ),
      prop(
        "forcedColorAdjust",
        "Forced color adjust",
        opts("forced-color-adjust-auto", "forced-color-adjust-none")
      ),
    ],
  },
];

/** Flat list of every concrete utility class (for Tailwind safelist). */
export function getAllTailwindClassNames(): string[] {
  const set = new Set<string>();
  for (const cat of TAILWIND_CATEGORIES) {
    for (const prop of cat.properties) {
      for (const opt of prop.options) {
        if (opt.value) set.add(opt.value);
      }
    }
  }
  return [...set];
}

export function findProperty(id: string): TwProperty | undefined {
  for (const cat of TAILWIND_CATEGORIES) {
    const found = cat.properties.find((p) => p.id === id);
    if (found) return found;
  }
  return undefined;
}

export const TAILWIND_PROPERTY_IDS = TAILWIND_CATEGORIES.flatMap((c) =>
  c.properties.map((p) => p.id)
);
