"use client";

import { useTrips } from "@/hooks/useTrips";
import { useTracking } from "@/hooks/useTracking";
import { formatKm, formatElapsed } from "@/lib/format";

export default function TrackingPage() {
  const { addTrip } = useTrips();
  const { isTracking, distanceKm, elapsed, error, start, stop } =
    useTracking(addTrip);

  return (
    <div
      className="flex flex-col items-center px-5 overflow-hidden"
      style={{
        /* Fill exactly the visible area above the tab bar */
        height: "calc(100dvh - 83px - env(safe-area-inset-bottom, 0px))",
      }}
    >
      {/* Header — compact */}
      <div className="w-full text-center pt-4 pb-1 shrink-0">
        <h1
          className="text-lg font-semibold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Mes Déplacements
        </h1>
        <p
          className="text-xs mt-0.5"
          style={{ color: "var(--text-secondary)" }}
        >
          {isTracking ? "Trajet en cours…" : "Prêt à démarrer"}
        </p>
      </div>

      {/* Distance display — scales with viewport */}
      <div className="flex flex-col items-center justify-center gap-1 shrink-0 pt-4">
        {isTracking && (
          <div className="relative flex items-center justify-center w-8 h-8 mb-1">
            <div
              className="absolute w-7 h-7 rounded-full pulse-ring"
              style={{ background: "rgba(52,199,89,0.3)" }}
            />
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: "var(--ios-green)" }}
            />
          </div>
        )}

        <div
          className="font-bold tracking-tight tabular-nums"
          style={{
            fontSize: "clamp(40px, 12vw, 60px)",
            lineHeight: 1,
            color: isTracking ? "var(--ios-green)" : "var(--text-primary)",
            transition: "color 0.4s ease",
          }}
        >
          {distanceKm.toFixed(2)}
        </div>
        <div
          className="text-base font-semibold"
          style={{ color: "var(--text-secondary)" }}
        >
          kilomètres
        </div>

        {isTracking && (
          <div
            className="font-mono text-xl font-light tabular-nums mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            {formatElapsed(elapsed)}
          </div>
        )}

        {error && (
          <div
            className="ios-card px-3 py-2 text-xs text-center max-w-[280px] mt-2"
            style={{
              color: "var(--ios-red)",
              background: "rgba(255,59,48,0.08)",
            }}
          >
            {error}
          </div>
        )}
      </div>

      {/* Start / Stop button — fills remaining space, centered */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-0">
        <button
          onClick={isTracking ? stop : start}
          className="relative flex items-center justify-center rounded-full font-semibold text-white transition-transform active:scale-95"
          style={{
            width: "clamp(100px, 28vw, 130px)",
            height: "clamp(100px, 28vw, 130px)",
            background: isTracking ? "var(--ios-red)" : "var(--ios-green)",
            boxShadow: isTracking
              ? "0 6px 24px rgba(255,59,48,0.35)"
              : "0 6px 24px rgba(52,199,89,0.35)",
          }}
          aria-label={isTracking ? "Arrêter le trajet" : "Démarrer le trajet"}
        >
          {isTracking ? (
            <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
              <rect x="9" y="9" width="18" height="18" rx="3" fill="white" />
            </svg>
          ) : (
            <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
              <path d="M13 9l18 9-18 9V9z" fill="white" />
            </svg>
          )}
        </button>
        <p
          className="text-xs font-medium mt-2"
          style={{ color: "var(--text-secondary)" }}
        >
          {isTracking ? "Appuyez pour arrêter" : "Appuyez pour démarrer"}
        </p>
      </div>
    </div>
  );
}
