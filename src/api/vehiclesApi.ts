import { apiRequest } from "./httpClient";
import {
  isLookupItem,
  type ManufacturerResponse,
  type VehicleCategoryResponse,
  type VehicleTagResponse,
} from "./vehicleLookupsApi";

export interface VehicleResponse {
  id: number;
  name: string;
  slug: string;
  priceGta: number;
  description: string;
  imageUrl: string | null;
  maxSpeed: number;
  acceleration: number;
  braking: number;
  handling: number;
  createdAt: string;
  updatedAt: string;
  manufacturer: ManufacturerResponse;
  category: VehicleCategoryResponse;
  tags: VehicleTagResponse[];
}

export type VehicleStatKey =
  | "maxSpeed"
  | "acceleration"
  | "braking"
  | "handling";

export interface CreateVehicleRequest {
  name: string;
  manufacturerId: number;
  categoryId: number;
  priceGta: number;
  description: string;
  maxSpeed: number;
  acceleration: number;
  braking: number;
  handling: number;
  imageUrl: string | null;
  tags: string[];
}

function isVehicleResponse(value: unknown): value is VehicleResponse {
  if (typeof value !== "object" || value === null) return false;

  const vehicle = value as Record<string, unknown>;

  return (
    typeof vehicle.id === "number" &&
    typeof vehicle.name === "string" &&
    typeof vehicle.priceGta === "number" &&
    typeof vehicle.maxSpeed === "number" &&
    typeof vehicle.acceleration === "number" &&
    typeof vehicle.braking === "number" &&
    typeof vehicle.handling === "number" &&
    (vehicle.imageUrl === null || typeof vehicle.imageUrl === "string") &&
    isLookupItem(vehicle.manufacturer) &&
    isLookupItem(vehicle.category) &&
    Array.isArray(vehicle.tags) &&
    vehicle.tags.every(isLookupItem)
  );
}

function isVehicleList(value: unknown): value is VehicleResponse[] {
  return Array.isArray(value) && value.every(isVehicleResponse);
}

export function getVehicles(signal?: AbortSignal): Promise<VehicleResponse[]> {
  return apiRequest("/vehicles", { signal, validate: isVehicleList });
}

export function createVehicle(
  request: CreateVehicleRequest,
  signal?: AbortSignal
): Promise<VehicleResponse> {
  return apiRequest("/vehicles", {
    method: "POST",
    body: request,
    signal,
    validate: isVehicleResponse,
  });
}
