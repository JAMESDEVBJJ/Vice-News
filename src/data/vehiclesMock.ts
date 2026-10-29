import {
  Bike,
  Car,
  Layers,
  Plane,
  Sailboat,
  Truck,
  type LucideIcon,
} from "lucide-react";

export type VehicleCategoryId =
  | "carros"
  | "motos"
  | "barcos"
  | "aeronaves"
  | "caminhoes"
  | "outros";

export interface VehicleCategory {
  id: VehicleCategoryId;
  label: string;
  icon: LucideIcon;
  /** Foto de capa opcional (ex.: "/vehicles/covers/carros.webp"). Sem ela, o tile usa o ícone. */
  cover?: string;
}

export const vehicleCategories: VehicleCategory[] = [
  { id: "carros", label: "Carros", icon: Car },
  { id: "motos", label: "Motos", icon: Bike },
  { id: "barcos", label: "Barcos e Velas", icon: Sailboat },
  { id: "aeronaves", label: "Aviões e Helicópteros", icon: Plane },
  { id: "caminhoes", label: "Caminhões e Utilitários", icon: Truck },
  { id: "outros", label: "Outros", icon: Layers },
];

export const categoryById = Object.fromEntries(
  vehicleCategories.map((category) => [category.id, category])
) as Record<VehicleCategoryId, VehicleCategory>;

export const vehicleTags = [
  "Esportivo",
  "Luxo",
  "Clássico",
  "Off-road",
  "4 portas",
  "Serviço",
] as const;

export type VehicleTag = (typeof vehicleTags)[number];

/**
 * "trailer": tipo de veículo visto nos trailers oficiais (identificação feita pela comunidade).
 * "nao-confirmado": comum na série, mas ainda sem confirmação.
 */
export type VehicleStatus = "trailer" | "nao-confirmado";

/** Todas as notas vão de 0 a 100. */
export interface VehicleStats {
  speed: number;
  acceleration: number;
  braking: number;
  handling: number;
}

export interface Vehicle {
  id: string;
  name: string;
  /** Fabricante. Enquanto não for revelado, deixe vazio: o card mostra "Fabricante a confirmar". */
  brand?: string;
  category: VehicleCategoryId;
  tags: VehicleTag[];
  status: VehicleStatus;
  stats: VehicleStats;
  /** Preço em dólares. Sem valor, o card mostra "Preço a confirmar". */
  price?: number;
  seats?: number;
  /** Caminho em /public (ex.: "/vehicles/jet-ski.webp"). Sem imagem, o card usa um placeholder. */
  image?: string;
}

/**
 * ATENÇÃO: catálogo de exemplo, não são dados oficiais.
 * - Os nomes descrevem o tipo de veículo: a Rockstar não publicou uma lista oficial com nomes e fabricantes.
 * - stats e price são valores ilustrativos.
 */
export const vehicles: Vehicle[] = [
  {
    id: "supercarro-cupe",
    name: "Supercarro Cupê",
    category: "carros",
    tags: ["Esportivo", "Luxo"],
    status: "trailer",
    stats: { speed: 92, acceleration: 90, braking: 78, handling: 85 },
    price: 1450000,
    seats: 2,
  },
  {
    id: "muscle-car-classico",
    name: "Muscle Car Clássico",
    category: "carros",
    tags: ["Clássico", "Esportivo"],
    status: "trailer",
    stats: { speed: 80, acceleration: 82, braking: 55, handling: 52 },
    price: 385000,
    seats: 4,
  },
  {
    id: "moto-esportiva",
    name: "Moto Esportiva",
    category: "motos",
    tags: ["Esportivo"],
    status: "nao-confirmado",
    stats: { speed: 88, acceleration: 94, braking: 70, handling: 82 },
    price: 120000,
    seats: 2,
  },
  {
    id: "moto-de-trilha",
    name: "Moto de Trilha",
    category: "motos",
    tags: ["Off-road"],
    status: "trailer",
    stats: { speed: 62, acceleration: 80, braking: 60, handling: 78 },
    price: 18000,
    seats: 1,
  },
  {
    id: "jet-ski",
    name: "Jet Ski",
    category: "barcos",
    tags: ["Esportivo"],
    status: "trailer",
    stats: { speed: 55, acceleration: 85, braking: 35, handling: 72 },
    price: 48000,
    seats: 2,
  },
  {
    id: "lancha-esportiva",
    name: "Lancha Esportiva",
    category: "barcos",
    tags: ["Luxo", "Esportivo"],
    status: "nao-confirmado",
    stats: { speed: 76, acceleration: 70, braking: 40, handling: 60 },
    price: 650000,
    seats: 4,
  },
  {
    id: "helicoptero",
    name: "Helicóptero",
    category: "aeronaves",
    tags: ["Serviço"],
    status: "trailer",
    stats: { speed: 66, acceleration: 52, braking: 45, handling: 58 },
    seats: 4,
  },
  {
    id: "aeronave-leve",
    name: "Aeronave Leve",
    category: "aeronaves",
    tags: ["Clássico"],
    status: "nao-confirmado",
    stats: { speed: 74, acceleration: 50, braking: 40, handling: 55 },
    price: 450000,
    seats: 2,
  },
  {
    id: "picape-off-road",
    name: "Picape Off-Road",
    category: "caminhoes",
    tags: ["Off-road", "4 portas"],
    status: "trailer",
    stats: { speed: 60, acceleration: 58, braking: 50, handling: 62 },
    price: 95000,
    seats: 5,
  },
  {
    id: "cavalo-mecanico",
    name: "Cavalo Mecânico",
    category: "caminhoes",
    tags: ["Serviço"],
    status: "trailer",
    stats: { speed: 48, acceleration: 25, braking: 30, handling: 28 },
    seats: 2,
  },
  {
    id: "viatura-policial",
    name: "Viatura Policial",
    category: "outros",
    tags: ["Serviço", "4 portas"],
    status: "trailer",
    stats: { speed: 70, acceleration: 68, braking: 64, handling: 60 },
    seats: 4,
  },
  {
    id: "quadriciclo",
    name: "Quadriciclo",
    category: "outros",
    tags: ["Off-road"],
    status: "nao-confirmado",
    stats: { speed: 50, acceleration: 62, braking: 48, handling: 66 },
    price: 22000,
    seats: 1,
  },
];
