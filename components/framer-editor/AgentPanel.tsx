"use client";

import { useState } from "react";
import {
  IconPlus,
  IconChevronDown,
  IconCheck,
  IconSparkle,
  IconSend,
} from "./icons";

export default function AgentPanel() {
  const [followUp, setFollowUp] = useState("");

  return (
    <div className="flex flex-col h-full">
      {/* Action row */}
      <div className="flex items-center gap-1.5 px-3 pt-3 pb-2">
        <button
          type="button"
          className="flex-1 flex items-center justify-between h-9 px-3 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] text-[13px] text-white hover:bg-[#222]"
        >
          <span className="truncate">Rebuild Page Layout</span>
          <IconChevronDown size={14} className="opacity-50 shrink-0" />
        </button>
        <button type="button" className="framer-icon-btn border border-[#2a2a2a]">
          <IconPlus size={14} />
        </button>
      </div>

      {/* Prompt card */}
      <div className="px-3 pb-3">
        <div className="rounded-lg border border-[#2a3a4a] bg-[#121820] p-3 text-[13px] leading-relaxed text-white/90">
          Add a 3D image ticker to the hero section and write a short
          introduction about Haus studio.
        </div>
      </div>

      {/* Activity feed */}
      <div className="flex-1 overflow-y-auto framer-scrollbar px-3 space-y-3 pb-3">
        <ActivityItem
          icon={<IconSparkle size={13} className="text-[#0099ff]" />}
          title="Created a design plan"
          time="6s"
        />

        <div className="rounded-lg bg-[#1a1a1a] border border-[#222] p-3">
          <div className="flex items-center gap-2 text-[12px] text-[#aaa] mb-2">
            <span className="text-base leading-none">💭</span>
            <span>Thought</span>
            <span className="ml-auto text-[#555]">4s</span>
          </div>
          <p className="text-[12.5px] text-[#bbb] leading-relaxed">
            I&apos;ll now build the page structure from the plan and place a
            hero ticker with studio copy under the navigation.
          </p>
        </div>

        <ActivityItem
          icon={<IconCheck size={13} className="text-[#22c55e]" />}
          title="Analyzed hero section"
          time="3s"
        />

        <div className="rounded-lg bg-[#1a1a1a] border border-[#222] p-3">
          <div className="flex items-center justify-between text-[12.5px] text-white/85 mb-2">
            <span>Adding Images…</span>
            <span className="text-[#555]">12s</span>
          </div>
          <div className="h-1 rounded-full bg-[#2a2a2a] overflow-hidden">
            <div className="h-full w-[72%] rounded-full bg-[#0099ff]" />
          </div>
        </div>

        <ActivityItem
          icon={<IconCheck size={13} className="text-[#22c55e]" />}
          title="Added 9 layers, edited 1"
          time="16.4s"
        />

        <div className="rounded-lg border border-[#1e3a2a] bg-[#101810] p-3 text-[12.5px] text-[#9ae6b4] leading-relaxed">
          Done. I replaced the selected text block and added a hero image
          ticker with studio introduction.
        </div>

        <div className="flex items-center justify-between text-[12px] text-[#666] pt-1">
          <span>Changes · Home — 17 Layers</span>
          <button type="button" className="text-[#aaa] hover:text-white">
            Undo
          </button>
        </div>
      </div>

      {/* Follow-up */}
      <div className="border-t border-[#222] p-3 space-y-2">
        <div className="relative">
          <input
            className="framer-input h-8 pr-9"
            placeholder="Add follow-up…"
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 framer-icon-btn w-7 h-7 text-[#0099ff]"
          >
            <IconSend size={14} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="inline-flex items-center gap-1 text-[12px] text-[#888] hover:text-white"
          >
            GPT 6.1 Sol
            <IconChevronDown size={12} />
          </button>
          <div className="flex items-center gap-0.5">
            <button type="button" className="framer-icon-btn w-7 h-7">
              <IconSparkle size={13} />
            </button>
            <button type="button" className="framer-icon-btn w-7 h-7">
              <IconPlus size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({
  icon,
  title,
  time,
}: {
  icon: React.ReactNode;
  title: string;
  time: string;
}) {
  return (
    <div className="flex items-center gap-2 text-[12.5px]">
      <span className="shrink-0">{icon}</span>
      <span className="text-white/85 flex-1 truncate">{title}</span>
      <span className="text-[#555] shrink-0">{time}</span>
    </div>
  );
}
