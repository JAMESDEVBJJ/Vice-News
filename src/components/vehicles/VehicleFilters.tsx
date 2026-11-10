import { useId } from "react";
import { Check, Search, X } from "lucide-react";
import type { VehicleTagResponse } from "../../api/vehicleLookupsApi";
import styles from "./VehicleFilters.module.css";

interface VehicleFiltersProps {
  query: string;
  onQueryChange: (value: string) => void;
  /** Tags disponíveis para filtro. */
  tags: VehicleTagResponse[];
  /** Slugs das tags selecionadas. */
  activeTags: string[];
  onToggleTag: (slug: string) => void;
}

export default function VehicleFilters({
  query,
  onQueryChange,
  tags,
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

      {tags.length > 0 && (
        <ul className={styles.tags} aria-label="Filtrar por etiqueta">
          {tags.map(({ id, name, slug }) => {
            const isActive = activeTags.includes(slug);

            return (
              <li key={id}>
                <button
                  type="button"
                  aria-pressed={isActive}
                  className={`${styles.chip} ${
                    isActive ? styles.chipActive : ""
                  }`}
                  onClick={() => onToggleTag(slug)}
                >
                  <span className={styles.box} aria-hidden>
                    <Check size={11} strokeWidth={3} />
                  </span>
                  {name}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
