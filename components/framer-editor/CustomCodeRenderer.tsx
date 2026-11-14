"use client";

import React, { useMemo } from "react";
import * as Babel from "@babel/standalone";

interface CustomCodeRendererProps {
  code?: string;
  componentName?: string;
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

type AnyComp = React.ComponentType<Record<string, unknown>>;

function compileCustomComponent(
  code: string,
  preferredName?: string
): { Component: AnyComp | null; error: string | null } {
  try {
    const source = code.trim();
    if (!source) {
      return { Component: null, error: "No code yet." };
    }

    const babelResult = Babel.transform(source, {
      presets: [
        ["react", { runtime: "classic" }],
        "typescript",
      ],
      plugins: ["transform-modules-commonjs"],
      filename: "CustomComponent.tsx",
    });
    const transformed = babelResult?.code;

    if (!transformed) {
      return { Component: null, error: "Failed to transform code." };
    }

    // Provide React + hooks in scope; capture default or named export.
    const factory = new Function(
      "React",
      `
      const exports = {};
      const module = { exports };
      ${transformed}
      const mod = module.exports && Object.keys(module.exports).length
        ? module.exports
        : exports;
      return mod.default || mod.${preferredName || "Component"} || mod;
      `
    );

    const exported = factory(React);
    if (typeof exported !== "function") {
      return {
        Component: null,
        error:
          "Code must export a React function component (default export).",
      };
    }
    return { Component: exported as AnyComp, error: null };
  } catch (err) {
    return {
      Component: null,
      error: err instanceof Error ? err.message : "Compile error",
    };
  }
}

/** Live-render a user-authored React component from source. */
export default function CustomCodeRenderer({
  code = "",
  componentName = "CustomBlock",
  title,
  className,
  children,
}: CustomCodeRendererProps) {
  const { Component, error } = useMemo(
    () => compileCustomComponent(code, componentName),
    [code, componentName]
  );

  if (error || !Component) {
    return (
      <div
        className={`w-full h-full rounded-lg border border-red-500/30 bg-red-950/40 p-3 text-[11px] text-red-200 overflow-auto ${className || ""}`}
      >
        <div className="font-semibold mb-1">Code component error</div>
        <pre className="whitespace-pre-wrap font-mono opacity-90 m-0">
          {error || "Unknown error"}
        </pre>
      </div>
    );
  }

  try {
    return (
      <Component title={title} className={className}>
        {children}
      </Component>
    );
  } catch (err) {
    return (
      <div className="w-full h-full rounded-lg border border-red-500/30 bg-red-950/40 p-3 text-[11px] text-red-200">
        Runtime error:{" "}
        {err instanceof Error ? err.message : "Failed to render"}
      </div>
    );
  }
}
