"use client";

import { InsertKind, labelFor } from "./types";
import {
  IconFrame,
  IconText,
  IconImage,
  IconShape,
  IconComponent,
  IconLayers,
} from "./icons";

const GROUPS: { title: string; items: InsertKind[] }[] = [
  { title: "Layout", items: ["frame", "stack"] },
  { title: "Content", items: ["text", "image", "button"] },
  {
    title: "Orbit blocks",
    items: ["hero", "feature_split", "values_grid", "features"],
  },
  { title: "Code", items: ["custom"] },
];

interface InsertMenuProps {
  open: boolean;
  onClose: () => void;
  onInsert: (kind: InsertKind) => void;
  onDragStartInsert?: (kind: InsertKind) => void;
}

export default function InsertMenu({
  open,
  onClose,
  onInsert,
  onDragStartInsert,
}: InsertMenuProps) {
  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 cursor-default"
        aria-label="Close insert menu"
        onClick={onClose}
      />
      <div className="absolute left-0 top-full mt-1.5 z-50 w-[280px] rounded-xl border border-[#2a2a2a] bg-[#141414] shadow-[0_20px_60px_rgba(0,0,0,0.55)] overflow-hidden">
        <div className="px-3 py-2.5 border-b border-[#222] text-[11px] uppercase tracking-wide text-[#666]">
          Insert
        </div>
        <div className="max-h-[420px] overflow-y-auto framer-scrollbar p-1.5">
          {GROUPS.map((group) => (
            <div key={group.title} className="mb-2">
              <div className="px-2 py-1 text-[11px] text-[#555] uppercase tracking-wide">
                {group.title}
              </div>
              {group.items.map((kind) => (
                <button
                  key={kind}
                  type="button"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("application/x-framer-insert", kind);
                    e.dataTransfer.effectAllowed = "copy";
                    onDragStartInsert?.(kind);
                  }}
                  onClick={() => {
                    onInsert(kind);
                    onClose();
                  }}
                  className="w-full flex items-center gap-2.5 h-9 px-2 rounded-lg text-left text-[13px] text-white/85 hover:bg-[#222]"
                >
                  <span className="w-7 h-7 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] inline-flex items-center justify-center text-[#aaa]">
                    <KindIcon kind={kind} />
                  </span>
                  <span className="flex-1">{labelFor(kind)}</span>
                  <span className="text-[11px] text-[#555]">Drag or click</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function KindIcon({ kind }: { kind: InsertKind }) {
  switch (kind) {
    case "frame":
    case "stack":
      return <IconFrame size={14} />;
    case "text":
    case "hero":
      return <IconText size={14} />;
    case "image":
      return <IconImage size={14} />;
    case "button":
      return <IconShape size={14} />;
    case "feature_split":
    case "values_grid":
    case "features":
      return <IconLayers size={14} />;
    case "custom":
      return <IconComponent size={14} />;
    default:
      return <IconComponent size={14} />;
  }
}
