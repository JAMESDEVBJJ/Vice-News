import {
  vehicleCategories,
  type VehicleCategoryId,
} from "../../data/vehiclesMock";
import styles from "./CategoryNav.module.css";

interface CategoryNavProps {
  active: VehicleCategoryId | null;
  counts: Record<VehicleCategoryId, number>;
  onChange: (id: VehicleCategoryId | null) => void;
}

export default function CategoryNav({
  active,
  counts,
  onChange,
}: CategoryNavProps) {
  return (
    <nav aria-label="Categorias de veículos">
      <ul className={styles.list}>
        {vehicleCategories.map(({ id, label, icon: Icon, cover }) => {
          const isActive = id === active;
          const total = counts[id];

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
                  {cover ? (
                    <img
                      src={cover}
                      alt=""
                      loading="lazy"
                      className={styles.cover}
                    />
                  ) : (
                    <Icon
                      size={36}
                      strokeWidth={1.25}
                      className={styles.icon}
                      aria-hidden
                    />
                  )}
                </span>
                <span className={styles.info}>
                  <span className={styles.label}>{label}</span>
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
