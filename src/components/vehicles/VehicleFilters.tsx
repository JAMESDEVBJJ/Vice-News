import { useId } from "react";
import { Check, Search, X } from "lucide-react";
import { vehicleTags, type VehicleTag } from "../../data/vehiclesMock";
import styles from "./VehicleFilters.module.css";

interface VehicleFiltersProps {
  query: string;
  onQueryChange: (value: string) => void;
  activeTags: VehicleTag[];
  onToggleTag: (tag: VehicleTag) => void;
}

export default function VehicleFilters({
  query,
  onQueryChange,
  activeTags,
  onToggleTag,
}: VehicleFiltersProps) {
  const searchId = useId();

  return (
    <div className={styles.toolbar}>
      <div className={styles.search}>
        <label htmlFor={searchId} className={styles.srOnly}>
          Buscar veículo pelo nome
        </label>
        <Search size={18} aria-hidden className={styles.searchIcon} />
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Buscar veículo pelo nome"
          className={styles.input}
        />
        {query && (
          <button
            type="button"
            aria-label="Limpar busca"
            className={styles.clear}
            onClick={() => onQueryChange("")}
          >
            <X size={16} aria-hidden />
          </button>
        )}
      </div>

      <ul className={styles.tags} aria-label="Filtrar por etiqueta">
        {vehicleTags.map((tag) => {
          const isActive = activeTags.includes(tag);

          return (
            <li key={tag}>
              <button
                type="button"
                aria-pressed={isActive}
                className={`${styles.chip} ${
                  isActive ? styles.chipActive : ""
                }`}
                onClick={() => onToggleTag(tag)}
              >
                <span className={styles.box} aria-hidden>
                  <Check size={11} strokeWidth={3} />
                </span>
                {tag}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
