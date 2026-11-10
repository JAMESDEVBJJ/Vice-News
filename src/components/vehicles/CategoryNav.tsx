import type { VehicleCategoryResponse } from "../../api/vehicleLookupsApi";
import CategoryIcon from "./CategoryIcon";
import styles from "./CategoryNav.module.css";

interface CategoryNavProps {
  categories: VehicleCategoryResponse[];
  active: number | null;
  counts: Record<number, number>;
  onChange: (id: number | null) => void;
}

export default function CategoryNav({
  categories,
  active,
  counts,
  onChange,
}: CategoryNavProps) {
  return (
    <nav aria-label="Categorias de veículos">
      <ul className={styles.list}>
        {categories.map(({ id, name, slug }) => {
          const isActive = id === active;
          const total = counts[id] ?? 0;

          return (
            <li key={id}>
              <button
                type="button"
                aria-pressed={isActive}
                className={`${styles.tile} ${
                  isActive ? styles.tileActive : ""
                }`}
                onClick={() => onChange(isActive ? null : id)}
              >
                <span className={styles.visual}>
                  <CategoryIcon
                    slug={slug}
                    size={36}
                    strokeWidth={1.25}
                    className={styles.icon}
                    aria-hidden
                  />
                </span>
                <span className={styles.info}>
                  <span className={styles.label}>{name}</span>
                  <span className={styles.count}>
                    {total} {total === 1 ? "veículo" : "veículos"}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
