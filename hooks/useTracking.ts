"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { GpsPosition, Trip } from "@/lib/types";
import { haversine } from "@/lib/haversine";

interface TrackingState {
  isTracking: boolean;
  distanceKm: number;
  startTime: number | null;
  elapsed: number;
  error: string | null;
  positions: GpsPosition[];
}

const INITIAL: TrackingState = {
  isTracking: false,
  distanceKm: 0,
  startTime: null,
  elapsed: 0,
  error: null,
  positions: [],
};

export function useTracking(onTripComplete: (trip: Trip) => void) {
  const [state, setState] = useState<TrackingState>(INITIAL);
  const watchIdRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const positionsRef = useRef<GpsPosition[]>([]);
  const distanceRef = useRef(0);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release().catch(() => {});
      wakeLockRef.current = null;
    }
  };

  const start = useCallback(async () => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: "GPS non disponible sur cet appareil." }));
      return;
    }

    // Request WakeLock to prevent screen sleep
    if ("wakeLock" in navigator) {
      try {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
      } catch {
        // WakeLock not critical, continue
      }
    }

    positionsRef.current = [];
    distanceRef.current = 0;
    const startTime = Date.now();

    setState({
      isTracking: true,
      distanceKm: 0,
      startTime,
      elapsed: 0,
      error: null,
      positions: [],
    });

    // Elapsed timer
    timerRef.current = setInterval(() => {
      setState((s) => ({ ...s, elapsed: Date.now() - startTime }));
    }, 1000);

    // GPS watch
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const newPoint: GpsPosition = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          ts: Date.now(),
        };
        const prev = positionsRef.current[positionsRef.current.length - 1];
        if (prev) {
          distanceRef.current += haversine(
            prev.lat,
            prev.lng,
            newPoint.lat,
            newPoint.lng
          );
        }
        positionsRef.current = [...positionsRef.current, newPoint];
        const km = Math.round(distanceRef.current * 100) / 100;
        setState((s) => ({
          ...s,
          distanceKm: km,
          positions: positionsRef.current,
        }));
      },
      (err) => {
        let msg = "Erreur GPS.";
        if (err.code === 1)
          msg = "Accès au GPS refusé. Activez-le dans les réglages.";
        else if (err.code === 2) msg = "Position GPS indisponible.";
        setState((s) => ({ ...s, error: msg }));
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
    );
  }, []);

  const stop = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    clearTimer();
    releaseWakeLock();

    const endTime = Date.now();
    const trip: Trip = {
      id: crypto.randomUUID(),
      startTime: Date.now() - (state.elapsed || 0),
      endTime,
      distanceKm: Math.round(distanceRef.current * 100) / 100,
      positions: positionsRef.current,
    };

    if (positionsRef.current.length > 0) {
      onTripComplete(trip);
    }

    setState(INITIAL);
  }, [state.elapsed, onTripComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      clearTimer();
      releaseWakeLock();
    };
  }, []);

  return { ...state, start, stop };
}
