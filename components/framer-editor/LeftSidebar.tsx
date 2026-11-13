"use client";

import { useState } from "react";
import {
  IconSearch,
  IconPlus,
  IconHome,
  IconFolder,
  IconPage,
  IconChevronDown,
  IconChevronRight,
  IconEye,
  IconLock,
  IconLayers,
} from "./icons";

type LeftTab = "pages" | "layers" | "assets";

interface PageNode {
  id: string;
  name: string;
  kind: "home" | "page" | "folder";
  children?: PageNode[];
}

const PAGES: PageNode[] = [
  { id: "home", name: "Home", kind: "home" },
  {
    id: "work",
    name: "/work",
    kind: "folder",
    children: [
      { id: "work-pages", name: "Work Pages", kind: "page" },
      { id: "case-studies", name: "Case Studies", kind: "page" },
    ],
  },
  { id: "services", name: "/services", kind: "page" },
  { id: "about", name: "/about", kind: "page" },
  { id: "contact", name: "/contact", kind: "page" },
  { id: "news", name: "/news", kind: "page" },
  {
    id: "legal",
    name: "/legal",
    kind: "folder",
    children: [
      { id: "privacy", name: "/privacy", kind: "page" },
      { id: "terms", name: "/terms", kind: "page" },
    ],
  },
  { id: "careers", name: "/careers", kind: "page" },
];

const LAYERS = [
  { id: "1", name: "Desktop", depth: 0, locked: false, visible: true },
  { id: "2", name: "Navigation", depth: 1, locked: false, visible: true },
  { id: "3", name: "Logo", depth: 2, locked: false, visible: true },
  { id: "4", name: "Nav Links", depth: 2, locked: false, visible: true },
  { id: "5", name: "Hero", depth: 1, locked: false, visible: true },
  { id: "6", name: "Headline", depth: 2, locked: false, visible: true },
  { id: "7", name: "Subcopy", depth: 2, locked: false, visible: true },
  { id: "8", name: "CTA Stack", depth: 2, locked: false, visible: true },
  { id: "9", name: "Hero Media", depth: 2, locked: false, visible: true },
  { id: "10", name: "Features", depth: 1, locked: false, visible: true },
  { id: "11", name: "Feature Card 1", depth: 2, locked: false, visible: true },
  { id: "12", name: "Feature Card 2", depth: 2, locked: false, visible: true },
  { id: "13", name: "Feature Card 3", depth: 2, locked: false, visible: true },
  { id: "14", name: "Footer", depth: 1, locked: true, visible: true },
];

const ASSETS = [
  { name: "haus-logo.svg", type: "SVG" },
  { name: "hero-still.webp", type: "Image" },
  { name: "studio-portrait.jpg", type: "Image" },
  { name: "grain-overlay.png", type: "Image" },
  { name: "Button / Primary", type: "Component" },
  { name: "Nav / Desktop", type: "Component" },
];

interface LeftSidebarProps {
  selectedPageId?: string;
  onSelectPage?: (id: string) => void;
  selectedLayerId?: string;
  onSelectLayer?: (id: string) => void;
}

