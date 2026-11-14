"use client";

import { IconCursor, IconHand, IconFrame, IconChevronDown, IconComponent } from "./icons";

interface FloatingToolbarProps {
  tool?: "select" | "hand" | "frame" | "component";
  zoom?: number;
  onToolChange?: (tool: "select" | "hand" | "frame" | "component") => void;
  onZoomChange?: (zoom: number) => void;
}

export default function FloatingToolbar({
  tool = "select",
  zoom = 100,
  onToolChange,
}: FloatingToolbarProps) {
  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
      <div className="flex items-center gap-0.5 h-9 px-1 rounded-full bg-black/80 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <ToolButton
          active={tool === "select"}
          onClick={() => onToolChange?.("select")}
          title="Select (V)"
        >
          <IconCursor size={14} />
        </ToolButton>
        <ToolButton
          active={tool === "hand"}
          onClick={() => onToolChange?.("hand")}
          title="Hand (H)"
        >
          <IconHand size={14} />
        </ToolButton>
        <ToolButton
          active={tool === "frame"}
          onClick={() => onToolChange?.("frame")}
          title="Frame (F)"
        >
          <IconFrame size={14} />
        </ToolButton>
        <ToolButton
          active={tool === "component"}
          onClick={() => onToolChange?.("component")}
          title="Component"
        >
          <IconComponent size={14} />
        </ToolButton>

        <div className="w-px h-5 bg-[#333] mx-1" />

        <button
          type="button"
          className="flex items-center gap-1 h-8 px-2.5 rounded-full text-[12px] text-white/80 hover:bg-white/5"
        >
          {zoom}%
          <IconChevronDown size={12} className="opacity-50" />
        </button>
      </div>
    </div>
  );
}

function ToolButton({
  children,
  active,
  onClick,
  title,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`w-8 h-8 rounded-full inline-flex items-center justify-center transition-colors ${
        active
          ? "bg-white/15 text-white"
          : "text-white/65 hover:bg-white/5 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
