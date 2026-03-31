"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/",
    label: "Trajet",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke={active ? "#007AFF" : "#8E8E93"}
          strokeWidth="2"
        />
        <circle cx="12" cy="12" r="3.5" fill={active ? "#007AFF" : "#8E8E93"} />
        <circle cx="12" cy="12" r="1.5" fill="white" />
      </svg>
    ),
  },
  {
    href: "/trips",
    label: "Trajets",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="2"
          stroke={active ? "#007AFF" : "#8E8E93"}
          strokeWidth="2"
        />
        <path
          d="M7 9h10M7 12h7M7 15h5"
          stroke={active ? "#007AFF" : "#8E8E93"}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/stats",
    label: "Stats",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 18V14M9 18V10M14 18V12M19 18V6"
          stroke={active ? "#007AFF" : "#8E8E93"}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "Réglages",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="3"
          stroke={active ? "#007AFF" : "#8E8E93"}
          strokeWidth="2"
        />
        <path
          d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
          stroke={active ? "#007AFF" : "#8E8E93"}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="tab-bar fixed bottom-0 left-0 right-0 z-50 flex"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[49px]"
            style={{ minWidth: 44, minHeight: 44 }}
          >
            {tab.icon(active)}
            <span
              className="text-[10px] font-medium leading-none"
              style={{ color: active ? "#007AFF" : "#8E8E93" }}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
