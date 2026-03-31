"use client";

import { useState, useMemo } from "react";
import { useTrips } from "@/hooks/useTrips";
import { formatKm } from "@/lib/format";
import type { Trip } from "@/lib/types";

type Period = "day" | "week" | "month";

function startOf(period: Period): Date {
  const now = new Date();
  if (period === "day") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  if (period === "week") {
    const d = new Date(now);
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  }
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function groupByDay(trips: Trip[], start: Date, end: Date) {
  const map = new Map<string, number>();
  trips.forEach((t) => {
    if (t.startTime < start.getTime() || t.startTime > end.getTime()) return;
    const label = new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
    }).format(new Date(t.startTime));
    map.set(label, (map.get(label) ?? 0) + t.distanceKm);
  });
  return map;
}

export default function StatsPage() {
  const { trips } = useTrips();
  const [period, setPeriod] = useState<Period>("week");

  const { filtered, totalKm, tripCount, avgKm, bars } = useMemo(() => {
    const start = startOf(period);
    const end = new Date();
    const filtered = trips.filter(
      (t) => t.startTime >= start.getTime() && t.startTime <= end.getTime()
    );
    const totalKm = filtered.reduce((a, t) => a + t.distanceKm, 0);
    const tripCount = filtered.length;
    const avgKm = tripCount > 0 ? totalKm / tripCount : 0;
    const dayMap = groupByDay(filtered, start, end);
    const bars = Array.from(dayMap.entries()).map(([label, km]) => ({ label, km }));
    return { filtered, totalKm, tripCount, avgKm, bars };
  }, [trips, period]);

  const PERIODS: { key: Period; label: string }[] = [
    { key: "day", label: "Auj." },
    { key: "week", label: "Semaine" },
    { key: "month", label: "Mois" },
  ];

  const maxKm = bars.reduce((a, b) => Math.max(a, b.km), 0) || 1;

  return (
    <div
      className="min-h-screen pb-6"
      style={{ background: "var(--bg-secondary)" }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10"
        style={{
          background: "var(--tab-bar-bg)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
          borderBottom: "0.5px solid var(--separator)",
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <div className="flex items-center justify-between px-4 h-14">
          <h1
            className="text-xl font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Statistiques
          </h1>
        </div>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-4">
        {/* Segment control */}
        <div
          className="flex rounded-xl p-1 gap-1"
          style={{ background: "var(--ios-gray5)" }}
        >
          {PERIODS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background:
                  period === key ? "var(--bg-primary)" : "transparent",
                color:
                  period === key ? "var(--text-primary)" : "var(--text-secondary)",
                boxShadow:
                  period === key ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Distance" value={formatKm(totalKm)} accent="var(--ios-blue)" />
          <StatCard label="Trajets" value={String(tripCount)} accent="var(--ios-orange)" />
          <StatCard label="Moyenne" value={formatKm(avgKm)} accent="var(--ios-green)" />
        </div>

        {/* Bar chart */}
        {bars.length > 0 ? (
          <div className="ios-card p-4">
            <p
              className="text-sm font-semibold mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              Km par jour
            </p>
            <div className="flex items-end gap-2 h-32">
              {bars.map(({ label, km }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1 flex-1"
                >
                  <span
                    className="text-[9px]"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {km.toFixed(1)}
                  </span>
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${Math.max(4, (km / maxKm) * 96)}px`,
                      background: "var(--ios-blue)",
                      opacity: 0.85,
                    }}
                  />
                  <span
                    className="text-[9px] text-center leading-tight"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="ios-card p-8 flex flex-col items-center gap-2"
          >
            <p
              className="text-base font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Aucune donnée
            </p>
            <p
              className="text-sm text-center"
              style={{ color: "var(--text-secondary)" }}
            >
              Enregistrez des trajets pour voir vos statistiques ici.
            </p>
          </div>
        )}

        {/* All-time total */}
        {trips.length > 0 && (
          <div
            className="ios-card p-4 flex items-center justify-between"
          >
            <div>
              <p
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Total depuis le début
              </p>
              <p
                className="text-2xl font-bold mt-0.5"
                style={{ color: "var(--text-primary)" }}
              >
                {formatKm(trips.reduce((a, t) => a + t.distanceKm, 0))}
              </p>
            </div>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "rgba(0,122,255,0.12)" }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path
                  d="M3 11l7.5 7.5L20 4"
                  stroke="var(--ios-blue)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="ios-card p-3 flex flex-col gap-1">
      <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
        {label}
      </p>
      <p className="text-lg font-bold leading-tight" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}
