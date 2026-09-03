import { useMemo } from "react";
import { ImageOff, Tag } from "lucide-react";
import CategoryBadge from "../ui/CategoryBadge";
import ArticleMeta from "../ui/ArticleMeta";
import ContentBlock from "../article/ContentBlock";
import ArticleHighlight from "../article/ArticleHighlight";
import type { NewsFormData } from "../../data/newsForm";
import styles from "./ArticlePreview.module.css";

interface ArticlePreviewProps {
  data: NewsFormData;
  author: string;
}

function estimateReadingTime(data: NewsFormData): number {
  const words = data.content.reduce((total, block) => {
    let text = "";
    if (block.type === "paragraph" || block.type === "heading")
      text = block.text;
    else if (block.type === "highlight" || block.type === "quote")
      text = block.text;
    else if (block.type === "list") text = block.items.join(" ");
    return total + text.trim().split(/\s+/).filter(Boolean).length;
  }, 0);
  return Math.max(1, Math.round(words / 200));
}

export default function ArticlePreview({ data, author }: ArticlePreviewProps) {
  const readingTime = useMemo(() => estimateReadingTime(data), [data]);

  const today = new Date().toISOString().slice(0, 10);

  const hasNote = data.sidebarNote.text.trim().length > 0;

  return (
    <article className={styles.preview}>
      <header className={styles.header}>
        <CategoryBadge category={data.category} solid />
        <h1 className={styles.title}>
          {data.title || "Título da notícia aparecerá aqui"}
        </h1>
        {data.summary ? (
          <p className={styles.summary}>{data.summary}</p>
        ) : (
          <p className={`${styles.summary} ${styles.placeholder}`}>
            O resumo da notícia aparecerá aqui.
          </p>
        )}
        <ArticleMeta
          className={styles.meta}
          author={author}
          publishedAt={today}
          readingTime={readingTime}
        />
      </header>

      <figure className={styles.hero}>
        <div className={styles.heroMedia}>
          {data.heroImage ? (
            <img src={data.heroImage} alt={data.title} />
          ) : (
            <div className={styles.heroEmpty}>
              <ImageOff size={22} aria-hidden />
              <span>Imagem de capa</span>
            </div>
          )}
        </div>
        {data.heroCaption && (
          <figcaption className={styles.caption}>{data.heroCaption}</figcaption>
        )}
      </figure>

      <div className={styles.content}>
        {data.content.length > 0 ? (
          data.content.map((block, index) => (
            <ContentBlock key={index} block={block} />
          ))
        ) : (
          <p className={styles.emptyContent}>
            Adicione blocos de conteúdo para visualizá-los aqui.
          </p>
        )}
      </div>

      {(hasNote || data.tags.length > 0) && (
        <div className={styles.sidebar}>
          {hasNote && (
            <ArticleHighlight
              label={data.sidebarNote.label || "PONTO DESTAQUE"}
              text={data.sidebarNote.text}
              compact
            />
          )}
          {data.tags.length > 0 && (
            <div className={styles.tagList}>
              <Tag size={13} aria-hidden />
              {data.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
