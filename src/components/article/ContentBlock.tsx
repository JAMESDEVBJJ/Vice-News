import type { ArticleBlock } from "../../../ViceNewsBR/data/article"
import ArticleHighlight from "./ArticleHighlight"
import styles from "./ContentBlock.module.css"

/**
 * Renderiza um único ArticleBlock.
 * Compartilhado entre a página pública de notícia e o preview do editor,
 * garantindo que os dois usem exatamente a mesma lógica visual.
 */
export default function ContentBlock({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p className={styles.paragraph}>{block.text}</p>
    case "heading":
      return <h2 className={styles.subheading}>{block.text}</h2>
    case "highlight":
      return <ArticleHighlight label={block.label} text={block.text} />
    case "list":
      return (
        <ul className={styles.list}>
          {block.items.map((item, i) => (
            <li key={i} className={styles.listItem}>
              {item}
            </li>
          ))}
        </ul>
      )
    case "quote":
      return (
        <blockquote className={styles.quote}>
          <p className={styles.quoteText}>{block.text}</p>
          {block.cite && <cite className={styles.quoteCite}>{block.cite}</cite>}
        </blockquote>
      )
    case "image":
      return (
        <figure className={styles.figure}>
          <div className={styles.figureMedia}>
            {block.src && (
              <img src={block.src} alt={block.alt} loading="lazy" />
            )}
          </div>
          {block.caption && (
            <figcaption className={styles.caption}>{block.caption}</figcaption>
          )}
        </figure>
      )
    case "gallery":
      return (
        <div className={styles.gallery}>
          {block.images.map((image, i) => (
            <figure key={i} className={styles.galleryItem}>
              {image.src && (
                <img src={image.src} alt={image.alt} loading="lazy" />
              )}
            </figure>
          ))}
        </div>
      )
    default:
      return null
  }
}
