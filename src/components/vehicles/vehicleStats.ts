import type { VehicleStatKey } from "../../api/vehiclesApi";

export const STATS: { key: VehicleStatKey; label: string }[] = [
  { key: "maxSpeed", label: "Velocidade" },
  { key: "acceleration", label: "Aceleração" },
  { key: "braking", label: "Frenagem" },
  { key: "handling", label: "Dirigibilidade" },
];

export const STAT_MAX = 100;

export function statPercent(value: number): number {
  return Math.min(STAT_MAX, Math.max(0, value));
}

export const priceFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
