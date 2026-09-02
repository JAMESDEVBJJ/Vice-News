import { Link } from "react-router"
import type { NewsArticle } from "../../data/mockNews.ts"
import CategoryBadge from "../ui/CategoryBadge"
import { formatDate } from "../../lib/format"
import styles from "./ColumnCard.module.css"

interface ColumnCardProps {
  article: NewsArticle
}

export default function ColumnCard({ article }: ColumnCardProps) {
  return (
    <article className={styles.card}>
      <Link to={`/noticia/${article.id}`} className={styles.link}>
        <div className={styles.media}>
          {article.image && (
            <img
              src={article.image}
              alt={article.title}
              loading="lazy"
              className={styles.image}
            />
          )}
        </div>
        <div className={styles.body}>
          <CategoryBadge category={article.category} />
          <h3 className={styles.title}>{article.title}</h3>
          <span className={styles.date}>{formatDate(article.publishedAt)}</span>
        </div>
      </Link>
    </article>
  )
}
