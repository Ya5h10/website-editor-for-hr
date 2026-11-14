"use client";

import { useState } from "react";
import {
  IconPlus,
  IconSearch,
  IconMore,
  IconChevronDown,
  IconChevronRight,
  IconFolder,
} from "./icons";

type CmsTab = "collections" | "fields" | "plugins";

const COLLECTIONS = [
  {
    id: "blog",
    name: "Blog",
    children: [
      { id: "articles", name: "Articles", count: 12 },
      { id: "creators", name: "Creators", count: 6 },
      { id: "categories", name: "Categories", count: 5 },
    ],
  },
  {
    id: "jobs",
    name: "Jobs",
    children: [
      { id: "roles", name: "Roles", count: 8 },
      { id: "locations", name: "Locations", count: 4 },
    ],
  },
  {
    id: "team",
    name: "Team",
    children: [{ id: "people", name: "People", count: 5 }],
  },
];

const ROWS: Record<
  string,
  Array<{
    id: string;
    name: string;
    photo?: string;
    status: "Draft" | "Live" | "Active";
    role: string;
    category?: string;
  }>
> = {
  articles: [
    {
      id: "1",
      name: "Generative design rooted in natural forms",
      status: "Live",
      role: "Design",
      category: "Inspiration",
    },
    {
      id: "2",
      name: "Designing AI tools that feel organic",
      status: "Draft",
      role: "AI",
      category: "Product",
    },
    {
      id: "3",
      name: "Living systems: data visualization from nature",
      status: "Live",
      role: "Data",
      category: "Guide",
    },
    {
      id: "4",
      name: "Sustainable interfaces for a greener web",
      status: "Draft",
      role: "Engineering",
      category: "Product",
    },
  ],
  people: [
    {
      id: "p1",
      name: "Mara Wójcik",
      status: "Active",
      role: "Research Director",
      photo: "MW",
    },
    {
      id: "p2",
      name: "Ivo Nowak",
      status: "Active",
      role: "Design Lead",
      photo: "IN",
    },
    {
      id: "p3",
      name: "Asha Reddy",
      status: "Draft",
      role: "Product Designer",
      photo: "AR",
    },
    {
      id: "p4",
      name: "Kenji Sato",
      status: "Active",
      role: "Engineer",
      photo: "KS",
    },
    {
      id: "p5",
      name: "Elena Costa",
      status: "Live",
      role: "Content",
      photo: "EC",
    },
  ],
  roles: [
    {
      id: "r1",
      name: "Senior Product Designer",
      status: "Live",
      role: "Design",
      category: "Full-time",
    },
    {
      id: "r2",
      name: "Frontend Engineer",
      status: "Draft",
      role: "Engineering",
      category: "Remote",
    },
    {
      id: "r3",
      name: "Brand Strategist",
      status: "Live",
      role: "Brand",
      category: "Hybrid",
    },
  ],
};

interface CmsViewProps {
  onBackToCanvas?: () => void;
}

