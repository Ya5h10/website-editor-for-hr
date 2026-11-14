"use client";

import { useMemo, useState } from "react";
import { TAILWIND_CATEGORIES } from "./tailwindCatalog";
import {
  TailwindClassMap,
  buildTailwindClassName,
  countTailwindClasses,
} from "./tailwindStyles";
import { IconChevronDown, IconSearch } from "./icons";

interface TailwindDesignPanelProps {
  tailwind?: TailwindClassMap;
  tailwindExtra?: string;
  onChangeTailwind?: (patch: TailwindClassMap) => void;
  onChangeExtra?: (extra: string) => void;
}

export default function TailwindDesignPanel({
  tailwind = {},
  tailwindExtra = "",
  onChangeTailwind,
  onChangeExtra,
}: TailwindDesignPanelProps) {
  const [query, setQuery] = useState("");
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({
    layout: true,
    spacing: false,
    typography: false,
    backgrounds: false,
    borders: false,
  });

  const classCount = countTailwindClasses(tailwind, tailwindExtra);
  const preview = buildTailwindClassName(tailwind, tailwindExtra);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TAILWIND_CATEGORIES;
    return TAILWIND_CATEGORIES.map((cat) => ({
      ...cat,
      properties: cat.properties.filter(
        (p) =>
          p.label.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.options.some((o) => o.value.toLowerCase().includes(q))
      ),
    })).filter((cat) => cat.properties.length > 0);
  }, [query]);

  const setProp = (id: string, value: string) => {
    onChangeTailwind?.({ [id]: value || undefined });
  };

  const clearAll = () => {
    const cleared: TailwindClassMap = {};
    for (const cat of TAILWIND_CATEGORIES) {
      for (const p of cat.properties) {
        if (tailwind[p.id]) cleared[p.id] = "";
      }
    }
    onChangeTailwind?.(cleared);
    onChangeExtra?.("");
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-3 py-2 border-b border-[#222] space-y-2 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="text-[11px] uppercase tracking-wide text-[#666]">
            Tailwind utilities
          </div>
          <div className="text-[11px] text-[#555]">
            {classCount} class{classCount === 1 ? "" : "es"}
          </div>
        </div>
        <div className="flex items-center h-8 rounded-md bg-[#1a1a1a] border border-[#222] px-2 gap-1.5">
          <IconSearch size={13} className="text-[#555] shrink-0" />
          <input
            className="bg-transparent text-[12.5px] text-white flex-1 outline-none min-w-0 placeholder:text-[#555]"
            placeholder="Search display, padding, text-blue…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {classCount > 0 ? (
          <button
            type="button"
            className="text-[11px] text-[#888] hover:text-white"
            onClick={clearAll}
          >
            Clear all Tailwind
          </button>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto framer-scrollbar min-h-0">
        {filtered.map((cat) => {
          const open = query ? true : Boolean(openCats[cat.id]);
          const activeInCat = cat.properties.filter((p) => tailwind[p.id]).length;
          return (
            <div key={cat.id} className="border-b border-[#1e1e1e]">
              <button
                type="button"
                className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#161616]"
                onClick={() =>
                  setOpenCats((prev) => ({
                    ...prev,
                    [cat.id]: !prev[cat.id],
                  }))
                }
              >
                <span className="text-[11px] uppercase tracking-wide text-[#888]">
                  {cat.label}
                  {activeInCat > 0 ? (
                    <span className="ml-1.5 text-[#0099ff] normal-case tracking-normal">
                      {activeInCat}
                    </span>
                  ) : null}
                </span>
                <IconChevronDown
                  size={12}
                  className={`opacity-50 transition-transform ${
                    open ? "" : "-rotate-90"
                  }`}
                />
              </button>
              {open ? (
                <div className="px-3 pb-3 space-y-2">
                  {cat.properties.map((p) => (
                    <label key={p.id} className="block">
                      <div className="text-[11px] text-[#666] mb-1 flex items-center justify-between gap-2">
                        <span>{p.label}</span>
                        {tailwind[p.id] ? (
                          <button
                            type="button"
                            className="text-[10px] text-[#666] hover:text-white"
                            onClick={(e) => {
                              e.preventDefault();
                              setProp(p.id, "");
                            }}
                          >
                            clear
                          </button>
                        ) : null}
                      </div>
                      <select
                        className="w-full h-8 rounded-md bg-[#1a1a1a] border border-[#222] px-2 text-[12px] text-white outline-none focus:border-[#0099ff] appearance-none"
                        value={tailwind[p.id] || ""}
                        onChange={(e) => setProp(p.id, e.target.value)}
                      >
                        {p.options.map((o) => (
                          <option key={o.value || "__none"} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}

        {!filtered.length ? (
          <div className="px-3 py-8 text-center text-[12px] text-[#555]">
            No utilities match “{query}”.
          </div>
        ) : null}

        <div className="px-3 py-3 border-t border-[#222]">
          <div className="text-[11px] text-[#666] mb-1">Custom classes</div>
          <textarea
            className="w-full min-h-[64px] rounded-md bg-[#1a1a1a] border border-[#222] px-2.5 py-2 text-[12px] text-white font-mono placeholder:text-[#555] outline-none focus:border-[#0099ff] resize-y"
            placeholder="e.g. hover:bg-white/10 md:px-8"
            value={tailwindExtra}
            onChange={(e) => onChangeExtra?.(e.target.value)}
          />
          <p className="mt-1.5 text-[10.5px] text-[#555] leading-relaxed">
            Variants (hover:, md:, dark:) and arbitrary values go here. Catalog
            covers every default Tailwind utility group.
          </p>
        </div>

        {preview ? (
          <div className="px-3 py-3 border-t border-[#222]">
            <div className="text-[11px] text-[#666] mb-1">className preview</div>
            <code className="block text-[11px] leading-relaxed text-[#9cdcfe] font-mono whitespace-pre-wrap break-all bg-[#0d0d0d] border border-[#222] rounded-md p-2">
              {preview}
            </code>
          </div>
        ) : null}
      </div>
    </div>
  );
}
