"use client";

import { useState } from "react";
import {
  IconPlus,
  IconChevronDown,
  IconCheck,
  IconSparkle,
  IconSend,
} from "./icons";

type AgentPhase = "empty" | "thinking" | "done";

interface Activity {
  id: string;
  kind: "plan" | "thought" | "progress" | "done";
  title: string;
  detail?: string;
  time?: string;
  progress?: number;
}

export default function AgentPanel() {
  const [followUp, setFollowUp] = useState("");
  const [phase, setPhase] = useState<AgentPhase>("empty");
  const [prompt, setPrompt] = useState("");
  const [activity, setActivity] = useState<Activity[]>([]);

  const submit = (text: string) => {
    const value = text.trim();
    if (!value) return;
    setPrompt(value);
    setFollowUp("");
    setPhase("thinking");
    setActivity([
      {
        id: "1",
        kind: "plan",
        title: "Created a design plan",
        time: "2s",
      },
      {
        id: "2",
        kind: "thought",
        title: "Thought",
        detail: `I'll apply “${value.slice(0, 80)}${
          value.length > 80 ? "…" : ""
        }” on the selected layers and keep the layout editable.`,
        time: "3s",
      },
      {
        id: "3",
        kind: "progress",
        title: "Updating canvas…",
        time: "5s",
        progress: 62,
      },
    ]);

    window.setTimeout(() => {
      setActivity((prev) => [
        ...prev.filter((a) => a.kind !== "progress"),
        {
          id: "4",
          kind: "done",
          title: "Added layers and refined copy",
          time: "8.4s",
          detail:
            "Done. Staged changes are ready on the canvas. Review Style or Undo if needed.",
        },
      ]);
      setPhase("done");
    }, 1600);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1.5 px-3 pt-3 pb-2">
        <button
          type="button"
          className="flex-1 flex items-center justify-between h-9 px-3 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] text-[13px] text-white hover:bg-[#222]"
        >
          <span className="truncate">
            {phase === "empty" ? "Ask the agent…" : "Rebuild Page Layout"}
          </span>
          <IconChevronDown size={14} className="opacity-50 shrink-0" />
        </button>
        <button type="button" className="framer-icon-btn border border-[#2a2a2a]">
          <IconPlus size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto framer-scrollbar px-3 space-y-3 pb-3">
        {phase === "empty" && (
          <div className="rounded-xl border border-dashed border-[#2a2a2a] bg-[#121212] px-4 py-8 text-center">
            <div className="inline-flex w-9 h-9 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] items-center justify-center text-[#0099ff] mb-3">
              <IconSparkle size={16} />
            </div>
            <div className="text-[13px] text-white/90 mb-1">
              Start with the agent
            </div>
            <p className="text-[12.5px] text-[#777] leading-relaxed">
              Describe a layout change, section, or CMS update. Every result
              stays editable on the canvas.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
              {[
                "Add a hero ticker",
                "Tighten typography",
                "Create a careers section",
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  className="h-7 px-2.5 rounded-full border border-[#2a2a2a] text-[11.5px] text-[#aaa] hover:text-white hover:border-[#444]"
                  onClick={() => submit(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {phase !== "empty" && (
          <>
            <div className="rounded-lg border border-[#2a3a4a] bg-[#121820] p-3 text-[13px] leading-relaxed text-white/90">
              {prompt}
            </div>

            {activity.map((item) => {
              if (item.kind === "thought") {
                return (
                  <div
                    key={item.id}
                    className="rounded-lg bg-[#1a1a1a] border border-[#222] p-3"
                  >
                    <div className="flex items-center gap-2 text-[12px] text-[#aaa] mb-2">
                      <span className="text-base leading-none">💭</span>
                      <span>{item.title}</span>
                      <span className="ml-auto text-[#555]">{item.time}</span>
                    </div>
                    <p className="text-[12.5px] text-[#bbb] leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                );
              }
              if (item.kind === "progress") {
                return (
                  <div
                    key={item.id}
                    className="rounded-lg bg-[#1a1a1a] border border-[#222] p-3"
                  >
                    <div className="flex items-center justify-between text-[12.5px] text-white/85 mb-2">
                      <span>{item.title}</span>
                      <span className="text-[#555]">{item.time}</span>
                    </div>
                    <div className="h-1 rounded-full bg-[#2a2a2a] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#0099ff] transition-all"
                        style={{ width: `${item.progress || 40}%` }}
                      />
                    </div>
                  </div>
                );
              }
              if (item.kind === "done") {
                return (
                  <div key={item.id} className="space-y-2">
                    <div className="flex items-center gap-2 text-[12.5px]">
                      <IconCheck size={13} className="text-[#22c55e]" />
                      <span className="text-white/85 flex-1 truncate">
                        {item.title}
                      </span>
                      <span className="text-[#555]">{item.time}</span>
                    </div>
                    <div className="rounded-lg border border-[#1e3a2a] bg-[#101810] p-3 text-[12.5px] text-[#9ae6b4] leading-relaxed">
                      {item.detail}
                    </div>
                  </div>
                );
              }
              return (
                <div key={item.id} className="flex items-center gap-2 text-[12.5px]">
                  <IconSparkle size={13} className="text-[#0099ff]" />
                  <span className="text-white/85 flex-1 truncate">
                    {item.title}
                  </span>
                  <span className="text-[#555]">{item.time}</span>
                </div>
              );
            })}

            {phase === "done" && (
              <div className="flex items-center justify-between text-[12px] text-[#666] pt-1">
                <span>Changes · Home — staged</span>
                <button
                  type="button"
                  className="text-[#aaa] hover:text-white"
                  onClick={() => {
                    setPhase("empty");
                    setPrompt("");
                    setActivity([]);
                  }}
                >
                  Undo
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="border-t border-[#222] p-3 space-y-2">
        <div className="relative">
          <input
            className="framer-input h-8 pr-9"
            placeholder={
              phase === "empty" ? "Describe what to build…" : "Add follow-up…"
            }
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit(followUp);
            }}
          />
          <button
            type="button"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 framer-icon-btn w-7 h-7 text-[#0099ff]"
            onClick={() => submit(followUp)}
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
