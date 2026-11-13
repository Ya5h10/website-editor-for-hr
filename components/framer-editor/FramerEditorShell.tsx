"use client";

import { useMemo, useState } from "react";
import TopToolbar from "./TopToolbar";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import Canvas from "./Canvas";

const LAYER_LABELS: Record<string, string> = {
  headline: "Headline",
  subcopy: "Subcopy",
  cta: "CTA Stack",
  nav: "Navigation",
  ticker: "Hero Media",
  features: "Features",
  "6": "Headline",
  "7": "Subcopy",
  "8": "CTA Stack",
  "2": "Navigation",
  "9": "Hero Media",
  "10": "Features",
};

interface FramerEditorShellProps {
  projectName?: string;
  branchName?: string;
  onPreview?: () => void;
  onPublish?: () => void;
  publishLabel?: string;
  publishDisabled?: boolean;
}

export default function FramerEditorShell({
  projectName = "Site",
  branchName = "main",
  onPreview,
  onPublish,
  publishLabel,
  publishDisabled,
}: FramerEditorShellProps) {
  const [selectedPageId, setSelectedPageId] = useState("home");
  const [selectedId, setSelectedId] = useState("headline");

  const selectedLabel = useMemo(
    () => LAYER_LABELS[selectedId] || "Headline",
    [selectedId]
  );

  return (
    <div className="framer-editor fixed inset-0 flex flex-col overflow-hidden">
      <TopToolbar
        projectName={projectName}
        branchName={branchName}
        onPreview={onPreview}
        onPublish={onPublish}
        publishLabel={publishLabel}
        publishDisabled={publishDisabled}
      />

      <div className="flex flex-1 min-h-0">
        <LeftSidebar
          selectedPageId={selectedPageId}
          onSelectPage={setSelectedPageId}
          selectedLayerId={
            selectedId === "headline"
              ? "6"
              : selectedId === "subcopy"
              ? "7"
              : selectedId === "cta"
              ? "8"
              : selectedId === "nav"
              ? "2"
              : selectedId === "ticker"
              ? "9"
              : selectedId === "features"
              ? "10"
              : "6"
          }
          onSelectLayer={(id) => {
            const map: Record<string, string> = {
              "2": "nav",
              "6": "headline",
              "7": "subcopy",
              "8": "cta",
              "9": "ticker",
              "10": "features",
            };
            setSelectedId(map[id] || "headline");
          }}
        />

        <Canvas selectedId={selectedId} onSelect={setSelectedId} />

        <RightSidebar selectedLabel={selectedLabel} defaultTab="agent" />
      </div>
    </div>
  );
}
