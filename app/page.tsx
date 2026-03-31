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
      className="flex flex-col items-center justify-between px-6 min-h-screen"
      style={{ paddingTop: "calc(env(safe-area-inset-top, 20px) + 20px)" }}
    >
      {/* Header */}
      <div className="w-full text-center pt-4">
        <h1
          className="text-2xl font-semibold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Mes Déplacements
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          {isTracking ? "Trajet en cours…" : "Prêt à démarrer"}
        </p>
      </div>

      {/* Main area */}
      <div className="flex flex-col items-center gap-10 flex-1 justify-center w-full">
        {/* GPS pulse indicator */}
        {isTracking && (
          <div className="relative flex items-center justify-center w-12 h-12">
            <div
              className="absolute w-10 h-10 rounded-full pulse-ring"
              style={{ background: "rgba(52,199,89,0.3)" }}
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: "var(--ios-green)" }}
            />
          </div>
        )}

        {/* Distance display */}
        <div className="text-center">
          <div
            className="font-bold tracking-tight tabular-nums"
            style={{
              fontSize: 72,
              lineHeight: 1,
              color: isTracking ? "var(--ios-green)" : "var(--text-primary)",
              transition: "color 0.4s ease",
            }}
          >
            {distanceKm.toFixed(2)}
          </div>
          <div
            className="text-2xl font-semibold mt-2"
            style={{ color: "var(--text-secondary)" }}
          >
            kilomètres
          </div>
        </div>

        {/* Timer */}
        {isTracking && (
          <div
            className="font-mono text-3xl font-light tabular-nums"
            style={{ color: "var(--text-secondary)" }}
          >
            {formatElapsed(elapsed)}
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="ios-card px-4 py-3 text-sm text-center max-w-xs"
            style={{ color: "var(--ios-red)", background: "rgba(255,59,48,0.08)" }}
          >
            {error}
          </div>
        )}
      </div>

      {/* Start / Stop button */}
      <div className="flex flex-col items-center gap-4 pb-10 w-full">
        <button
          onClick={isTracking ? stop : start}
          className="relative flex items-center justify-center rounded-full font-semibold text-white text-lg transition-transform active:scale-95"
          style={{
            width: 160,
            height: 160,
            background: isTracking ? "var(--ios-red)" : "var(--ios-green)",
            boxShadow: isTracking
              ? "0 8px 32px rgba(255,59,48,0.35)"
              : "0 8px 32px rgba(52,199,89,0.35)",
          }}
          aria-label={isTracking ? "Arrêter le trajet" : "Démarrer le trajet"}
        >
          {isTracking ? (
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect x="9" y="9" width="18" height="18" rx="3" fill="white" />
            </svg>
          ) : (
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M13 9l18 9-18 9V9z" fill="white" />
            </svg>
          )}
        </button>
        <p
          className="text-sm font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          {isTracking ? "Appuyez pour arrêter" : "Appuyez pour démarrer"}
        </p>
      </div>
    </div>
  );
}
