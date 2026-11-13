"use client";

import { useState } from "react";
import FloatingToolbar from "./FloatingToolbar";
import CanvasContent from "./CanvasContent";
import { IconDesktop, IconPlay, IconPlus } from "./icons";

interface CanvasProps {
  selectedId?: string;
  onSelect?: (id: string) => void;
  zoom?: number;
}

export default function Canvas({
  selectedId = "headline",
  onSelect,
  zoom = 75,
}: CanvasProps) {
  const [tool, setTool] = useState<"select" | "hand" | "frame" | "component">(
    "select"
  );
  const [localZoom] = useState(zoom);

  return (
    <div className="relative flex-1 min-w-0 h-full bg-[#121212] overflow-hidden">
      <div
        className={`absolute inset-0 overflow-auto framer-scrollbar framer-dot-grid ${
          tool === "hand" ? "cursor-grab active:cursor-grabbing" : ""
        }`}
        onClick={() => onSelect?.("")}
      >
        <div
          className="min-w-full min-h-full flex justify-center py-12 px-10"
          style={{
            transform: `scale(${localZoom / 100})`,
            transformOrigin: "top center",
          }}
        >
          <div className="relative" style={{ width: 1200 }}>
            {/* Breakpoint label */}
            <div className="absolute -top-9 left-0 flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-md bg-[#0099ff] text-white text-[11px] font-medium shadow-[0_0_0_1px_rgba(0,153,255,0.35)]">
                <IconDesktop size={12} />
                Desktop 1200
                <button
                  type="button"
                  className="ml-0.5 opacity-80 hover:opacity-100"
                  onClick={(e) => e.stopPropagation()}
                  title="Preview breakpoint"
                >
                  <IconPlay size={10} />
                </button>
              </div>
              <button
                type="button"
                className="w-6 h-6 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] hover:text-white inline-flex items-center justify-center"
                title="Add breakpoint"
                onClick={(e) => e.stopPropagation()}
              >
                <IconPlus size={12} />
              </button>
            </div>

            {/* Device frame */}
            <div
              className="bg-black shadow-[0_25px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <CanvasContent selectedId={selectedId} onSelect={onSelect} />
            </div>
          </div>
        </div>
      </div>

      <FloatingToolbar tool={tool} zoom={localZoom} onToolChange={setTool} />
    </div>
  );
}
