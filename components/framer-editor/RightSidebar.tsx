"use client";

import { useState } from "react";
import AgentPanel from "./AgentPanel";
import StylePanel from "./StylePanel";

type RightTab = "agent" | "style";

interface RightSidebarProps {
  selectedLabel?: string;
  defaultTab?: RightTab;
}

export default function RightSidebar({
  selectedLabel,
  defaultTab = "agent",
}: RightSidebarProps) {
  const [tab, setTab] = useState<RightTab>(defaultTab);

  return (
    <aside
      className="flex flex-col border-l border-[#222] bg-[#111] shrink-0 h-full"
      style={{ width: "var(--framer-right-w)" }}
    >
      <div className="flex items-center gap-0.5 px-2 pt-2 pb-1 border-b border-[#222] relative z-10">
        {(["agent", "style"] as RightTab[]).map((t) => (
          <button
            key={t}
            type="button"
            data-tab={t}
            aria-pressed={tab === t}
            className={`px-2.5 py-1 text-[12.5px] font-medium rounded-[6px] capitalize transition-colors ${
              tab === t
                ? "bg-[#2a2a2a] text-white"
                : "text-[#888] hover:text-white/80"
            }`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex-1 min-h-0">
        {tab === "agent" ? (
          <AgentPanel />
        ) : (
          <StylePanel selectedLabel={selectedLabel} />
        )}
      </div>
    </aside>
  );
}
