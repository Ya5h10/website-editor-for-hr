"use client";

import FramerEditorShell from "@/components/framer-editor/FramerEditorShell";

export default function EditorPage() {
  return (
    <FramerEditorShell
      projectName="Site"
      branchName="main"
      onPreview={() => {
        window.open("/", "_blank");
      }}
      // No onPublish → toolbar Publish opens Code export (demo chrome)
      publishLabel="Publish"
    />
  );
}
