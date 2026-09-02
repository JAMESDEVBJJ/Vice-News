import type { NewsArticle } from "../../data/mockNews.ts"
import CategoryBadge from "../ui/CategoryBadge"
import ArticleMeta from "../ui/ArticleMeta"
import styles from "./SecondaryCard.module.css"

interface SecondaryCardProps {
  article: NewsArticle
}

/** Card horizontal usado ao lado do destaque principal. */
export default function SecondaryCard({ article }: SecondaryCardProps) {
  return (
    <article className={styles.card}>
      <a href="#" className={styles.link}>
        <div className={styles.media}>
          {article.image && (
            <img
              src={article.image}
              alt={article.title}
              loading="lazy"
              className={styles.image}
            />
          )}
          <div className={styles.mediaOverlay} />
        </div>
        <div className={styles.body}>
          <CategoryBadge category={article.category} />
          <h3 className={styles.title}>{article.title}</h3>
          <ArticleMeta
            className={styles.meta}
            author={article.author}
            publishedAt={article.publishedAt}
            compact
          />
        </div>
      </a>
    </article>
  )
}
