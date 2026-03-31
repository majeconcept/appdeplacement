"use client";

import { useState, useEffect, useCallback } from "react";
import type { Trip } from "@/lib/types";
import { getTrips, saveTrip, deleteTrip, deleteAllTrips } from "@/lib/store";

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    setTrips(getTrips());
  }, []);

  const addTrip = useCallback((trip: Trip) => {
    saveTrip(trip);
    setTrips(getTrips());
  }, []);

  const removeTrip = useCallback((id: string) => {
    deleteTrip(id);
    setTrips(getTrips());
  }, []);

  const removeAll = useCallback(() => {
    deleteAllTrips();
    setTrips([]);
  }, []);

  const refresh = useCallback(() => {
    setTrips(getTrips());
  }, []);

  return { trips, addTrip, removeTrip, removeAll, refresh };
}
