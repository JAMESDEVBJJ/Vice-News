import { useMemo, useState } from "react"
import { ArrowRight } from "lucide-react"
import Header from "../../src/components/layout/Header"
import Footer from "../../src/components/layout/Footer"
import FeaturedNews from "../../src/components/news/FeaturedNews"
import SecondaryCard from "../../src/components/news/SecondaryCard"
import ColumnCard from "../../src/components/news/ColumnCard"
import NewsCard from "../../src/components/news/NewsCard"
import CategoryTabs from "../../src/components/news/CategoryTabs"
import GTASection from "../../src/components/gta/GTASection"
import GuideCard from "../../src/components/guides/GuideCard"
import SectionHeading from "../../src/components/ui/SectionHeading"
import {
  columnArticles,
  featuredArticle,
  guides,
  latestNews,
  secondaryArticles,
  type CategoryFilter,
} from "../data/mockNews"
import styles from "./Home.module.css"

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("TODAS")

  const filteredNews = useMemo(() => {
    if (activeCategory === "TODAS") return latestNews
    return latestNews.filter((n) => n.category === activeCategory)
  }, [activeCategory])

  return (
    <div className={styles.page}>
      <div aria-hidden className={styles.ambient} />

      <Header />

      <main className={styles.main}>
        <section aria-label="Destaques" className={styles.hero}>
          <div className={styles.heroMain}>
            <FeaturedNews article={featuredArticle} />
            <div className={styles.secondaryStack}>
              {secondaryArticles.map((article) => (
                <SecondaryCard key={article.id} article={article} />
              ))}
            </div>
          </div>

          <aside className={styles.aside}>
            <div className={styles.columnStack}>
              {columnArticles.map((article) => (
                <ColumnCard key={article.id} article={article} />
              ))}
            </div>
            <div className={styles.asideTabs}></div>
          </aside>
        </section>

        <section
          id="ultimas-noticias"
          aria-labelledby="ultimas-heading"
          className={styles.section}
        >
          <SectionHeading
            id="ultimas-heading"
            eyebrow="EDITORIAL"
            title="Últimas Notícias"
            action={
              <a href="#" className={styles.seeAll}>
                Ver tudo <ArrowRight size={15} />
              </a>
            }
          />

          {filteredNews.length > 0 ? (
            <div className={styles.cardGrid}>
              {filteredNews.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <p className={styles.empty}>
              Nenhuma notícia nesta categoria por enquanto.
            </p>
          )}

          <div className={styles.categorias}>
            <span className={styles.categoriasLabel}>CATEGORIAS</span>
            <CategoryTabs
              active={activeCategory}
              onChange={setActiveCategory}
              centered
            />
          </div>
        </section>

        <div className={styles.sectionPlain}>
          <GTASection />
        </div>

        <section
          id="guias"
          aria-labelledby="guias-heading"
          className={styles.section}
        >
          <SectionHeading
            id="guias-heading"
            eyebrow="APRENDA"
            title="Guias Essenciais"
          />
          <div className={styles.guidesGrid}>
            {guides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