export default function CmsView({ onBackToCanvas }: CmsViewProps) {
  const [tab, setTab] = useState<CmsTab>("collections");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    blog: true,
    jobs: true,
    team: true,
  });
  const [selectedCollection, setSelectedCollection] = useState("people");
  const [selectedRow, setSelectedRow] = useState("p1");
  const [query, setQuery] = useState("");

  const rows = (ROWS[selectedCollection] || ROWS.articles).filter(
    (r) =>
      !query ||
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.role.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-1 min-h-0 bg-[#0a0a0a]">
      {/* CMS left */}
      <aside className="w-[252px] shrink-0 border-r border-[#222] bg-[#111] flex flex-col">
        <div className="flex items-center gap-0.5 px-2 pt-2 pb-1">
          {(["collections", "fields", "plugins"] as CmsTab[]).map((t) => (
            <button
              key={t}
              type="button"
              className={`px-2.5 py-1 text-[12.5px] font-medium rounded-[6px] capitalize ${
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
          {tab === "collections" &&
            COLLECTIONS.map((col) => (
              <div key={col.id}>
                <button
                  type="button"
                  className="framer-tree-item w-full"
                  onClick={() =>
                    setExpanded((p) => ({ ...p, [col.id]: !p[col.id] }))
                  }
                >
                  {expanded[col.id] ? (
                    <IconChevronDown size={12} className="text-[#666]" />
                  ) : (
                    <IconChevronRight size={12} className="text-[#666]" />
                  )}
                  <IconFolder size={14} className="text-[#aaa]" />
                  <span className="truncate">{col.name}</span>
                </button>
                {expanded[col.id] &&
                  col.children.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      className={`framer-tree-item w-full ${
                        selectedCollection === child.id ? "selected" : ""
                      }`}
                      style={{
                        paddingLeft: 22,
                        background:
                          selectedCollection === child.id
                            ? "rgba(0,153,255,0.18)"
                            : undefined,
                        color:
                          selectedCollection === child.id
                            ? "#fff"
                            : undefined,
                      }}
                      onClick={() => setSelectedCollection(child.id)}
                    >
                      <span className="flex-1 text-left truncate">
                        {child.name}
                      </span>
                      <span className="text-[11px] text-[#666]">
                        {child.count}
                      </span>
                    </button>
                  ))}
              </div>
            ))}

          {tab === "fields" && (
            <div className="px-2 py-3 space-y-2 text-[12.5px] text-[#aaa]">
              {["Title", "Slug", "Image", "Category", "Status", "Role"].map(
                (f) => (
                  <div
                    key={f}
                    className="flex items-center justify-between h-8 px-2 rounded-md bg-[#1a1a1a] border border-[#222]"
                  >
                    <span>{f}</span>
                    <span className="text-[#555]">String</span>
                  </div>
                )
              )}
            </div>
          )}

          {tab === "plugins" && (
            <div className="px-3 py-4 text-[12.5px] text-[#777]">
              No plugins installed. Connect localization, SEO, or sync tools
              here.
            </div>
          )}
        </div>

        <div className="p-2 border-t border-[#222]">
          <button
            type="button"
            className="w-full h-8 rounded-md border border-dashed border-[#333] text-[12px] text-[#888] hover:text-white hover:border-[#555] inline-flex items-center justify-center gap-1"
          >
            <IconPlus size={13} /> Add collection
          </button>
        </div>
      </aside>

      {/* Table */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="h-11 px-3 border-b border-[#222] flex items-center justify-between bg-[#0f0f0f]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="framer-btn-ghost h-7 px-2"
              onClick={onBackToCanvas}
            >
              ← Canvas
            </button>
            <span className="text-[#555]">/</span>
            <span className="text-[13px] text-white capitalize">
              {selectedCollection}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" className="framer-icon-btn" title="Add">
              <IconPlus size={14} />
            </button>
            <button type="button" className="framer-icon-btn" title="Search">
              <IconSearch size={14} />
            </button>
            <button type="button" className="framer-icon-btn" title="More">
              <IconMore size={14} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto framer-scrollbar">
          <table className="w-full text-left text-[13px]">
            <thead className="sticky top-0 bg-[#111] text-[11px] uppercase tracking-wide text-[#666]">
              <tr className="border-b border-[#222]">
                <th className="w-10 px-3 py-2.5 font-medium" />
                <th className="px-3 py-2.5 font-medium">Name</th>
                <th className="px-3 py-2.5 font-medium w-24">Photo</th>
                <th className="px-3 py-2.5 font-medium w-28">Status</th>
                <th className="px-3 py-2.5 font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const selected = selectedRow === row.id;
                return (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedRow(row.id)}
                    className={`border-b border-[#1c1c1c] cursor-pointer ${
                      selected
                        ? "bg-[#0d1a24] outline outline-1 outline-[#0099ff] outline-offset-[-1px]"
                        : "hover:bg-[#151515]"
                    }`}
                  >
                    <td className="px-3 py-3 text-[#444]">
                      <span className="inline-block w-3 text-center leading-none tracking-tighter">
                        ⠿
                      </span>
                    </td>
                    <td className="px-3 py-3 text-white/90">{row.name}</td>
                    <td className="px-3 py-3">
                      <span className="inline-flex w-9 h-9 rounded-md bg-[#222] border border-[#333] items-center justify-center text-[10px] text-[#888]">
                        {row.photo || row.name.slice(0, 2).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <StatusPill status={row.status} />
                    </td>
                    <td className="px-3 py-3 text-[#aaa]">
                      {row.category || row.role}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: "Draft" | "Live" | "Active" }) {
  const styles =
    status === "Live" || status === "Active"
      ? "bg-[#14301f] text-[#7ddea0] border-[#1e4a2e]"
      : "bg-[#1a2433] text-[#8eb6e8] border-[#243447]";
  return (
    <span
      className={`inline-flex h-6 px-2 rounded-full border text-[11px] font-medium items-center ${styles}`}
    >
      {status}
    </span>
  );
}
