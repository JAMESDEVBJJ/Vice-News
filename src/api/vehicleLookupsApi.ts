import { apiRequest } from "./httpClient";

/** Formato comum dos DTOs ManufacturerDto, VehicleCategoryDto e VehicleTagDto. */
export interface LookupItemResponse {
  id: number;
  name: string;
  slug: string;
}

export type ManufacturerResponse = LookupItemResponse;
export type VehicleCategoryResponse = LookupItemResponse;
export type VehicleTagResponse = LookupItemResponse;

export function isLookupItem(value: unknown): value is LookupItemResponse {
  if (typeof value !== "object" || value === null) return false;

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "number" &&
    typeof item.name === "string" &&
    typeof item.slug === "string"
  );
}

function isLookupList(value: unknown): value is LookupItemResponse[] {
  return Array.isArray(value) && value.every(isLookupItem);
}

export function getManufacturers(
  signal?: AbortSignal
): Promise<ManufacturerResponse[]> {
  return apiRequest("/manufacturers", { signal, validate: isLookupList });
}

export function getVehicleCategories(
  signal?: AbortSignal
): Promise<VehicleCategoryResponse[]> {
  return apiRequest("/vehicle-categories", { signal, validate: isLookupList });
}
