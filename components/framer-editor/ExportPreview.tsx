"use client";

import type { CSSProperties } from "react";
import { CanvasElement } from "./types";

interface ExportPreviewProps {
  elements: CanvasElement[];
  scope: "page" | "element";
  elementId?: string | null;
}

/** Live visual preview of what the exported React will render. */
export default function ExportPreview({
  elements,
  scope,
  elementId,
}: ExportPreviewProps) {
  const visible = elements
    .filter((el) => el.visible !== false)
    .slice()
    .sort((a, b) => a.y - b.y || a.x - b.x);

  const target =
    scope === "element"
      ? visible.find((el) => el.id === elementId) ||
        elements.find((el) => el.id === elementId)
      : null;

  const renderList =
    scope === "element" ? (target ? [target] : []) : visible;

  if (!renderList.length) {
    return (
      <div className="h-full flex items-center justify-center text-[13px] text-[#666]">
        Select a layer to preview the export.
      </div>
    );
  }

  if (scope === "element" && target) {
    return (
      <div className="h-full overflow-auto framer-scrollbar bg-[#050505] p-6 flex items-start justify-center">
        <div className="w-full max-w-[900px]">
          <PreviewBlock el={target} />
        </div>
      </div>
    );
  }

  const height = Math.max(
    900,
    ...visible.map((el) => el.y + el.height + 48),
    0
  );

  return (
    <div className="h-full overflow-auto framer-scrollbar bg-[#111]">
      <div className="min-h-full flex justify-center py-6 px-4">
        <div
          className="relative bg-black text-white shadow-2xl shadow-black/50"
          style={{ width: 1200, minHeight: height, transform: "scale(0.72)", transformOrigin: "top center", marginBottom: `-${height * 0.28}px` }}
        >
          {visible.map((el) => (
            <div
              key={el.id}
              className="absolute"
              style={{
                left: el.x,
                top: el.y,
                width: el.width,
                height: el.height,
              }}
            >
              <PreviewBlock el={el} fill />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PreviewBlock({
  el,
  fill,
}: {
  el: CanvasElement;
  fill?: boolean;
}) {
  const s = el.style;
  const radius = s.radius === 999 ? 9999 : s.radius;
  const opacity = s.opacity / 100;
  const box: CSSProperties = {
    width: fill ? "100%" : el.width,
    height: fill ? "100%" : undefined,
    minHeight: fill ? "100%" : el.height,
    opacity,
  };

  if (el.id === "nav") {
    return (
      <header
        style={{
          ...box,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          background: s.fill || "#000",
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.2em" }}>
          HAUS
        </span>
        <nav style={{ display: "flex", gap: 32, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
          <span>Work</span>
          <span>Services</span>
          <span>About</span>
          <span style={{ color: "#fff" }}>Get in Touch</span>
        </nav>
      </header>
    );
  }

  if (el.type === "button") {
    return (
      <button
        type="button"
        style={{
          ...box,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          borderRadius: radius,
          background: s.fill || "#fff",
          color: s.color || "#000",
          fontSize: s.fontSize || 13,
          fontWeight: s.fontWeight || 600,
          cursor: "default",
          height: el.height,
          minWidth: el.width,
        }}
      >
        {el.props.label || "Button"}
      </button>
    );
  }

  if (el.type === "features") {
    return (
      <section
        style={{
          ...box,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: 24,
        }}
      >
        {(el.props.features || []).map((f) => (
          <article key={f.title}>
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>
              {f.title}
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
              {f.description}
            </p>
          </article>
        ))}
      </section>
    );
  }

  if (el.type === "values_grid") {
    return (
      <section style={box}>
        <h2 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 500 }}>
          {el.props.heading}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {(el.props.items || []).map((item) => (
            <div key={item.title}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{item.title}</div>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (el.type === "hero" || el.type === "feature_split") {
    return (
      <section
        style={{
          ...box,
          ...(el.type === "feature_split"
            ? {
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
                padding: 24,
                background: s.fill || "#0a0a0a",
                borderRadius: radius || 8,
              }
            : {}),
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: el.type === "hero" ? s.fontSize || 48 : 20,
              fontWeight: s.fontWeight || 600,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            {el.props.heading}
          </h1>
          <p style={{ marginTop: 12, fontSize: 14, color: "rgba(255,255,255,0.6)", maxWidth: 560 }}>
            {el.props.subheading || el.props.content}
          </p>
        </div>
      </section>
    );
  }

  if (el.id === "ticker" || el.name === "Hero Media") {
    const cards = ["Studio", "Product", "Brand", "Motion", "Web"];
    return (
      <div style={{ ...box, display: "flex", gap: 12, overflow: "hidden" }}>
        {cards.map((label) => (
          <div
            key={label}
            style={{
              position: "relative",
              flex: "0 0 200px",
              height: "100%",
              borderRadius: 12,
              background: "linear-gradient(145deg,#1a1a1a,#3a3a3a)",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: 12,
                bottom: 12,
                fontSize: 12,
                color: "rgba(255,255,255,0.8)",
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (el.type === "image") {
    return (
      <figure
        style={{
          ...box,
          margin: 0,
          borderRadius: radius || 12,
          background: s.fill || "#1f2937",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {el.props.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={el.props.imageUrl}
            alt={el.props.label || ""}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(145deg,#1a1a1a,#3a3a3a)",
            }}
          />
        )}
      </figure>
    );
  }

  return (
    <div
      style={{
        ...box,
        color: s.color || "#fff",
        fontSize: s.fontSize || 16,
        fontWeight: s.fontWeight || 400,
        lineHeight: (s.fontSize || 16) >= 40 ? 1.12 : 1.5,
        letterSpacing: (s.fontSize || 16) >= 40 ? "-0.02em" : undefined,
        whiteSpace: "pre-wrap",
      }}
    >
      {el.props.text || el.props.heading || el.props.label || el.name}
    </div>
  );
}
