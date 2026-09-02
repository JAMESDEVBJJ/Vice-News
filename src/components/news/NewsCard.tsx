import { Link } from "react-router"
import type { NewsArticle } from "../../data/mockNews.ts"
import CategoryBadge from "../ui/CategoryBadge"
import ArticleMeta from "../ui/ArticleMeta"
import styles from "./NewsCard.module.css"

interface NewsCardProps {
  article: NewsArticle
}

export default function NewsCard({ article }: NewsCardProps) {
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
          <div className={styles.mediaOverlay} />
        </div>

        <div className={styles.body}>
          <CategoryBadge category={article.category} />
          <h3 className={styles.title}>{article.title}</h3>
          <p className={styles.summary}>{article.summary}</p>
          <ArticleMeta
            className={styles.meta}
            author={article.author}
            readingTime={article.readingTime}
            compact
          />
        </div>
      </Link>
    </article>
  )
}
