import { ArrowUpRight } from "lucide-react"
import type { NewsArticle } from "../../data/mockNews.ts"
import CategoryBadge from "../ui/CategoryBadge"
import ArticleMeta from "../ui/ArticleMeta"
import styles from "./FeaturedNews.module.css"

interface FeaturedNewsProps {
  article: NewsArticle
}

export default function FeaturedNews({ article }: FeaturedNewsProps) {
  return (
    <article className={styles.article}>
      <a href="#" className={styles.link}>
        <div className={styles.media}>
          {article.image && (
            <img
              src={article.image}
              alt={article.title}
              loading="eager"
              className={styles.image}
            />
          )}
          <div className={styles.overlayTop} />
          <div className={styles.overlayLeft} />

          <span className={styles.badge}></span>
        </div>

        <div className={styles.body}>
          <h2 className={styles.title}>{article.title}</h2>
          <p className={styles.summary}>{article.summary}</p>

          <div className={styles.footer}>
            <ArticleMeta
              author={article.author}
              publishedAt={article.publishedAt}
              readingTime={article.readingTime}
            />
            <span className={styles.cta}>
              Ler matéria <ArrowUpRight size={16} />
            </span>
          </div>
        </div>
      </a>
    </article>
  )
}
