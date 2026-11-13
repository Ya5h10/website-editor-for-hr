"use client";

import { IconChevronDown } from "./icons";

interface StylePanelProps {
  selectedLabel?: string;
}

export default function StylePanel({
  selectedLabel = "Headline",
}: StylePanelProps) {
  return (
    <div className="flex flex-col h-full overflow-y-auto framer-scrollbar">
      <div className="px-3 py-3 border-b border-[#222]">
        <div className="text-[11px] uppercase tracking-wide text-[#666] mb-1">
          Selection
        </div>
        <div className="text-[13px] font-medium text-white">{selectedLabel}</div>
        <div className="text-[12px] text-[#666]">Text · Desktop</div>
      </div>

      <Section title="Layout">
        <div className="grid grid-cols-4 gap-1 mb-2">
          {["Stack", "Grid", "Absolute", "Text"].map((m, i) => (
            <button
              key={m}
              type="button"
              className={`h-8 rounded-md text-[11px] border ${
                i === 0
                  ? "bg-[#2a2a2a] border-[#3a3a3a] text-white"
                  : "bg-[#151515] border-[#222] text-[#888] hover:text-white"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <Row label="Direction">
          <Segmented options={["→", "↓", "←", "↑"]} active={1} />
        </Row>
        <Row label="Distribute">
          <SelectValue value="Start" />
        </Row>
        <Row label="Align">
          <Segmented options={["⫷", "☰", "⫸"]} active={0} />
        </Row>
        <Row label="Gap">
          <NumberField value="24" />
        </Row>
        <Row label="Padding">
          <NumberField value="80" />
        </Row>
      </Section>

      <Section title="Size">
        <Row label="Width">
          <NumberField value="1200" suffix="px" />
        </Row>
        <Row label="Height">
          <SelectValue value="Fit" />
        </Row>
      </Section>

      <Section title="Typography">
        <Row label="Font">
          <SelectValue value="Inter" />
        </Row>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Weight">
            <SelectValue value="Semibold" />
          </Field>
          <Field label="Size">
            <NumberField value="64" />
          </Field>
          <Field label="Line">
            <NumberField value="1.05" />
          </Field>
          <Field label="Letter">
            <NumberField value="-1.2" />
          </Field>
        </div>
        <Row label="Color">
          <ColorSwatch color="#FFFFFF" label="#FFFFFF" />
        </Row>
        <Row label="Align">
          <Segmented options={["L", "C", "R", "J"]} active={0} />
        </Row>
      </Section>

      <Section title="Fill">
        <Row label="Fill">
          <ColorSwatch color="#000000" label="#000000" />
        </Row>
      </Section>

      <Section title="Effects">
        <Row label="Opacity">
          <NumberField value="100" suffix="%" />
        </Row>
        <Row label="Radius">
          <NumberField value="0" />
        </Row>
        <button
          type="button"
          className="w-full h-8 mt-1 rounded-md border border-dashed border-[#333] text-[12px] text-[#777] hover:text-white hover:border-[#555]"
        >
          + Add Effect
        </button>
      </Section>
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

function NumberField({ value, suffix }: { value: string; suffix?: string }) {
  return (
    <div className="flex items-center h-8 rounded-md bg-[#1a1a1a] border border-[#222] px-2">
      <span className="text-[12.5px] text-white flex-1">{value}</span>
      {suffix && <span className="text-[11px] text-[#555]">{suffix}</span>}
    </div>
  );
}

function SelectValue({ value }: { value: string }) {
  return (
    <button
      type="button"
      className="w-full flex items-center justify-between h-8 rounded-md bg-[#1a1a1a] border border-[#222] px-2 text-[12.5px] text-white hover:bg-[#222]"
    >
      <span className="truncate">{value}</span>
      <IconChevronDown size={12} className="opacity-50 shrink-0" />
    </button>
  );
}

function Segmented({
  options,
  active,
}: {
  options: string[];
  active: number;
}) {
  return (
    <div className="flex h-8 rounded-md bg-[#151515] border border-[#222] overflow-hidden">
      {options.map((opt, i) => (
        <button
          key={opt}
          type="button"
          className={`flex-1 text-[12px] ${
            i === active
              ? "bg-[#2a2a2a] text-white"
              : "text-[#777] hover:text-white"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function ColorSwatch({ color, label }: { color: string; label: string }) {
  return (
    <button
      type="button"
      className="w-full flex items-center gap-2 h-8 rounded-md bg-[#1a1a1a] border border-[#222] px-2 hover:bg-[#222]"
    >
      <span
        className="w-4 h-4 rounded border border-white/20 shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-[12.5px] text-white">{label}</span>
    </button>
  );
}
