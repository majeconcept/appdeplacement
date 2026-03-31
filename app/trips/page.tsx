"use client";

import { useState } from "react";
import { useTrips } from "@/hooks/useTrips";
import { formatKm, formatDuration, formatDate } from "@/lib/format";
import type { Trip } from "@/lib/types";

export default function TripsPage() {
  const { trips, removeTrip, removeAll } = useTrips();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmAll, setConfirmAll] = useState(false);
  const [selecting, setSelecting] = useState(false);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const deleteSelected = () => {
    selected.forEach((id) => removeTrip(id));
    setSelected(new Set());
    setSelecting(false);
  };

  const handleDeleteAll = () => {
    removeAll();
    setConfirmAll(false);
    setSelecting(false);
    setSelected(new Set());
  };

  return (
    <div
      className="min-h-screen"
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
            Trajets
          </h1>
          <div className="flex items-center gap-4">
            {trips.length > 0 && (
              <button
                onClick={() => {
                  setSelecting(!selecting);
                  setSelected(new Set());
                }}
                className="text-sm font-medium"
                style={{ color: "var(--ios-blue)" }}
              >
                {selecting ? "Annuler" : "Sélect."}
              </button>
            )}
            {trips.length > 0 && !selecting && (
              <button
                onClick={() => setConfirmAll(true)}
                className="text-sm font-medium"
                style={{ color: "var(--ios-red)" }}
              >
                Tout effacer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        {trips.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="ios-card mb-4">
              {trips.map((trip, idx) => (
                <TripRow
                  key={trip.id}
                  trip={trip}
                  isLast={idx === trips.length - 1}
                  selecting={selecting}
                  checked={selected.has(trip.id)}
                  onToggle={() => toggleSelect(trip.id)}
                  onDelete={() => removeTrip(trip.id)}
                />
              ))}
            </div>

            {/* Total */}
            <div
              className="text-center text-sm pb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              {trips.length} trajet{trips.length > 1 ? "s" : ""} —{" "}
              {formatKm(trips.reduce((a, t) => a + t.distanceKm, 0))} au total
            </div>
          </>
        )}
      </div>

      {/* Floating delete button when selecting */}
      {selecting && selected.size > 0 && (
        <div className="fixed bottom-24 left-0 right-0 flex justify-center px-6">
          <button
            onClick={deleteSelected}
            className="rounded-full px-6 py-3 font-semibold text-white shadow-lg"
            style={{ background: "var(--ios-red)" }}
          >
            Supprimer {selected.size} trajet{selected.size > 1 ? "s" : ""}
          </button>
        </div>
      )}

      {/* Confirm delete all modal */}
      {confirmAll && (
        <ConfirmModal
          message="Supprimer tous les trajets ?"
          detail="Cette action est irréversible."
          onCancel={() => setConfirmAll(false)}
          onConfirm={handleDeleteAll}
        />
      )}
    </div>
  );
}

function TripRow({
  trip,
  isLast,
  selecting,
  checked,
  onToggle,
  onDelete,
}: {
  trip: Trip;
  isLast: boolean;
  selecting: boolean;
  checked: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div
      className="relative overflow-hidden"
      onTouchStart={() => setShowDelete(false)}
    >
      <div
        className={`flex items-center px-4 py-3 gap-3 transition-transform ${
          showDelete ? "-translate-x-20" : "translate-x-0"
        }`}
        style={{ background: "var(--bg-tertiary)" }}
        onClick={selecting ? onToggle : () => setShowDelete(!showDelete)}
      >
        {/* Checkbox */}
        {selecting && (
          <div
            className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
            style={{
              background: checked ? "var(--ios-blue)" : "transparent",
              borderColor: checked ? "var(--ios-blue)" : "var(--ios-gray3)",
            }}
          >
            {checked && (
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                <path
                  d="M1 5l3.5 3.5L11 1"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        )}

        {/* Icon */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(0,122,255,0.12)" }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 2C6.24 2 4 4.24 4 7c0 4.25 5 9 5 9s5-4.75 5-9c0-2.76-2.24-5-5-5z"
              fill="var(--ios-blue)"
            />
            <circle cx="9" cy="7" r="2" fill="white" />
          </svg>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div
            className="font-semibold text-base"
            style={{ color: "var(--text-primary)" }}
          >
            {formatKm(trip.distanceKm)}
          </div>
          <div
            className="text-xs mt-0.5"
            style={{ color: "var(--text-secondary)" }}
          >
            {formatDate(trip.startTime)} · {formatDuration(trip.startTime, trip.endTime)}
          </div>
        </div>

        {/* Chevron */}
        {!selecting && (
          <svg
            width="7"
            height="12"
            viewBox="0 0 7 12"
            fill="none"
            style={{ opacity: 0.3, flexShrink: 0 }}
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
      </div>

      {/* Swipe delete button */}
      {!selecting && showDelete && (
        <button
          onClick={onDelete}
          className="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-center font-semibold text-sm text-white"
          style={{ background: "var(--ios-red)" }}
        >
          Suppr.
        </button>
      )}

      {!isLast && (
        <div
          className="h-px ml-16"
          style={{ background: "var(--separator)" }}
        />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ background: "var(--bg-tertiary)" }}
      >
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path
            d="M18 4C11.37 4 6 9.37 6 16c0 8.5 12 20 12 20s12-11.5 12-20c0-6.63-5.37-12-12-12z"
            fill="var(--ios-gray4)"
          />
          <circle cx="18" cy="16" r="4" fill="white" />
        </svg>
      </div>
      <p
        className="text-lg font-semibold"
        style={{ color: "var(--text-primary)" }}
      >
        Aucun trajet
      </p>
      <p
        className="text-sm text-center max-w-xs"
        style={{ color: "var(--text-secondary)" }}
      >
        Démarrez votre premier trajet depuis l&apos;onglet Trajet.
      </p>
    </div>
  );
}

function ConfirmModal({
  message,
  detail,
  onCancel,
  onConfirm,
}: {
  message: string;
  detail: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-t-2xl p-6 pb-8 flex flex-col gap-4"
        style={{
          background: "var(--bg-tertiary)",
          paddingBottom: "calc(24px + env(safe-area-inset-bottom, 0px))",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <p
            className="font-semibold text-lg"
            style={{ color: "var(--text-primary)" }}
          >
            {message}
          </p>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            {detail}
          </p>
        </div>
        <button
          onClick={onConfirm}
          className="w-full py-3 rounded-xl font-semibold text-white"
          style={{ background: "var(--ios-red)" }}
        >
          Supprimer
        </button>
        <button
          onClick={onCancel}
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
  );
}
