export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? "https://localhost:7067/api";

export interface LookupItemResponse {
  id: number;
  name: string;
  slug: string;
}

export type ManufacturerResponse = LookupItemResponse;
export type VehicleCategoryResponse = LookupItemResponse;

export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function isLookupItem(value: unknown): value is LookupItemResponse {
  if (typeof value !== "object" || value === null) return false;

  const item = value as Record<string, unknown>;

  return typeof item.id === "number" && typeof item.name === "string";
}

async function getLookupList<T extends LookupItemResponse>(
  path: string,
  signal?: AbortSignal
): Promise<T[]> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new ApiError(
      `A API respondeu com status ${response.status}.`,
      response.status
    );
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data) || !data.every(isLookupItem)) {
    throw new ApiError("A API retornou dados em um formato inesperado.");
  }

  return data as T[];
}

export function getManufacturers(
  signal?: AbortSignal
): Promise<ManufacturerResponse[]> {
  return getLookupList<ManufacturerResponse>("/manufacturers", signal);
}

export function getVehicleCategories(
  signal?: AbortSignal
): Promise<VehicleCategoryResponse[]> {
  return getLookupList<VehicleCategoryResponse>("/vehicle-categories", signal);
}
