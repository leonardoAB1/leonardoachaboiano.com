// Personal trips, hand-copied from checkMyTrip (no public API exists for it).
// One entry per flight leg - a round trip is two separate entries - mirroring
// exactly how checkMyTrip lists each flight, so adding a new one is a direct
// transcription of two airport coordinates.
//
// Purely decorative: rendered as dim, non-clickable arcs/points on the globe
// in GlobeVisualization.tsx. Never shown in the timeline UI, never translated.
//
// To add a leg, copy the [lat, lng] of the departure and arrival airports.
// Example - "Zurich (ZRH) -> Lisbon (LIS)":
//   { fromLat: 47.4647, fromLng: 8.5492, toLat: 38.7813, toLng: -9.1359 },
export interface TripLeg {
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
}

export const tripLegs: TripLeg[] = [];
