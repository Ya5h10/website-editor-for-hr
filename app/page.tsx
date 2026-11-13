import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-lg text-center space-y-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#111] border border-[#222]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 2h16v7.5H11.5L20 22h-7.5L4 9.5V2zm0 7.5h7.5V17L4 9.5z" />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Framer Website Editor
        </h1>
        <p className="text-[#888] text-[15px] leading-relaxed">
          Open the product editor chrome — dark theme, pages/layers, canvas,
          agent &amp; style panels.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/editor"
            className="inline-flex items-center justify-center h-10 px-5 rounded-[8px] bg-[#0099ff] text-white text-sm font-semibold hover:bg-[#33adff]"
          >
            Open Editor
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center h-10 px-5 rounded-[8px] border border-[#333] text-sm text-white hover:bg-white/5"
          >
            Recruiter login
          </Link>
        </div>
      </div>
    </main>
  );
}