export default function LeftSidebar({
  selectedPageId = "home",
  onSelectPage,
  selectedLayerId = "6",
  onSelectLayer,
}: LeftSidebarProps) {
  const [tab, setTab] = useState<LeftTab>("pages");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    work: true,
    legal: true,
  });

  return (
    <aside
      className="flex flex-col border-r border-[#222] bg-[#111] shrink-0 h-full"
      style={{ width: "var(--framer-left-w)" }}
    >
      {/* Tabs */}
      <div className="flex items-center gap-0.5 px-2 pt-2 pb-1 relative z-10">
        {(["pages", "layers", "assets"] as LeftTab[]).map((t) => (
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

      {/* Search */}
      <div className="px-2 py-1.5">
        <div className="relative">
          <IconSearch
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#555]"
          />
          <input
            className="framer-input pl-8"
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto framer-scrollbar px-1.5 pb-3">
        {tab === "pages" && (
          <>
            <div className="flex items-center justify-between px-2 py-1.5 text-[11px] uppercase tracking-wide text-[#666]">
              <span>Pages</span>
              <button className="framer-icon-btn w-6 h-6" type="button">
                <IconPlus size={13} />
              </button>
            </div>
            {PAGES.filter((p) =>
              !query || p.name.toLowerCase().includes(query.toLowerCase())
            ).map((node) => (
              <PageTreeItem
                key={node.id}
                node={node}
                depth={0}
                selectedId={selectedPageId}
                expanded={expanded}
                onToggle={(id) =>
                  setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
                }
                onSelect={(id) => onSelectPage?.(id)}
              />
            ))}
          </>
        )}

        {tab === "layers" && (
          <>
            <div className="flex items-center justify-between px-2 py-1.5 text-[11px] uppercase tracking-wide text-[#666]">
              <span className="inline-flex items-center gap-1.5">
                <IconLayers size={12} />
                Layers
              </span>
              <span className="normal-case tracking-normal text-[#555]">17</span>
            </div>
            {LAYERS.filter(
              (l) =>
                !query || l.name.toLowerCase().includes(query.toLowerCase())
            ).map((layer) => (
              <button
                key={layer.id}
                type="button"
                className={`framer-tree-item w-full ${
                  selectedLayerId === layer.id ? "selected" : ""
                }`}
                style={{ paddingLeft: 8 + layer.depth * 14 }}
                onClick={() => onSelectLayer?.(layer.id)}
              >
                <span className="flex-1 text-left truncate">{layer.name}</span>
                <span className="flex items-center gap-1 text-[#555]">
                  {layer.locked && <IconLock size={12} />}
                  <IconEye size={12} className={layer.visible ? "" : "opacity-30"} />
                </span>
              </button>
            ))}
          </>
        )}

        {tab === "assets" && (
          <>
            <div className="flex items-center justify-between px-2 py-1.5 text-[11px] uppercase tracking-wide text-[#666]">
              <span>Assets</span>
              <button className="framer-icon-btn w-6 h-6" type="button">
                <IconPlus size={13} />
              </button>
            </div>
            {ASSETS.filter(
              (a) =>
                !query || a.name.toLowerCase().includes(query.toLowerCase())
            ).map((asset) => (
              <div key={asset.name} className="framer-tree-item">
                <div className="w-6 h-6 rounded bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[9px] text-[#666]">
                  {asset.type === "SVG" ? "SVG" : asset.type[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-white/90">{asset.name}</div>
                  <div className="text-[11px] text-[#555]">{asset.type}</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </aside>
  );
}

function PageTreeItem({
  node,
  depth,
  selectedId,
  expanded,
  onToggle,
  onSelect,
}: {
  node: PageNode;
  depth: number;
  selectedId: string;
  expanded: Record<string, boolean>;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
}) {
  const hasChildren = !!node.children?.length;
  const isOpen = expanded[node.id];

  return (
    <div>
      <button
        type="button"
        className={`framer-tree-item w-full ${
          selectedId === node.id ? "selected" : ""
        }`}
        style={{ paddingLeft: 8 + depth * 14 }}
        onClick={() => {
          if (hasChildren) onToggle(node.id);
          onSelect(node.id);
        }}
      >
        {hasChildren ? (
          isOpen ? (
            <IconChevronDown size={12} className="text-[#666] shrink-0" />
          ) : (
            <IconChevronRight size={12} className="text-[#666] shrink-0" />
          )
        ) : (
          <span className="w-3 shrink-0" />
        )}
        {node.kind === "home" ? (
          <IconHome size={14} className="shrink-0 text-[#aaa]" />
        ) : node.kind === "folder" ? (
          <IconFolder size={14} className="shrink-0 text-[#aaa]" />
        ) : (
          <IconPage size={14} className="shrink-0 text-[#aaa]" />
        )}
        <span className="truncate">{node.name}</span>
      </button>
      {hasChildren &&
        isOpen &&
        node.children!.map((child) => (
          <PageTreeItem
            key={child.id}
            node={child}
            depth={depth + 1}
            selectedId={selectedId}
            expanded={expanded}
            onToggle={onToggle}
            onSelect={onSelect}
          />
        ))}
    </div>
  );
}
