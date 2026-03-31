"use client";

import { useState } from "react";
import { useTrips } from "@/hooks/useTrips";
import { formatKm } from "@/lib/format";

export default function SettingsPage() {
  const { trips, removeAll } = useTrips();
  const [confirmReset, setConfirmReset] = useState(false);

  const totalKm = trips.reduce((a, t) => a + t.distanceKm, 0);

  const exportCSV = () => {
    const header = "id,date,distance_km,duration_s\n";
    const rows = trips
      .map(
        (t) =>
          `${t.id},${new Date(t.startTime).toISOString()},${t.distanceKm},${Math.round(
            (t.endTime - t.startTime) / 1000
          )}`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trajets-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
        <div className="px-4 h-14 flex items-center">
          <h1
            className="text-xl font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Réglages
          </h1>
        </div>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-6">
        {/* Summary card */}
        <div className="ios-card p-4 flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--ios-blue)" }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M14 3C8.48 3 4 7.48 4 13c0 6.63 10 18 10 18s10-11.37 10-18c0-5.52-4.48-10-10-10z"
                fill="white"
              />
              <circle cx="14" cy="13" r="3.5" fill="var(--ios-blue)" />
            </svg>
          </div>
          <div>
            <p
              className="text-base font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Mes Déplacements
            </p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {trips.length} trajet{trips.length !== 1 ? "s" : ""} ·{" "}
              {formatKm(totalKm)} parcourus
            </p>
          </div>
        </div>

        {/* Data section */}
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-wide px-1 mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Données
          </p>
          <div className="ios-card">
            <SettingsRow
              icon="📤"
              label="Exporter en CSV"
              color="var(--ios-blue)"
              onPress={exportCSV}
              disabled={trips.length === 0}
            />
            <div
              className="h-px ml-14"
              style={{ background: "var(--separator)" }}
            />
            <SettingsRow
              icon="🗑️"
              label="Réinitialiser les données"
              color="var(--ios-red)"
              onPress={() => setConfirmReset(true)}
              disabled={trips.length === 0}
              destructive
            />
          </div>
        </div>

        {/* App section */}
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-wide px-1 mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Application
          </p>
          <div className="ios-card">
            <div className="flex items-center px-4 py-3 gap-4">
              <span className="text-xl w-8 text-center">ℹ️</span>
              <div className="flex-1">
                <p
                  className="text-base font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Version
                </p>
              </div>
              <span
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                1.0.0
              </span>
            </div>
            <div
              className="h-px ml-14"
              style={{ background: "var(--separator)" }}
            />
            <div className="flex items-center px-4 py-3 gap-4">
              <span className="text-xl w-8 text-center">🔒</span>
              <div className="flex-1">
                <p
                  className="text-base font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  Données stockées localement
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Aucune donnée envoyée sur internet
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm reset modal */}
      {confirmReset && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={() => setConfirmReset(false)}
        >
          <div
            className="w-full max-w-sm rounded-t-2xl p-6 flex flex-col gap-4"
            style={{
              background: "var(--bg-tertiary)",
              paddingBottom:
                "calc(24px + env(safe-area-inset-bottom, 0px))",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <p
                className="font-semibold text-lg"
                style={{ color: "var(--text-primary)" }}
              >
                Réinitialiser toutes les données ?
              </p>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--text-secondary)" }}
              >
                {trips.length} trajet{trips.length !== 1 ? "s" : ""} et{" "}
                {formatKm(totalKm)} seront supprimés. Irréversible.
              </p>
            </div>
            <button
              onClick={() => {
                removeAll();
                setConfirmReset(false);
              }}
              className="w-full py-3 rounded-xl font-semibold text-white"
              style={{ background: "var(--ios-red)" }}
            >
              Réinitialiser
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="w-full py-3 rounded-xl font-semibold"
              style={{
                background: "var(--bg-secondary)",
                color: "var(--ios-blue)",
              }}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsRow({
  icon,
  label,
  color,
  onPress,
  disabled,
  destructive,
}: {
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
  disabled?: boolean;
  destructive?: boolean;
}) {
  return (
    <button
      onClick={onPress}
      disabled={disabled}
      className="flex items-center px-4 py-3 gap-4 w-full text-left disabled:opacity-40 active:opacity-60"
    >
      <span className="text-xl w-8 text-center">{icon}</span>
      <p
        className="flex-1 text-base font-medium"
        style={{ color: destructive ? color : "var(--text-primary)" }}
      >
        {label}
      </p>
      {!destructive && (
        <svg
          width="7"
          height="12"
          viewBox="0 0 7 12"
          fill="none"
          style={{ opacity: 0.3 }}
        >
          <path
            d="M1 1l5 5-5 5"
            stroke="var(--text-primary)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
