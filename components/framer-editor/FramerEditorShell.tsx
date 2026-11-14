"use client";

import { useCallback, useMemo, useState } from "react";
import TopToolbar from "./TopToolbar";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import Canvas from "./Canvas";
import CmsView from "./CmsView";
import CodeExportPanel from "./CodeExportPanel";
import {
  CanvasElement,
  EditorMode,
  ElementStyle,
  InsertKind,
  createElement,
  createInitialElements,
} from "./types";

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
  const [mode, setMode] = useState<EditorMode>("canvas");
  const [exportScope, setExportScope] = useState<"page" | "element">("page");
  const [selectedPageId, setSelectedPageId] = useState("home");
  const [elements, setElements] = useState<CanvasElement[]>(() =>
    createInitialElements()
  );
  const [selectedId, setSelectedId] = useState<string | null>("headline");
  const [past, setPast] = useState<CanvasElement[][]>([]);
  const [future, setFuture] = useState<CanvasElement[][]>([]);

  const openCodeExport = useCallback((scope: "page" | "element" = "page") => {
    setExportScope(scope);
    setMode("code");
  }, []);

  const selected = useMemo(
    () => elements.find((e) => e.id === selectedId) || null,
    [elements, selectedId]
  );

  const commit = useCallback(
    (next: CanvasElement[] | ((prev: CanvasElement[]) => CanvasElement[])) => {
      setElements((prev) => {
        const resolved = typeof next === "function" ? next(prev) : next;
        setPast((p) => [...p.slice(-29), prev]);
        setFuture([]);
        return resolved;
      });
    },
    []
  );

  const updateElement = useCallback(
    (id: string, patch: Partial<CanvasElement>) => {
      commit((prev) =>
        prev.map((el) => (el.id === id ? { ...el, ...patch } : el))
      );
    },
    [commit]
  );

  const handleInsert = useCallback(
    (kind: InsertKind, x = 120, y = 140) => {
      const el = createElement(kind, {
        x,
        y,
      });
      commit((prev) => [...prev, el]);
      setSelectedId(el.id);
      setMode("canvas");
    },
    [commit]
  );

  const handleMove = useCallback((id: string, x: number, y: number) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, x, y } : el))
    );
  }, []);

  const handleUndo = useCallback(() => {
    setPast((p) => {
      if (!p.length) return p;
      const prev = p[p.length - 1];
      setElements((current) => {
        setFuture((f) => [current, ...f]);
        return prev;
      });
      return p.slice(0, -1);
    });
  }, []);

  const handleRedo = useCallback(() => {
    setFuture((f) => {
      if (!f.length) return f;
      const [next, ...rest] = f;
      setElements((current) => {
        setPast((p) => [...p, current]);
        return next;
      });
      return rest;
    });
  }, []);

  return (
    <div className="framer-editor fixed inset-0 flex flex-col overflow-hidden">
      <TopToolbar
        projectName={projectName}
        branchName={branchName}
        mode={mode}
        onModeChange={(next) => {
          if (next === "code") openCodeExport("page");
          else setMode(next);
        }}
        onPreview={onPreview}
        onPublish={() => {
          openCodeExport("page");
          onPublish?.();
        }}
        publishLabel={publishLabel}
        publishDisabled={publishDisabled}
        onInsert={(kind) => handleInsert(kind)}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />

      {mode === "cms" ? (
        <CmsView onBackToCanvas={() => setMode("canvas")} />
      ) : mode === "code" ? (
        <CodeExportPanel
          elements={elements}
          pageName={selectedPageId === "home" ? "Home" : selectedPageId}
          selectedId={selectedId}
          initialScope={exportScope}
          onSelectElement={setSelectedId}
          onBackToCanvas={() => setMode("canvas")}
        />
      ) : (
        <div className="flex flex-1 min-h-0">
          <LeftSidebar
            selectedPageId={selectedPageId}
            onSelectPage={setSelectedPageId}
            elements={elements}
            selectedId={selectedId}
            onSelectElement={setSelectedId}
          />

          <Canvas
            elements={elements}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onMove={handleMove}
            onInsertAt={(kind, x, y) => handleInsert(kind, x, y)}
          />

          <RightSidebar
            element={selected}
            defaultTab="agent"
            onChangeStyle={(patch: Partial<ElementStyle>) => {
              if (!selectedId) return;
              commit((prev) =>
                prev.map((el) =>
                  el.id === selectedId
                    ? { ...el, style: { ...el.style, ...patch } }
                    : el
                )
              );
            }}
            onChangeProps={(patch) => {
              if (!selectedId) return;
              commit((prev) =>
                prev.map((el) =>
                  el.id === selectedId
                    ? { ...el, props: { ...el.props, ...patch } }
                    : el
                )
              );
            }}
            onChangeName={(name) => {
              if (!selectedId) return;
              updateElement(selectedId, { name });
            }}
            onChangeSize={(size) => {
              if (!selectedId) return;
              updateElement(selectedId, size);
            }}
            onExportElement={() => openCodeExport("element")}
          />
        </div>
      )}
    </div>
  );
}
