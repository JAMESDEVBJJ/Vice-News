import { CATEGORY_FILTERS, type CategoryFilter } from "../../data/mockNews.ts"
import styles from "./CategoryTabs.module.css";

interface CategoryTabsProps {
  active: CategoryFilter;
  onChange: (category: CategoryFilter) => void;
  centered?: boolean;
}

export default function CategoryTabs({ active, onChange, centered }: CategoryTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Filtrar notícias por categoria"
      className={`${styles.tablist} ${centered ? styles.centered : ""}`}
    >
      {CATEGORY_FILTERS.map((category) => {
        const isActive = category === active;
        return (
          <button
            key={category}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(category)}
            className={`${styles.tab} ${isActive ? styles.tabActive : styles.tabInactive}`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
