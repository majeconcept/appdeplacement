"use client";

import { useTrips } from "@/hooks/useTrips";
import { useTracking } from "@/hooks/useTracking";
import { formatElapsed } from "@/lib/format";

export default function TrackingPage() {
  const { addTrip } = useTrips();
  const { isTracking, distanceKm, elapsed, error, start, stop } =
    useTracking(addTrip);

  return (
    <div className="flex flex-col items-center justify-center h-full px-5 gap-5">
      {/* Title + Distance */}
      <div className="flex flex-col items-center">
        <h1
          className="text-lg font-semibold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Mes Déplacements
        </h1>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
          {isTracking ? "Trajet en cours…" : "Prêt à démarrer"}
        </p>

        {isTracking && (
          <div className="relative flex items-center justify-center w-6 h-6 mt-3">
            <div
              className="absolute w-5 h-5 rounded-full pulse-ring"
              style={{ background: "rgba(52,199,89,0.3)" }}
            />
            <div className="w-2 h-2 rounded-full" style={{ background: "var(--ios-green)" }} />
          </div>
        )}

        <div
          className="font-bold tracking-tight tabular-nums mt-3"
          style={{
            fontSize: 48,
            lineHeight: 1,
            color: isTracking ? "var(--ios-green)" : "var(--text-primary)",
            transition: "color 0.4s ease",
          }}
        >
          {distanceKm.toFixed(2)}
        </div>
        <div className="text-sm font-semibold mt-1" style={{ color: "var(--text-secondary)" }}>
          kilomètres
        </div>

        {isTracking && (
          <div
            className="font-mono text-lg font-light tabular-nums mt-2"
            style={{ color: "var(--text-secondary)" }}
          >
            {formatElapsed(elapsed)}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          className="ios-card px-3 py-2 text-xs text-center max-w-[260px]"
          style={{ color: "var(--ios-red)", background: "rgba(255,59,48,0.08)" }}
        >
          {error}
        </div>
      )}

      {/* Start / Stop button */}
      <button
        onClick={isTracking ? stop : start}
        className="flex items-center justify-center rounded-full text-white transition-transform active:scale-95"
        style={{
          width: 100,
          height: 100,
          background: isTracking ? "var(--ios-red)" : "var(--ios-green)",
          boxShadow: isTracking
            ? "0 6px 24px rgba(255,59,48,0.35)"
            : "0 6px 24px rgba(52,199,89,0.35)",
        }}
        aria-label={isTracking ? "Arrêter le trajet" : "Démarrer le trajet"}
      >
        {isTracking ? (
          <svg width="24" height="24" viewBox="0 0 36 36" fill="none">
            <rect x="9" y="9" width="18" height="18" rx="3" fill="white" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 36 36" fill="none">
            <path d="M13 9l18 9-18 9V9z" fill="white" />
          </svg>
        )}
      </button>
      <p className="text-xs font-medium -mt-3" style={{ color: "var(--text-secondary)" }}>
        {isTracking ? "Appuyez pour arrêter" : "Appuyez pour démarrer"}
      </p>
    </div>
  );
}
