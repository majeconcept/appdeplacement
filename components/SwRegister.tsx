"use client";

import { useEffect } from "react";

export default function SwRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/appdeplacement/sw.js").catch(() => {});
    }
  }, []);
  return null;
}
