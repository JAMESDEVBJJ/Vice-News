import { useState, type CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import type { VehicleResponse, VehicleStatKey } from "../../api/vehiclesApi";
import CategoryIcon from "./CategoryIcon";
import styles from "./VehicleCard.module.css";

const STATS: { key: VehicleStatKey; label: string }[] = [
  { key: "maxSpeed", label: "Velocidade" },
  { key: "acceleration", label: "Aceleração" },
  { key: "braking", label: "Frenagem" },
  { key: "handling", label: "Dirigibilidade" },
];

const priceFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

interface VehicleCardProps {
  vehicle: VehicleResponse;
  /** Posição no grid: escalona a animação das barras. */
  index?: number;
  onSelect?: (vehicle: VehicleResponse) => void;
}

export default function VehicleCard({
  vehicle,
  index = 0,
  onSelect,
}: VehicleCardProps) {
  const { name, manufacturer, category, tags, priceGta, imageUrl } = vehicle;
  const delay = { "--delay": `${Math.min(index, 11) * 60}ms` } as CSSProperties;

  // URLs externas podem falhar: nesse caso o card volta ao placeholder.
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const showImage = Boolean(imageUrl) && failedImage !== imageUrl;

  return (
    <article className={styles.card} style={delay}>
      <div className={styles.media}>
        {showImage && imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className={styles.image}
            onError={() => setFailedImage(imageUrl)}
          />
        ) : (
          <div aria-hidden className={styles.placeholder}>
            <CategoryIcon
              slug={category.slug}
              size={64}
              strokeWidth={1}
              className={styles.placeholderIcon}
            />
          </div>
        )}

        <span className={`${styles.pill} ${styles.pillCategory}`}>
          <CategoryIcon slug={category.slug} size={12} aria-hidden />
          {category.name}
        </span>
      </div>

      <div className={styles.body}>
        <div>
          <p className={styles.brand}>{manufacturer.name}</p>
          <h3 className={styles.name}>{name}</h3>
        </div>

        {tags.length > 0 && (
          <ul className={styles.tags} aria-label="Etiquetas">
            {tags.map((tag) => (
              <li key={tag.id} className={styles.tag}>
                {tag.name}
              </li>
            ))}
          </ul>
        )}

        <div className={styles.stats}>
          <div className={styles.statsHeader}>
            <p className={styles.statsTitle}>Desempenho</p>
            <span className={styles.statsNote}>ilustrativo</span>
          </div>
          <div className={styles.statsGrid}>
            {STATS.map(({ key, label }) => (
              <div key={key}>
                <span className={styles.statLabel}>{label}</span>
                <div
                  className={styles.track}
                  role="meter"
                  aria-label={label}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={vehicle[key]}
                >
                  <span
                    className={styles.fill}
                    style={{ width: `${vehicle[key]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.meta}>
            <span className={styles.price}>{priceFormat.format(priceGta)}</span>
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
