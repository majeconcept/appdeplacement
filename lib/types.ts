export interface GpsPosition {
  lat: number;
  lng: number;
  ts: number;
}

export interface Trip {
  id: string;
  startTime: number;
  endTime: number;
  distanceKm: number;
  positions: GpsPosition[];
}
