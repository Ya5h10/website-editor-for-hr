"use client";

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
} from "./icons";

interface TopToolbarProps {
  projectName?: string;
  branchName?: string;
  onPreview?: () => void;
  onPublish?: () => void;
  publishLabel?: string;
  publishDisabled?: boolean;
}

export default function TopToolbar({
  projectName = "Site",
  branchName = "main",
  onPreview,
  onPublish,
  publishLabel = "Publish",
  publishDisabled = false,
}: TopToolbarProps) {
  return (
    <header
      className="relative z-40 flex items-center justify-between px-2.5 border-b border-[#1c1c1c] bg-black shrink-0"
      style={{ height: "var(--framer-toolbar-h)" }}
    >
      {/* Left: logo + tools */}
      <div className="flex items-center gap-1 min-w-0">
        <button className="framer-icon-btn mr-0.5" aria-label="Framer">
          <FramerLogo size={16} />
        </button>

        <button className="framer-btn-ghost h-8 px-2 gap-1">
          <span>Canvas</span>
          <IconChevronDown size={14} className="opacity-60" />
        </button>

        <div className="w-px h-4 bg-[#2a2a2a] mx-1" />

        <div className="flex items-center gap-0.5 rounded-[8px] bg-[#141414] border border-[#222] p-0.5">
          <button className="framer-icon-btn" title="Insert">
            <IconPlus size={15} />
          </button>
          <button className="framer-icon-btn" title="Undo">
            <IconUndo size={14} />
          </button>
          <button className="framer-icon-btn" title="Redo">
            <IconRedo size={14} />
          </button>
          <button className="framer-icon-btn" title="Frame">
            <IconFrame size={14} />
          </button>
          <button className="framer-icon-btn" title="Text">
            <IconText size={14} />
          </button>
          <button className="framer-icon-btn" title="Image">
            <IconImage size={14} />
          </button>
          <button className="framer-icon-btn" title="Shape">
            <IconShape size={14} />
          </button>
        </div>
      </div>

      {/* Center: project / branch */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-[13px] text-white/90 pointer-events-none">
        <span className="font-medium">{projectName}</span>
        <span className="text-[#555]">•</span>
        <span className="inline-flex items-center gap-1 text-[#aaa]">
          <IconBranch size={13} />
          {branchName}
        </span>
      </div>

      {/* Right: collab + actions */}
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
