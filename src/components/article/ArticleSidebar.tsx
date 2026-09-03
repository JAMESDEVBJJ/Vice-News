import { Tag } from "lucide-react"
import type { NewsArticle } from "../../data/mockNews";
import ColumnCard from "../news/ColumnCard"
import SocialShare from "./SocialShare"
import styles from "./ArticleSidebar.module.css"

interface ArticleSidebarProps {
  note: { label: string; text: string }
  related: NewsArticle
  tags: string[]
}

export default function ArticleSidebar({
  related,
  tags,
}: ArticleSidebarProps) {
  return (
    <aside className={styles.sidebar} aria-label="Conteúdo relacionado">
      <section className={styles.block}>
        <h2 className={styles.blockTitle}>Em alta</h2>
        <ColumnCard article={related} />
      </section>

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>
          <Tag size={13} aria-hidden />
          Tags
        </h2>
        <div className={styles.tags}>
          {tags.map((tag) => (
            <a key={tag} href="#" className={styles.tag}>
              {tag}
            </a>
          ))}
        </div>
      </section>

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>Compartilhar</h2>
        <SocialShare />
      </section>
    </aside>
  )
}
