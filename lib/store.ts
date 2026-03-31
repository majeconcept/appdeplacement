import type { Trip } from "./types";

const KEY = "gps_trips";

export function getTrips(): Trip[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Trip[]) : [];
  } catch {
    return [];
  }
}

export function saveTrip(trip: Trip): void {
  const trips = getTrips();
  trips.unshift(trip); // newest first
  localStorage.setItem(KEY, JSON.stringify(trips));
}

export function deleteTrip(id: string): void {
  const trips = getTrips().filter((t) => t.id !== id);
  localStorage.setItem(KEY, JSON.stringify(trips));
}

export function deleteAllTrips(): void {
  localStorage.removeItem(KEY);
}
