import { useEffect } from "react"
import Header from "../../src/components/layout/Header"
import Footer from "../../src/components/layout/Footer"
import CategoryBadge from "../../src/components/ui/CategoryBadge"
import ArticleMeta from "../../src/components/ui/ArticleMeta"
import SectionHeading from "../../src/components/ui/SectionHeading"
import NewsCard from "../../src/components/news/NewsCard"
import Breadcrumb from "../../src/components/article/Breadcrumb"
import ContentBlock from "../../src/components/article/ContentBlock"
import ArticleSidebar from "../../src/components/article/ArticleSidebar"
import { article, relatedNews, sidebarHighlight } from "../data/article"
import styles from "./Article.module.css"

export default function Article() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className={styles.page}>
      <div aria-hidden className={styles.ambient} />

      <Header />

      <main className={styles.main}>
        <Breadcrumb
          items={[
            { label: "Início", to: "/" },
            { label: "Notícias", to: "/" },  
            { label: article.category },
          ]}
        />

        <div className={styles.layout}>
          <article className={styles.article}>
            <header className={styles.articleHeader}>
              <CategoryBadge category={article.category} solid />
              <h1 className={styles.title}>{article.title}</h1>
              <p className={styles.summary}>{article.summary}</p>
              <ArticleMeta
                className={styles.headerMeta}
                author={article.author}
                publishedAt={article.publishedAt}
                readingTime={article.readingTime}
              />
            </header>

            <figure className={styles.hero}>
              <div className={styles.heroMedia}>
                <img
                  src={article.heroImage}
                  alt={article.title}
                  className={styles.heroImage}
                />
              </div>
              {article.heroCaption && (
                <figcaption className={styles.caption}>
                  {article.heroCaption}
                </figcaption>
              )}
            </figure>

            <div className={styles.content}>
              {article.content.map((block, index) => (
                <ContentBlock key={index} block={block} />
              ))}
            </div>
          </article>

          <ArticleSidebar
            note={article.sidebarNote}
            related={sidebarHighlight}
            tags={article.tags}
          />
        </div>

        <section
          aria-labelledby="leia-tambem"
          className={styles.relatedSection}
        >
          <SectionHeading
            id="leia-tambem"
            eyebrow="CONTINUE LENDO"
            title="Leia Também"
          />
          <div className={styles.relatedGrid}>
            {relatedNews.map((news) => (
              <NewsCard key={news.id} article={news} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
