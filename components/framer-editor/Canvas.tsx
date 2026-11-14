"use client";

import { useRef, useState } from "react";
import FloatingToolbar from "./FloatingToolbar";
import { CanvasElement, InsertKind } from "./types";
import { IconDesktop, IconPlay, IconPlus } from "./icons";
import {
  buildTailwindClassName,
  twOverridesInline,
} from "./tailwindStyles";

interface CanvasProps {
  elements: CanvasElement[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onMove: (id: string, x: number, y: number) => void;
  onInsertAt: (kind: InsertKind, x: number, y: number) => void;
  zoom?: number;
}

export default function Canvas({
  elements,
  selectedId,
  onSelect,
  onMove,
  onInsertAt,
  zoom = 75,
}: CanvasProps) {
  const [tool, setTool] = useState<"select" | "hand" | "frame" | "component">(
    "select"
  );
  const [localZoom] = useState(zoom);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const onPointerDownElement = (
    e: React.PointerEvent,
    el: CanvasElement
  ) => {
    if (tool === "hand" || el.locked) return;
    e.stopPropagation();
    onSelect(el.id);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      id: el.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: el.x,
      origY: el.y,
    };
  };

  const onPointerMoveElement = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    const scale = localZoom / 100;
    const dx = (e.clientX - drag.startX) / scale;
    const dy = (e.clientY - drag.startY) / scale;
    onMove(drag.id, Math.round(drag.origX + dx), Math.round(drag.origY + dy));
  };

  const onPointerUpElement = () => {
    dragRef.current = null;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const kind = e.dataTransfer.getData(
      "application/x-framer-insert"
    ) as InsertKind;
    if (!kind || !frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const scale = localZoom / 100;
    const x = Math.round((e.clientX - rect.left) / scale - 40);
    const y = Math.round((e.clientY - rect.top) / scale - 40);
    onInsertAt(kind, Math.max(0, x), Math.max(0, y));
  };

  return (
    <div className="relative flex-1 min-w-0 h-full bg-[#121212] overflow-hidden">
      <div
        className={`absolute inset-0 overflow-auto framer-scrollbar framer-dot-grid ${
          tool === "hand" ? "cursor-grab active:cursor-grabbing" : ""
        }`}
        onClick={() => onSelect(null)}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
        }}
        onDrop={handleDrop}
      >
        <div
          className="min-w-full min-h-full flex justify-center py-12 px-10"
          style={{
            transform: `scale(${localZoom / 100})`,
            transformOrigin: "top center",
          }}
        >
          <div className="relative" style={{ width: 1200 }}>
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

            <div
              ref={frameRef}
              className="relative bg-black shadow-[0_25px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/10 overflow-hidden"
              style={{ width: 1200, height: 980 }}
              onClick={(e) => e.stopPropagation()}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.stopPropagation();
                handleDrop(e);
              }}
            >
              {elements
                .filter((el) => el.visible !== false)
                .map((el) => (
                  <CanvasNode
                    key={el.id}
                    el={el}
                    selected={selectedId === el.id}
                    onPointerDown={onPointerDownElement}
                    onPointerMove={onPointerMoveElement}
                    onPointerUp={onPointerUpElement}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      <FloatingToolbar tool={tool} zoom={localZoom} onToolChange={setTool} />
    </div>
  );
}

function CanvasNode({
  el,
  selected,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  el: CanvasElement;
  selected: boolean;
  onPointerDown: (e: React.PointerEvent, el: CanvasElement) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
}) {
  const twClass = buildTailwindClassName(el.tailwind, el.tailwindExtra);
  const skip = twOverridesInline(el.tailwind);

  return (
    <div
      className={`absolute ${selected ? "framer-selection z-20" : "z-10"} ${
        el.locked ? "cursor-default" : "cursor-move"
      } ${twClass}`}
      style={{
        left: el.x,
        top: el.y,
        width: el.width,
        height: el.height,
        opacity: skip.skipOpacity ? undefined : el.style.opacity / 100,
        borderRadius: skip.skipRadius ? undefined : el.style.radius,
        background: skip.skipFill
          ? undefined
          : el.style.fill === "transparent"
          ? "transparent"
          : el.style.fill,
        color: skip.skipColor ? undefined : el.style.color,
        fontSize: skip.skipFontSize ? undefined : el.style.fontSize,
        fontWeight: skip.skipFontWeight ? undefined : el.style.fontWeight,
        padding: skip.skipPadding ? undefined : el.style.padding,
        userSelect: "none",
        touchAction: "none",
      }}
      onPointerDown={(e) => onPointerDown(e, el)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {selected && (
        <>
          <Handle className="-top-1 -left-1" />
          <Handle className="-top-1 -right-1" />
          <Handle className="-bottom-1 -left-1" />
          <Handle className="-bottom-1 -right-1" />
          <Handle className="-top-1 left-1/2 -translate-x-1/2" />
          <Handle className="-bottom-1 left-1/2 -translate-x-1/2" />
          <Handle className="top-1/2 -left-1 -translate-y-1/2" />
          <Handle className="top-1/2 -right-1 -translate-y-1/2" />
        </>
      )}
      <ElementBody el={el} />
    </div>
  );
}

function Handle({ className }: { className: string }) {
  return (
    <span
      className={`absolute w-[7px] h-[7px] bg-white border border-[#0099ff] rounded-[1px] z-10 shadow-[0_0_0_1px_rgba(0,153,255,0.35)] ${className}`}
    />
  );
}

function ElementBody({ el }: { el: CanvasElement }) {
  if (el.type === "button") {
    return (
      <div className="w-full h-full flex items-center justify-center rounded-[inherit]">
        {el.props.label || "Button"}
      </div>
    );
  }

  if (el.type === "image") {
    return (
      <div className="w-full h-full rounded-[inherit] overflow-hidden relative bg-gradient-to-br from-zinc-800 to-zinc-900">
        {el.props.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={el.props.imageUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,white,transparent_45%)]" />
        )}
        <div className="absolute bottom-3 left-3 text-[12px] text-white/70">
          {el.props.label || "Image"}
        </div>
      </div>
    );
  }

  if (el.id === "ticker" || (el.type === "stack" && el.name === "Hero Media")) {
    return (
      <div className="flex gap-3 h-full overflow-hidden">
        {["Studio", "Product", "Brand", "Motion", "Web"].map((label, i) => (
          <div
            key={label}
            className="shrink-0 w-[200px] h-full rounded-xl relative"
            style={{
              background: [
                "linear-gradient(145deg,#1a1a1a,#3a3a3a)",
                "linear-gradient(145deg,#111827,#1f2937)",
                "linear-gradient(145deg,#1c1917,#44403c)",
                "linear-gradient(145deg,#0f172a,#334155)",
                "linear-gradient(145deg,#18181b,#3f3f46)",
              ][i],
            }}
          >
            <div className="absolute bottom-3 left-3 text-[12px] text-white/80">
              {label}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (el.type === "features") {
    return (
      <div className="grid grid-cols-3 gap-6 w-full h-full border-t border-white/10 pt-6">
        {(el.props.features || []).map((f) => (
          <div key={f.title}>
            <div className="text-[15px] font-medium mb-1" style={{ color: "#fff" }}>
              {f.title}
            </div>
            <p className="text-[13px] leading-relaxed text-white/55">
              {f.description}
            </p>
          </div>
        ))}
      </div>
    );
  }

  if (el.type === "values_grid") {
    return (
      <div className="w-full h-full">
        <div className="text-[15px] font-medium mb-3 text-white">
          {el.props.heading}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {(el.props.items || []).map((item) => (
            <div key={item.title}>
              <div className="text-[13px] font-medium text-white">{item.title}</div>
              <p className="text-[12px] text-white/55 mt-1">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (el.type === "feature_split") {
    const imageLeft = el.props.layout !== "image_right";
    const media = (
      <div className="h-full min-h-[120px] rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/10" />
    );
    const copy = (
      <div className="flex flex-col justify-center">
        <div className="text-[20px] font-semibold text-white mb-2">
          {el.props.heading}
        </div>
        <p className="text-[13px] text-white/60 leading-relaxed">
          {el.props.content}
        </p>
      </div>
    );
    return (
      <div className="grid grid-cols-2 gap-6 w-full h-full">
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
      </div>
    );
  }

  if (el.type === "hero") {
    return (
      <div className="w-full h-full flex flex-col justify-center">
        <div
          className="leading-[1.05] tracking-[-0.03em] font-semibold"
          style={{ fontSize: el.style.fontSize, color: el.style.color }}
        >
          {el.props.heading}
        </div>
        <p className="mt-4 text-[15px] text-white/60 max-w-[560px]">
          {el.props.subheading}
        </p>
      </div>
    );
  }

  if (el.id === "nav") {
    return (
      <div className="w-full h-full flex items-center justify-between px-10 border-b border-white/10">
        <div className="text-[15px] font-semibold tracking-[0.2em]">HAUS</div>
        <div className="flex items-center gap-8 text-[13px] text-white/70">
          <span>Work</span>
          <span>Services</span>
          <span>About</span>
          <span className="text-white">Get in Touch</span>
        </div>
      </div>
    );
  }

  // text / frame / stack default
  return (
    <div
      className="w-full h-full leading-[1.15] tracking-[-0.02em]"
      style={{ whiteSpace: "pre-wrap" }}
    >
      {el.props.text || el.props.heading || el.name}
    </div>
  );
}
