"use client";

import { useState } from "react";
import { CanvasElement, ElementStyle, TailwindClassMap } from "./types";
import { IconChevronDown } from "./icons";
import TailwindDesignPanel from "./TailwindDesignPanel";
import { countTailwindClasses } from "./tailwindStyles";

interface StylePanelProps {
  element?: CanvasElement | null;
  onChangeStyle?: (patch: Partial<ElementStyle>) => void;
  onChangeProps?: (patch: CanvasElement["props"]) => void;
  onChangeName?: (name: string) => void;
  onChangeSize?: (size: { width?: number; height?: number }) => void;
  onChangeTailwind?: (patch: TailwindClassMap) => void;
  onChangeTailwindExtra?: (extra: string) => void;
  onExportElement?: () => void;
}

type StyleTab = "design" | "tailwind";

export default function StylePanel({
  element,
  onChangeStyle,
  onChangeProps,
  onChangeName,
  onChangeSize,
  onChangeTailwind,
  onChangeTailwindExtra,
  onExportElement,
}: StylePanelProps) {
  const [styleTab, setStyleTab] = useState<StyleTab>("tailwind");

  if (!element) {
    return (
      <div className="h-full flex items-center justify-center px-6 text-center text-[12.5px] text-[#666]">
        Select a layer on the canvas to edit styles and content.
      </div>
    );
  }

  const s = element.style;
  const p = element.props;
  const twCount = countTailwindClasses(element.tailwind, element.tailwindExtra);

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-3 py-3 border-b border-[#222] shrink-0">
        <div className="text-[11px] uppercase tracking-wide text-[#666] mb-1">
          Selection
        </div>
        <input
          className="framer-input h-8 font-medium"
          value={element.name}
          onChange={(e) => onChangeName?.(e.target.value)}
        />
        <div className="text-[12px] text-[#666] mt-1 capitalize">
          {element.type.replace("_", " ")} · Desktop
        </div>
        <div className="mt-2.5 flex h-7 p-0.5 rounded-md bg-[#151515] border border-[#222]">
          <button
            type="button"
            className={`flex-1 rounded text-[11.5px] ${
              styleTab === "design"
                ? "bg-[#2a2a2a] text-white"
                : "text-[#777] hover:text-white"
            }`}
            onClick={() => setStyleTab("design")}
          >
            Design
          </button>
          <button
            type="button"
            className={`flex-1 rounded text-[11.5px] ${
              styleTab === "tailwind"
                ? "bg-[#2a2a2a] text-white"
                : "text-[#777] hover:text-white"
            }`}
            onClick={() => setStyleTab("tailwind")}
          >
            Tailwind{twCount ? ` · ${twCount}` : ""}
          </button>
        </div>
      </div>

      {styleTab === "tailwind" ? (
        <div className="flex-1 min-h-0 flex flex-col">
          <TailwindDesignPanel
            tailwind={element.tailwind}
            tailwindExtra={element.tailwindExtra}
            onChangeTailwind={onChangeTailwind}
            onChangeExtra={onChangeTailwindExtra}
          />
          {onExportElement ? (
            <div className="px-3 py-3 border-t border-[#222] shrink-0">
              <button
                type="button"
                className="framer-btn-outline w-full h-8 text-[12.5px]"
                onClick={onExportElement}
              >
                Export this element as React
              </button>
            </div>
          ) : null}
        </div>
      ) : (
      <div className="flex-1 overflow-y-auto framer-scrollbar min-h-0">

      {/* Orbit / content forms */}
      <Section title="Content">
        {(element.type === "text" ||
          element.type === "hero" ||
          element.type === "feature_split" ||
          element.type === "values_grid" ||
          element.type === "features") && (
          <Field label="Heading">
            <input
              className="framer-input"
              value={p.heading || p.text || ""}
              onChange={(e) =>
                onChangeProps?.({
                  heading: e.target.value,
                  text: e.target.value,
                })
              }
              placeholder="Heading"
            />
          </Field>
        )}

        {(element.type === "hero" ||
          element.type === "text" ||
          element.type === "feature_split") && (
          <Field label="Subheading">
            <textarea
              className="w-full min-h-[72px] rounded-[6px] bg-[#1a1a1a] border border-[#222] px-2.5 py-2 text-[12.5px] text-white placeholder:text-[#555] outline-none focus:border-[#0099ff] resize-y"
              value={p.subheading || p.content || ""}
              onChange={(e) =>
                onChangeProps?.({
                  subheading: e.target.value,
                  content: e.target.value,
                })
              }
              placeholder="Supporting copy"
            />
          </Field>
        )}

        {element.type === "button" && (
          <Field label="Label">
            <input
              className="framer-input"
              value={p.label || ""}
              onChange={(e) => onChangeProps?.({ label: e.target.value })}
            />
          </Field>
        )}

        {(element.type === "image" || element.type === "feature_split") && (
          <Field label="Image URL">
            <input
              className="framer-input"
              value={p.imageUrl || ""}
              onChange={(e) => onChangeProps?.({ imageUrl: e.target.value })}
              placeholder="https://…"
            />
          </Field>
        )}

        {element.type === "feature_split" && (
          <Field label="Layout">
            <Segmented
              options={["image_left", "image_right"]}
              labels={["Image left", "Image right"]}
              active={p.layout === "image_right" ? 1 : 0}
              onChange={(i) =>
                onChangeProps?.({
                  layout: i === 1 ? "image_right" : "image_left",
                })
              }
            />
          </Field>
        )}

        {element.type === "hero" && (
          <Field label="Brand color">
            <ColorSwatch
              color={p.brandColor || "#0099ff"}
              label={p.brandColor || "#0099ff"}
              onChange={(c) => onChangeProps?.({ brandColor: c })}
            />
          </Field>
        )}

        {element.type === "values_grid" && (
          <div className="space-y-2">
            {(p.items || []).map((item, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-[#222] bg-[#151515] p-2 space-y-1.5"
              >
                <div className="text-[11px] text-[#666]">Item {idx + 1}</div>
                <input
                  className="framer-input"
                  value={item.title}
                  placeholder="Title"
                  onChange={(e) => {
                    const items = [...(p.items || [])];
                    items[idx] = { ...items[idx], title: e.target.value };
                    onChangeProps?.({ items });
                  }}
                />
                <input
                  className="framer-input"
                  value={item.text}
                  placeholder="Text"
                  onChange={(e) => {
                    const items = [...(p.items || [])];
                    items[idx] = { ...items[idx], text: e.target.value };
                    onChangeProps?.({ items });
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {element.type === "features" && (
          <div className="space-y-2">
            {(p.features || []).map((feat, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-[#222] bg-[#151515] p-2 space-y-1.5"
              >
                <div className="text-[11px] text-[#666]">Feature {idx + 1}</div>
                <input
                  className="framer-input"
                  value={feat.title}
                  placeholder="Title"
                  onChange={(e) => {
                    const features = [...(p.features || [])];
                    features[idx] = {
                      ...features[idx],
                      title: e.target.value,
                    };
                    onChangeProps?.({ features });
                  }}
                />
                <input
                  className="framer-input"
                  value={feat.description}
                  placeholder="Description"
                  onChange={(e) => {
                    const features = [...(p.features || [])];
                    features[idx] = {
                      ...features[idx],
                      description: e.target.value,
                    };
                    onChangeProps?.({ features });
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Layout">
        <Row label="Width">
          <div className="flex gap-1">
            <SelectValue
              value={s.widthMode}
              onClick={() =>
                onChangeStyle?.({
                  widthMode:
                    s.widthMode === "fixed"
                      ? "fill"
                      : s.widthMode === "fill"
                      ? "fit"
                      : "fixed",
                })
              }
            />
            <NumberField
              value={String(Math.round(element.width))}
              suffix="px"
              onCommit={(v) => {
                const n = Number(v);
                if (!Number.isNaN(n)) onChangeSize?.({ width: n });
              }}
            />
          </div>
        </Row>
        <Row label="Height">
          <NumberField
            value={String(Math.round(element.height))}
            suffix="px"
            onCommit={(v) => {
              const n = Number(v);
              if (!Number.isNaN(n)) onChangeSize?.({ height: n });
            }}
          />
        </Row>
        <Row label="Padding">
          <NumberField
            value={String(s.padding)}
            onCommit={(v) => onChangeStyle?.({ padding: Number(v) || 0 })}
          />
        </Row>
      </Section>

      <Section title="Typography">
        <Row label="Size">
          <NumberField
            value={String(s.fontSize)}
            onCommit={(v) => onChangeStyle?.({ fontSize: Number(v) || 16 })}
          />
        </Row>
        <Row label="Weight">
          <NumberField
            value={String(s.fontWeight)}
            onCommit={(v) => onChangeStyle?.({ fontWeight: Number(v) || 500 })}
          />
        </Row>
        <Row label="Color">
          <ColorSwatch
            color={s.color}
            label={s.color}
            onChange={(c) => onChangeStyle?.({ color: c })}
          />
        </Row>
      </Section>

      <Section title="Fill">
        <Row label="Fill">
          <ColorSwatch
            color={s.fill === "transparent" ? "#000000" : s.fill}
            label={s.fill}
            onChange={(c) => onChangeStyle?.({ fill: c })}
          />
        </Row>
        <Row label="Radius">
          <NumberField
            value={String(s.radius)}
            onCommit={(v) => onChangeStyle?.({ radius: Number(v) || 0 })}
          />
        </Row>
        <Row label="Opacity">
          <NumberField
            value={String(s.opacity)}
            suffix="%"
            onCommit={(v) => onChangeStyle?.({ opacity: Number(v) || 100 })}
          />
        </Row>
      </Section>

      {onExportElement ? (
        <div className="px-3 py-3">
          <button
            type="button"
            className="framer-btn-outline w-full h-8 text-[12.5px]"
            onClick={onExportElement}
          >
            Export this element as React
          </button>
          <p className="mt-2 text-[11px] text-[#666] leading-relaxed">
            Generates a typed .tsx component with props you can drop into any
            React app.
          </p>
        </div>
      ) : null}
      </div>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-3 py-3 border-b border-[#222]">
      <button
        type="button"
        className="flex items-center justify-between w-full mb-2 text-[11px] uppercase tracking-wide text-[#888]"
      >
        <span>{title}</span>
        <IconChevronDown size={12} className="opacity-50" />
      </button>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-[72px] shrink-0 text-[12px] text-[#777]">{label}</div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[11px] text-[#666] mb-1">{label}</div>
      {children}
    </div>
  );
}

function NumberField({
  value,
  suffix,
  onCommit,
  onChange,
}: {
  value: string;
  suffix?: string;
  onCommit?: (v: string) => void;
  onChange?: (v: string) => void;
}) {
  return (
    <div className="flex items-center h-8 rounded-md bg-[#1a1a1a] border border-[#222] px-2">
      <input
        className="bg-transparent text-[12.5px] text-white flex-1 outline-none w-full min-w-0"
        defaultValue={value}
        key={value}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={(e) => onCommit?.(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onCommit?.((e.target as HTMLInputElement).value);
          }
        }}
      />
      {suffix && <span className="text-[11px] text-[#555]">{suffix}</span>}
    </div>
  );
}

function SelectValue({
  value,
  onClick,
}: {
  value: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between h-8 rounded-md bg-[#1a1a1a] border border-[#222] px-2 text-[12.5px] text-white hover:bg-[#222] capitalize min-w-[72px]"
    >
      <span className="truncate">{value}</span>
      <IconChevronDown size={12} className="opacity-50 shrink-0" />
    </button>
  );
}

function Segmented({
  options,
  labels,
  active,
  onChange,
}: {
  options: string[];
  labels?: string[];
  active: number;
  onChange?: (i: number) => void;
}) {
  return (
    <div className="flex h-8 rounded-md bg-[#151515] border border-[#222] overflow-hidden">
      {options.map((opt, i) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange?.(i)}
          className={`flex-1 text-[11px] px-1 truncate ${
            i === active
              ? "bg-[#2a2a2a] text-white"
              : "text-[#777] hover:text-white"
          }`}
        >
          {labels?.[i] || opt}
        </button>
      ))}
    </div>
  );
}

function ColorSwatch({
  color,
  label,
  onChange,
}: {
  color: string;
  label: string;
  onChange?: (c: string) => void;
}) {
  return (
    <label className="w-full flex items-center gap-2 h-8 rounded-md bg-[#1a1a1a] border border-[#222] px-2 hover:bg-[#222] cursor-pointer">
      <span
        className="w-4 h-4 rounded border border-white/20 shrink-0 relative overflow-hidden"
        style={{ backgroundColor: color }}
      >
        <input
          type="color"
          className="absolute inset-0 opacity-0 cursor-pointer"
          value={/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color) ? color : "#000000"}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </span>
      <span className="text-[12.5px] text-white truncate">{label}</span>
    </label>
  );
}
