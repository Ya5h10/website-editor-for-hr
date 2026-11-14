"use client";

import {
  CanvasElement,
  InsertKind,
  canHaveChildren,
  getChildElements,
  labelFor,
} from "./types";
import { IconPlus } from "./icons";

const CHILD_KINDS: InsertKind[] = [
  "frame",
  "stack",
  "text",
  "image",
  "button",
  "custom",
];

interface ChildrenPanelProps {
  element: CanvasElement;
  elements: CanvasElement[];
  onSelectChild: (id: string) => void;
  onAddChild: (kind: InsertKind) => void;
  onDetachChild?: (id: string) => void;
}

export default function ChildrenPanel({
  element,
  elements,
  onSelectChild,
  onAddChild,
  onDetachChild,
}: ChildrenPanelProps) {
  if (!canHaveChildren(element)) {
    return (
      <div className="px-3 py-3 border-b border-[#222]">
        <div className="text-[11px] uppercase tracking-wide text-[#666] mb-1">
          Children
        </div>
        <p className="text-[12px] text-[#555] leading-relaxed">
          This layer can&apos;t host children. Use a Frame, Stack, Hero, or Code
          component as a parent.
        </p>
      </div>
    );
  }

  const kids = getChildElements(elements, element.id);

  return (
    <div className="px-3 py-3 border-b border-[#222]">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[11px] uppercase tracking-wide text-[#666]">
          Children · {kids.length}
        </div>
      </div>

      {kids.length ? (
        <div className="space-y-1 mb-2">
          {kids.map((child) => (
            <div
              key={child.id}
              className="flex items-center gap-1 rounded-md bg-[#151515] border border-[#222] px-2 h-8"
            >
              <button
                type="button"
                className="flex-1 text-left text-[12.5px] text-white truncate"
                onClick={() => onSelectChild(child.id)}
              >
                {child.name}
                <span className="text-[#555] ml-1.5 capitalize">
                  {child.type}
                </span>
              </button>
              {onDetachChild ? (
                <button
                  type="button"
                  className="text-[10px] text-[#666] hover:text-white px-1"
                  title="Move to page root"
                  onClick={() => onDetachChild(child.id)}
                >
                  Detach
                </button>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[12px] text-[#555] mb-2 leading-relaxed">
          No children yet. Add nested layers that live inside this component.
        </p>
      )}

      <div className="text-[11px] text-[#666] mb-1.5">Add child</div>
      <div className="grid grid-cols-2 gap-1">
        {CHILD_KINDS.map((kind) => (
          <button
            key={kind}
            type="button"
            className="h-7 px-2 rounded-md border border-[#222] bg-[#1a1a1a] text-[11.5px] text-white/85 hover:bg-[#222] inline-flex items-center gap-1 truncate"
            onClick={() => onAddChild(kind)}
          >
            <IconPlus size={11} className="opacity-60 shrink-0" />
            {labelFor(kind)}
          </button>
        ))}
      </div>
    </div>
  );
}
