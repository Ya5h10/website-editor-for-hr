"use client";

import { useEffect, useMemo, useState } from "react";
import { CanvasElement } from "./types";
import {
  generateReactCode,
  generateReactFilename,
} from "./generateReactCode";
import { IconCheck, IconChevronDown } from "./icons";

interface CodeExportPanelProps {
  elements: CanvasElement[];
  pageName?: string;
  onBackToCanvas: () => void;
}

export default function CodeExportPanel({
  elements,
  pageName = "Home",
  onBackToCanvas,
}: CodeExportPanelProps) {
  const filename = useMemo(() => generateReactFilename(pageName), [pageName]);
  const code = useMemo(
    () =>
      generateReactCode(elements, {
        pageName,
        componentName: `${pageName}Page`,
      }),
    [elements, pageName]
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [code]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Fallback for older environments
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  };

  const download = () => {
    const blob = new Blob([code], { type: "text/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-1 min-h-0 bg-[#0a0a0a] flex-col">
      <div className="h-11 px-3 border-b border-[#222] flex items-center justify-between bg-[#0f0f0f] shrink-0">
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
            {filename}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="framer-btn-outline h-7 px-2.5"
            onClick={download}
          >
            Download .jsx
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
        <aside className="w-[220px] shrink-0 border-r border-[#222] bg-[#111] p-3 hidden md:block">
          <div className="text-[11px] uppercase tracking-wide text-[#666] mb-2">
            Output
          </div>
          <button
            type="button"
            className="w-full flex items-center justify-between h-8 px-2 rounded-md bg-[#2a2a2a] text-[12.5px] text-white"
          >
            React JSX
            <IconChevronDown size={12} className="opacity-50" />
          </button>
          <p className="mt-3 text-[12px] text-[#777] leading-relaxed">
            Generated from {elements.filter((e) => e.visible !== false).length}{" "}
            canvas layers. Layout uses absolute positioning to match the
            Desktop 1200 artboard.
          </p>
          <div className="mt-4 text-[11px] text-[#555] space-y-1">
            <div>Framework: React</div>
            <div>Extension: .jsx</div>
            <div>Styles: inline</div>
          </div>
        </aside>

        <div className="flex-1 min-w-0 overflow-auto framer-scrollbar bg-[#0d0d0d]">
          <pre className="m-0 p-5 text-[12.5px] leading-relaxed text-[#d4d4d4] font-mono whitespace-pre">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
