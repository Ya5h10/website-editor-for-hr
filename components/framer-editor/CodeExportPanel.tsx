"use client";

import { useEffect, useMemo, useState } from "react";
import { CanvasElement } from "./types";
import {
  ExportScope,
  describeExport,
  generateReactCode,
} from "./generateReactCode";
import ExportPreview from "./ExportPreview";
import { IconCheck } from "./icons";

interface CodeExportPanelProps {
  elements: CanvasElement[];
  pageName?: string;
  selectedId?: string | null;
  initialScope?: ExportScope;
  onSelectElement?: (id: string) => void;
  onBackToCanvas: () => void;
}

type ViewTab = "code" | "preview";

export default function CodeExportPanel({
  elements,
  pageName = "Home",
  selectedId = null,
  initialScope = "page",
  onSelectElement,
  onBackToCanvas,
}: CodeExportPanelProps) {
  const visible = useMemo(
    () => elements.filter((e) => e.visible !== false),
    [elements]
  );

  const [scope, setScope] = useState<ExportScope>(initialScope);
  const [elementId, setElementId] = useState<string | null>(
    selectedId || visible[0]?.id || null
  );

  useEffect(() => {
    setScope(initialScope);
  }, [initialScope]);
  const [view, setView] = useState<ViewTab>("code");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (selectedId) {
      setElementId(selectedId);
    }
  }, [selectedId]);

  const meta = useMemo(
    () =>
      describeExport(elements, {
        pageName,
        scope,
        elementId: elementId || undefined,
      }),
    [elements, pageName, scope, elementId]
  );

  const code = useMemo(
    () =>
      generateReactCode(elements, {
        pageName,
        scope,
        elementId: elementId || undefined,
      }),
    [elements, pageName, scope, elementId]
  );

  useEffect(() => {
    setCopied(false);
  }, [code]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const download = () => {
    const blob = new Blob([code], {
      type: "text/typescript;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = meta.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectElement = (id: string) => {
    setElementId(id);
    setScope("element");
    onSelectElement?.(id);
  };

  return (
    <div className="flex flex-1 min-h-0 bg-[#0a0a0a] flex-col">
      <div className="h-11 px-3 border-b border-[#222] flex items-center justify-between bg-[#0f0f0f] shrink-0 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            className="framer-btn-ghost h-7 px-2"
            onClick={onBackToCanvas}
          >
            ← Canvas
          </button>
          <span className="text-[#555]">/</span>
          <span className="text-[13px] text-white truncate">React export</span>
          <span className="text-[12px] text-[#666] truncate hidden sm:inline">
            {meta.filename}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <div className="hidden sm:flex h-7 p-0.5 rounded-md bg-[#1a1a1a] border border-[#2a2a2a]">
            <button
              type="button"
              className={`h-full px-2.5 rounded text-[12px] ${
                view === "code"
                  ? "bg-[#2a2a2a] text-white"
                  : "text-[#888] hover:text-white"
              }`}
              onClick={() => setView("code")}
            >
              Code
            </button>
            <button
              type="button"
              className={`h-full px-2.5 rounded text-[12px] ${
                view === "preview"
                  ? "bg-[#2a2a2a] text-white"
                  : "text-[#888] hover:text-white"
              }`}
              onClick={() => setView("preview")}
            >
              Preview
            </button>
          </div>
          <button
            type="button"
            className="framer-btn-outline h-7 px-2.5"
            onClick={download}
          >
            Download .tsx
          </button>
          <button
            type="button"
            className="framer-btn-primary h-7 px-3 inline-flex items-center gap-1.5"
            onClick={copy}
          >
            {copied ? (
              <>
                <IconCheck size={13} /> Copied
              </>
            ) : (
              "Copy React code"
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <aside className="w-[240px] shrink-0 border-r border-[#222] bg-[#111] flex flex-col min-h-0">
          <div className="p-3 border-b border-[#1e1e1e]">
            <div className="text-[11px] uppercase tracking-wide text-[#666] mb-2">
              Export scope
            </div>
            <div className="flex flex-col gap-1">
              <ScopeOption
                active={scope === "page"}
                title="Entire webpage"
                subtitle={`${visible.length} layers → page + sections`}
                onClick={() => setScope("page")}
              />
              <ScopeOption
                active={scope === "element"}
                title="Selected element"
                subtitle="One reusable component"
                onClick={() => {
                  setScope("element");
                  if (!elementId && visible[0]) setElementId(visible[0].id);
                }}
              />
            </div>
          </div>

          <div className="px-3 pt-3 pb-1 text-[11px] uppercase tracking-wide text-[#666]">
            Layers
          </div>
          <div className="flex-1 overflow-auto framer-scrollbar px-2 pb-3">
            {visible.map((el) => {
              const active = scope === "element" && el.id === elementId;
              return (
                <button
                  key={el.id}
                  type="button"
                  onClick={() => selectElement(el.id)}
                  className={`w-full text-left px-2 py-1.5 rounded-md mb-0.5 transition-colors ${
                    active
                      ? "bg-[#2a2a2a] text-white"
                      : "text-[#aaa] hover:bg-[#1a1a1a] hover:text-white"
                  }`}
                >
                  <div className="text-[12.5px] truncate">{el.name}</div>
                  <div className="text-[11px] text-[#666] truncate">
                    {el.type} · {el.width}×{el.height}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 border-t border-[#1e1e1e] text-[11px] text-[#666] leading-relaxed space-y-1.5">
            <div className="text-[#888]">{meta.title}</div>
            <div>{meta.subtitle}</div>
            <div>Format: React + TypeScript (.tsx)</div>
            <div>Styles: typed inline objects</div>
            <div>Components: {meta.componentCount}</div>
          </div>
        </aside>

        <div className="flex-1 min-w-0 min-h-0 flex flex-col">
          <div className="sm:hidden flex border-b border-[#222]">
            <button
              type="button"
              className={`flex-1 h-9 text-[12px] ${
                view === "code" ? "text-white border-b border-white" : "text-[#777]"
              }`}
              onClick={() => setView("code")}
            >
              Code
            </button>
            <button
              type="button"
              className={`flex-1 h-9 text-[12px] ${
                view === "preview"
                  ? "text-white border-b border-white"
                  : "text-[#777]"
              }`}
              onClick={() => setView("preview")}
            >
              Preview
            </button>
          </div>

          {view === "preview" ? (
            <ExportPreview
              elements={elements}
              scope={scope}
              elementId={elementId}
            />
          ) : (
            <div className="flex-1 min-h-0 overflow-auto framer-scrollbar bg-[#0d0d0d]">
              <pre className="m-0 p-5 text-[12.5px] leading-relaxed text-[#d4d4d4] font-mono whitespace-pre">
                <code>{code}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ScopeOption({
  active,
  title,
  subtitle,
  onClick,
}: {
  active: boolean;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-2.5 py-2 rounded-md border transition-colors ${
        active
          ? "bg-[#2a2a2a] border-[#3a3a3a] text-white"
          : "bg-transparent border-transparent text-[#999] hover:bg-[#1a1a1a] hover:text-white"
      }`}
    >
      <div className="text-[12.5px] font-medium">{title}</div>
      <div className="text-[11px] text-[#666] mt-0.5">{subtitle}</div>
    </button>
  );
}
