import type { NewsCategory } from "../../data/mockNews.ts"
import styles from "./CategoryBadge.module.css"

const CATEGORY_COLOR: Record<string, string> = {
  GAMEPLAY: "var(--color-neon-purple)",
  PERSONAGENS: "var(--color-neon-pink)",
  ROCKSTAR: "var(--color-neon-amber)",
  VAZAMENTOS: "var(--color-neon-magenta)",
  RUMORES: "var(--color-neon-pink)",
  DESTAQUE: "var(--color-neon-pink)",
  GUIA: "var(--color-neon-amber)",
}

interface CategoryBadgeProps {
  category: NewsCategory | string
  solid?: boolean
  className?: string
}

export default function CategoryBadge({
  category,
  solid,
  className = "",
}: CategoryBadgeProps) {
  const color = CATEGORY_COLOR[category] ?? "var(--color-neon-pink)"

  if (solid) {
    return (
      <span
        className={`${styles.solid} ${className}`}
        style={{ backgroundColor: color }}
      >
        {category}
      </span>
    )
  }

  return (
    <span className={`${styles.badge} ${className}`} style={{ color }}>
      {category}
    </span>
  )
}
