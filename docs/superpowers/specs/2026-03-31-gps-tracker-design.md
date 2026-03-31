# GPS Car Trip Tracker PWA — Design Spec

**Date:** 2026-03-31
**Status:** Approved (user: "go")

---

## Overview

A Progressive Web App installable on iPhone that tracks car trips via GPS, stores them locally, and presents Apple-grade UI.

---

## Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js 15 (App Router, static export) | PWA-compatible, Vercel-deployable |
| Styling | Tailwind CSS v3 | Utility-first, fast iteration |
| Font | `system-ui` / SF Pro fallback | Native iOS font, zero download |
| Persistence | `localStorage` | No backend, works offline |
| GPS | `navigator.geolocation.watchPosition` | Web standard |
| Distance calc | Haversine formula | Accurate GPS distance |
| Screen sleep | WakeLock API | Prevent sleep during tracking |
| PWA | `next-pwa` + manifest | Home screen install on iPhone |

---

## Screens

### 1. Tracking (`/`)
- Large circular START button (red → green when active)
- Live distance counter (e.g. `3.42 km`)
- Elapsed timer (`00:14:32`)
- Pulsing GPS indicator when active
- STOP button ends trip and saves

### 2. Trips (`/trips`)
- Chronological list (newest first)
- Each row: date, duration, km, chevron
- Swipe-left or long-press → delete
- Select-all → bulk delete with confirmation
- Empty state illustration + CTA

### 3. Stats (`/stats`)
- Segment control: Day / Week / Month
- Total km, number of trips, avg km/trip
- Simple bar chart (CSS-only, no lib)

### 4. Settings (`/settings`)
- Reset all data (destructive, with confirmation)
- Export trips as CSV
- App version

### Navigation
- Bottom tab bar (iOS style): Track · Trips · Stats · Settings
- Safe-area insets for iPhone notch/home bar

---

## Data Model

```ts
interface Trip {
  id: string;           // crypto.randomUUID()
  startTime: number;    // Unix ms
  endTime: number;      // Unix ms
  distanceKm: number;   // rounded to 2 decimal places
  positions: Array<{
    lat: number;
    lng: number;
    ts: number;
  }>;
}
```

Stored as `JSON.stringify(Trip[])` under key `"gps_trips"` in localStorage.

---

## Design Language

- **Accent:** `#007AFF` (iOS blue)
- **Background:** `#FFFFFF` light / `#000000` dark
- **Secondary bg:** `#F2F2F7` light / `#1C1C1E` dark
- **Text primary:** `#000000` / `#FFFFFF`
- **Text secondary:** `#6E6E73`
- **Destructive:** `#FF3B30`
- **Success:** `#34C759`
- **Font:** `font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif`
- **Tap targets:** min 44×44px
- **Border radius:** 12px cards, 100px pills
- **Dark mode:** `prefers-color-scheme: dark` via Tailwind `dark:` classes

---

## PWA Config

- `manifest.json`: name, icons (192/512), `display: standalone`, `theme_color: #007AFF`
- Service worker via `next-pwa`: offline cache of app shell
- `viewport-fit=cover` meta for iPhone notch

---

## Error Handling

- GPS permission denied → friendly message with instructions to enable in iOS Settings
- GPS unavailable → graceful fallback, no crash
- localStorage full → catch + warn user

---

## Out of Scope

- Backend sync / cloud storage
- Maps/route visualization
- Authentication
- Multiple users
