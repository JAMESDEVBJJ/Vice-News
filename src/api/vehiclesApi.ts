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

export type UpdateVehicleRequest = CreateVehicleRequest;

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

function isEmptyBody(value: unknown): value is undefined {
  return value === undefined || value === null;
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

export function getVehicleById(
  id: number,
  signal?: AbortSignal
): Promise<VehicleResponse> {
  return apiRequest(`/vehicles/${id}`, { signal, validate: isVehicleResponse });
}

export function updateVehicle(
  id: number,
  request: UpdateVehicleRequest,
  signal?: AbortSignal
): Promise<VehicleResponse> {
  return apiRequest(`/vehicles/${id}`, {
    method: "PUT",
    body: request,
    signal,
    validate: isVehicleResponse,
  });
}

export async function deleteVehicle(
  id: number,
  signal?: AbortSignal
): Promise<void> {
  await apiRequest(`/vehicles/${id}`, {
    method: "DELETE",
    signal,
    validate: isEmptyBody,
  });
}
