"use client";

interface CanvasContentProps {
  selectedId?: string;
  onSelect?: (id: string) => void;
}

export default function CanvasContent({
  selectedId = "headline",
  onSelect,
}: CanvasContentProps) {
  return (
    <div className="bg-black text-white min-h-[900px] font-sans">
      {/* Nav */}
      <Selectable
        id="nav"
        selectedId={selectedId}
        onSelect={onSelect}
        className="flex items-center justify-between px-10 h-16 border-b border-white/10"
      >
        <div className="text-[15px] font-semibold tracking-[0.2em]">HAUS</div>
        <div className="flex items-center gap-8 text-[13px] text-white/70">
          <span>Work</span>
          <span>Services</span>
          <span>About</span>
          <span className="text-white">Get in Touch</span>
        </div>
      </Selectable>

      {/* Hero */}
      <section className="px-10 pt-16 pb-20">
        <Selectable
          id="headline"
          selectedId={selectedId}
          onSelect={onSelect}
          className="max-w-[920px]"
        >
          <h1 className="text-[56px] leading-[1.05] font-semibold tracking-[-0.03em]">
            We are a multidisciplinary creative studio specializing in digital
            experiences.
          </h1>
        </Selectable>

        <Selectable
          id="subcopy"
          selectedId={selectedId}
          onSelect={onSelect}
          className="mt-8 max-w-[560px]"
        >
          <p className="text-[16px] leading-relaxed text-white/60">
            Haus partners with ambitious brands to craft websites, product
            interfaces, and motion systems that feel intentional, calm, and
            unmistakably theirs.
          </p>
        </Selectable>

        <Selectable
          id="cta"
          selectedId={selectedId}
          onSelect={onSelect}
          className="mt-10 inline-flex"
        >
          <button
            type="button"
            className="h-11 px-5 rounded-full bg-white text-black text-[13px] font-medium"
          >
            View selected work
          </button>
        </Selectable>
      </section>

      {/* Image ticker strip */}
      <Selectable
        id="ticker"
        selectedId={selectedId}
        onSelect={onSelect}
        className="px-10 pb-16"
      >
        <div className="flex gap-3 overflow-hidden">
          {["Studio", "Product", "Brand", "Motion", "Web"].map((label, i) => (
            <div
              key={label}
              className="shrink-0 w-[220px] h-[280px] rounded-xl overflow-hidden relative"
              style={{
                background: [
                  "linear-gradient(145deg,#1a1a1a,#3a3a3a)",
                  "linear-gradient(145deg,#111827,#1f2937)",
                  "linear-gradient(145deg,#1c1917,#44403c)",
                  "linear-gradient(145deg,#0f172a,#334155)",
                  "linear-gradient(145deg,#18181b,#3f3f46)",
                ][i],
              }}
            >
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,white,transparent_45%)]" />
              <div className="absolute bottom-4 left-4 text-[12px] text-white/80">
                {label}
              </div>
            </div>
          ))}
        </div>
      </Selectable>

      {/* Features */}
      <Selectable
        id="features"
        selectedId={selectedId}
        onSelect={onSelect}
        className="px-10 pb-24"
      >
        <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-14">
          {[
            {
              title: "Design systems",
              body: "Reusable foundations that keep product and marketing surfaces aligned.",
            },
            {
              title: "Launch sites",
              body: "High-craft marketing sites with motion, CMS, and production hosting.",
            },
            {
              title: "Product UI",
              body: "Interfaces that feel precise, calm, and ready for complex workflows.",
            },
          ].map((item) => (
            <div key={item.title}>
              <div className="text-[15px] font-medium mb-2">{item.title}</div>
              <p className="text-[13px] leading-relaxed text-white/55">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Selectable>
    </div>
  );
}

function Selectable({
  id,
  selectedId,
  onSelect,
  className = "",
  children,
}: {
  id: string;
  selectedId?: string;
  onSelect?: (id: string) => void;
  className?: string;
  children: React.ReactNode;
}) {
  const selected = selectedId === id;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(id);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.(id);
        }
      }}
      className={`relative cursor-pointer ${className} ${
        selected ? "framer-selection" : "hover:outline hover:outline-1 hover:outline-[#0099ff]/40"
      }`}
    >
      {selected && (
        <>
          <Handle className="-top-1 -left-1" />
          <Handle className="-top-1 -right-1" />
          <Handle className="-bottom-1 -left-1" />
          <Handle className="-bottom-1 -right-1" />
          <Handle className="-top-1 left-1/2 -translate-x-1/2" />
          <Handle className="-bottom-1 left-1/2 -translate-x-1/2" />
          <Handle className="top-1/2 -left-1 -translate-y-1/2" />
          <Handle className="top-1/2 -right-1 -translate-y-1/2" />
        </>
      )}
      {children}
    </div>
  );
}

function Handle({ className }: { className: string }) {
  return (
    <span
      className={`absolute w-[7px] h-[7px] bg-white border border-[#0099ff] rounded-[1px] z-10 shadow-[0_0_0_1px_rgba(0,153,255,0.35)] ${className}`}
    />
  );
}
