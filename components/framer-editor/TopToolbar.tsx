"use client";

import { useRef, useState } from "react";
import InsertMenu from "./InsertMenu";
import { EditorMode, InsertKind } from "./types";
import {
  FramerLogo,
  IconPlus,
  IconUndo,
  IconRedo,
  IconFrame,
  IconText,
  IconImage,
  IconShape,
  IconPlay,
  IconChevronDown,
  IconBranch,
  IconLayers,
} from "./icons";

interface TopToolbarProps {
  projectName?: string;
  branchName?: string;
  mode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
  onPreview?: () => void;
  onPublish?: () => void;
  publishLabel?: string;
  publishDisabled?: boolean;
  onInsert: (kind: InsertKind) => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

export default function TopToolbar({
  projectName = "Site",
  branchName = "main",
  mode,
  onModeChange,
  onPreview,
  onPublish,
  publishLabel = "Publish",
  publishDisabled = false,
  onInsert,
  onUndo,
  onRedo,
}: TopToolbarProps) {
  const [insertOpen, setInsertOpen] = useState(false);
  const [modeMenuOpen, setModeMenuOpen] = useState(false);
  const insertAnchor = useRef<HTMLDivElement>(null);

  return (
    <header
      className="relative z-40 flex items-center justify-between px-2.5 border-b border-[#1c1c1c] bg-black shrink-0"
      style={{ height: "var(--framer-toolbar-h)" }}
    >
      <div className="flex items-center gap-1 min-w-0">
        <button className="framer-icon-btn mr-0.5" aria-label="Framer">
          <FramerLogo size={16} />
        </button>

        <div className="relative">
          <button
            className="framer-btn-ghost h-8 px-2 gap-1"
            type="button"
            onClick={() => setModeMenuOpen((v) => !v)}
          >
            <span>
              {mode === "cms" ? "CMS" : mode === "code" ? "Code" : "Canvas"}
            </span>
            <IconChevronDown size={14} className="opacity-60" />
          </button>
          {modeMenuOpen && (
            <>
              <button
                type="button"
                className="fixed inset-0 z-40"
                aria-label="Close mode menu"
                onClick={() => setModeMenuOpen(false)}
              />
              <div className="absolute left-0 top-full mt-1 z-50 w-44 rounded-lg border border-[#2a2a2a] bg-[#141414] p-1 shadow-xl">
                <button
                  type="button"
                  className="w-full text-left h-8 px-2 rounded-md text-[13px] hover:bg-[#222]"
                  onClick={() => {
                    onModeChange("canvas");
                    setModeMenuOpen(false);
                  }}
                >
                  Canvas
                </button>
                <button
                  type="button"
                  className="w-full text-left h-8 px-2 rounded-md text-[13px] hover:bg-[#222]"
                  onClick={() => {
                    onModeChange("cms");
                    setModeMenuOpen(false);
                  }}
                >
                  CMS
                </button>
                <button
                  type="button"
                  className="w-full text-left h-8 px-2 rounded-md text-[13px] hover:bg-[#222]"
                  onClick={() => {
                    onModeChange("code");
                    setModeMenuOpen(false);
                  }}
                >
                  Code (React)
                </button>
              </div>
            </>
          )}
        </div>

        <div className="w-px h-4 bg-[#2a2a2a] mx-1" />

        <div
          className="relative flex items-center gap-0.5 rounded-[8px] bg-[#141414] border border-[#222] p-0.5"
          ref={insertAnchor}
        >
          <button
            className={`framer-icon-btn ${insertOpen ? "active" : ""}`}
            title="Insert"
            type="button"
            onClick={() => setInsertOpen((v) => !v)}
          >
            <IconPlus size={15} />
          </button>
          <InsertMenu
            open={insertOpen}
            onClose={() => setInsertOpen(false)}
            onInsert={onInsert}
          />
          <button className="framer-icon-btn" title="Undo" type="button" onClick={onUndo}>
            <IconUndo size={14} />
          </button>
          <button className="framer-icon-btn" title="Redo" type="button" onClick={onRedo}>
            <IconRedo size={14} />
          </button>
          <button
            className="framer-icon-btn"
            title="Frame"
            type="button"
            onClick={() => onInsert("frame")}
          >
            <IconFrame size={14} />
          </button>
          <button
            className="framer-icon-btn"
            title="Text"
            type="button"
            onClick={() => onInsert("text")}
          >
            <IconText size={14} />
          </button>
          <button
            className="framer-icon-btn"
            title="Image"
            type="button"
            onClick={() => onInsert("image")}
          >
            <IconImage size={14} />
          </button>
          <button
            className="framer-icon-btn"
            title="Shape"
            type="button"
            onClick={() => onInsert("button")}
          >
            <IconShape size={14} />
          </button>
          <button
            className={`framer-icon-btn ${mode === "cms" ? "active" : ""}`}
            title="CMS"
            type="button"
            onClick={() => onModeChange(mode === "cms" ? "canvas" : "cms")}
          >
            <IconLayers size={14} />
          </button>
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-[13px] text-white/90 pointer-events-none">
        <span className="font-medium">{projectName}</span>
        <span className="text-[#555]">•</span>
        <span className="inline-flex items-center gap-1 text-[#aaa]">
          <IconBranch size={13} />
          {branchName}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center -space-x-1.5 mr-1">
          <Avatar color="#ff6b4a" initials="AK" />
          <Avatar color="#7c5cff" initials="JM" />
          <Avatar color="#22c55e" initials="SR" />
          <div className="w-6 h-6 rounded-full bg-[#2a2a2a] border-2 border-black flex items-center justify-center text-[10px] text-[#aaa] font-medium">
            12
          </div>
        </div>

        <button
          className="framer-icon-btn"
          title="Preview"
          onClick={onPreview}
          type="button"
        >
          <IconPlay size={13} />
        </button>

        <button className="framer-btn-outline h-7 px-2.5" type="button">
          Invite
        </button>

        <button
          className="framer-btn-outline h-7 px-2.5"
          type="button"
          title="Export React JSX from the canvas"
          onClick={() => onModeChange("code")}
        >
          Export React
        </button>

        <button
          className="framer-btn-primary h-7 px-3 font-semibold disabled:opacity-50"
          type="button"
          onClick={onPublish}
          disabled={publishDisabled}
        >
          {publishLabel}
        </button>
      </div>
    </header>
  );
}

function Avatar({ color, initials }: { color: string; initials: string }) {
  return (
    <div
      className="w-6 h-6 rounded-full border-2 border-black flex items-center justify-center text-[9px] font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}
