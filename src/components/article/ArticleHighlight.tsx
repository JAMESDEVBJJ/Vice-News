import { Sparkles } from "lucide-react"
import styles from "./ArticleHighlight.module.css"

interface ArticleHighlightProps {
  label?: string
  text: string
  compact?: boolean
}

export default function ArticleHighlight({
  label = "PONTO DESTAQUE",
  text,
  compact = false,
}: ArticleHighlightProps) {
  return (
    <aside className={`${styles.box} ${compact ? styles.compact : ""}`}>
      <span className={styles.label}>
        <Sparkles size={14} aria-hidden />
        {label}
      </span>
      <p className={styles.text}>{text}</p>
    </aside>
  )
}
