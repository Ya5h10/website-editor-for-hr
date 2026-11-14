import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 16) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.35,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export function FramerLogo({ size = 18, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4 2h16v7.5H11.5L20 22h-7.5L4 9.5V2zm0 7.5h7.5V17L4 9.5z" />
    </svg>
  );
}

export function IconPlus(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconUndo(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p}>
      <path d="M3 10h11a5 5 0 1 1 0 10H9" />
      <path d="M7 6 3 10l4 4" />
    </svg>
  );
}

export function IconRedo(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p}>
      <path d="M21 10H10a5 5 0 1 0 0 10h5" />
      <path d="M17 6l4 4-4 4" />
    </svg>
  );
}

export function IconFrame(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p}>
      <rect x="5" y="5" width="14" height="14" rx="1.5" />
    </svg>
  );
}

export function IconText(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p}>
      <path d="M5 6h14M12 6v12M8 18h8" />
    </svg>
  );
}

export function IconImage(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p}>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="m4 15 4-3 3 2 4-4 5 5" />
    </svg>
  );
}

export function IconShape(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p}>
      <path d="M12 4 21 19H3L12 4z" />
    </svg>
  );
}

export function IconPlay(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p}>
      <path d="M8 5.5v13l11-6.5-11-6.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconSearch(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p}>
      <circle cx="11" cy="11" r="6" />
      <path d="m16.5 16.5 3.5 3.5" />
    </svg>
  );
}

export function IconChevronDown(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function IconChevronRight(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function IconHome(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p}>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z" />
    </svg>
  );
}

export function IconFolder(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p}>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    </svg>
  );
}

export function IconPage(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p}>
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M14 3v5h5" />
    </svg>
  );
}

export function IconCursor(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p}>
      <path d="M4 3.5 11.2 20.5l2.1-6.2 6.2-2.1L4 3.5z" />
    </svg>
  );
}

export function IconHand(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p}>
      <path d="M8 11V6.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M11 10.5V5.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M14 10.5V7a1.5 1.5 0 0 1 3 0v7.5a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5v-4a1.5 1.5 0 0 1 3 0V11" />
    </svg>
  );
}

export function IconBranch(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p}>
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="6" cy="18" r="2" />
      <path d="M6 8v8M8 18h6a4 4 0 0 0 4-4V8" />
    </svg>
  );
}

export function IconEye(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function IconLock(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function IconMore(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p}>
      <circle cx="6" cy="12" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="18" cy="12" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconSend(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p}>
      <path d="M5 12h12M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconSparkle(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  );
}

export function IconCheck(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p}>
      <path d="M5 12.5 9.5 17 19 7.5" />
    </svg>
  );
}

export function IconComponent(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p}>
      <path d="M12 3 15 9l6 3-6 3-3 6-3-6-6-3 6-3 3-6z" />
    </svg>
  );
}

export function IconDesktop(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p}>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

export function IconLayers(p: IconProps) {
  return (
    <svg {...base(p.size)} {...p}>
      <path d="m12 3 9 5-9 5-9-5 9-5z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 16 9 5 9-5" />
    </svg>
  );
}
