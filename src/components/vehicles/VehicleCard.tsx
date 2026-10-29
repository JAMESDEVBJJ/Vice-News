import type { CSSProperties } from "react";
import { ArrowRight, Users } from "lucide-react";
import {
  categoryById,
  type Vehicle,
  type VehicleStats,
  type VehicleStatus,
} from "../../data/vehiclesMock";
import styles from "./VehicleCard.module.css";

const STAT_LABELS: Record<keyof VehicleStats, string> = {
  speed: "Velocidade",
  acceleration: "Aceleração",
  braking: "Frenagem",
  handling: "Dirigibilidade",
};

const STAT_KEYS = Object.keys(STAT_LABELS) as (keyof VehicleStats)[];

const STATUS_LABELS: Record<VehicleStatus, string> = {
  trailer: "Visto nos trailers",
  "nao-confirmado": "Não confirmado",
};

const priceFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

interface VehicleCardProps {
  vehicle: Vehicle;
  /** Posição no grid: escalona a animação das barras. */
  index?: number;
  onSelect?: (vehicle: Vehicle) => void;
}

export default function VehicleCard({
  vehicle,
  index = 0,
  onSelect,
}: VehicleCardProps) {
  const { name, brand, category, tags, status, stats, price, seats, image } =
    vehicle;
  const { icon: CategoryIcon, label: categoryLabel } = categoryById[category];
  const delay = { "--delay": `${Math.min(index, 11) * 60}ms` } as CSSProperties;

  return (
    <article className={styles.card} style={delay}>
      <div className={styles.media}>
        {image ? (
          <img src={image} alt={name} loading="lazy" className={styles.image} />
        ) : (
          <div aria-hidden className={styles.placeholder}>
            <CategoryIcon
              size={64}
              strokeWidth={1}
              className={styles.placeholderIcon}
            />
          </div>
        )}

        <span
          className={`${styles.pill} ${styles.pillStatus} ${
            status === "trailer" ? styles.pillConfirmed : ""
          }`}
        >
          {STATUS_LABELS[status]}
        </span>
        <span className={`${styles.pill} ${styles.pillCategory}`}>
          <CategoryIcon size={12} aria-hidden />
          {categoryLabel}
        </span>
      </div>

      <div className={styles.body}>
        <div>
          <p className={`${styles.brand} ${brand ? "" : styles.brandPending}`}>
            {brand ?? "Fabricante a confirmar"}
          </p>
          <h3 className={styles.name}>{name}</h3>
        </div>

        <ul className={styles.tags} aria-label="Etiquetas">
          {tags.map((tag) => (
            <li key={tag} className={styles.tag}>
              {tag}
            </li>
          ))}
        </ul>

        <div className={styles.stats}>
          <div className={styles.statsHeader}>
            <p className={styles.statsTitle}>Desempenho</p>
            <span className={styles.statsNote}>ilustrativo</span>
          </div>
          <div className={styles.statsGrid}>
            {STAT_KEYS.map((key) => (
              <div key={key}>
                <span className={styles.statLabel}>{STAT_LABELS[key]}</span>
                <div
                  className={styles.track}
                  role="meter"
                  aria-label={STAT_LABELS[key]}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={stats[key]}
                >
                  <span
                    className={styles.fill}
                    style={{ width: `${stats[key]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.meta}>
            <span
              className={
                price === undefined ? styles.pricePending : styles.price
              }
            >
              {price === undefined
                ? "Preço a confirmar"
                : priceFormat.format(price)}
            </span>
            {seats !== undefined && (
              <span className={styles.seats}>
                <Users size={13} aria-hidden />
                {seats} {seats === 1 ? "lugar" : "lugares"}
              </span>
            )}
          </div>

          <button
            type="button"
            className={styles.details}
            onClick={() => onSelect?.(vehicle)}
          >
            Ver detalhes <ArrowRight size={15} aria-hidden />
          </button>
        </div>
      </div>
    </article>
  );
}
