import {
  Bike,
  Car,
  Layers,
  Plane,
  Sailboat,
  Truck,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

/** Ícone de cada categoria pelo slug devolvido por GET /api/vehicle-categories. */
const ICONS_BY_SLUG: Record<string, LucideIcon> = {
  carros: Car,
  motos: Bike,
  barcos: Sailboat,
  aeronaves: Plane,
  caminhoes: Truck,
};

interface CategoryIconProps extends LucideProps {
  slug: string;
}

export default function CategoryIcon({ slug, ...props }: CategoryIconProps) {
  const Icon = ICONS_BY_SLUG[slug] ?? Layers;
  return <Icon {...props} />;
}
