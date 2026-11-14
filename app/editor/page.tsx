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
      onPublish={() => {
        // Visual chrome — publish is a no-op in the Framer UI copy
      }}
      publishLabel="Publish"
    />
  );
}
