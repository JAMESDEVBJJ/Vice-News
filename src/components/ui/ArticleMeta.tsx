import { Calendar, Clock, User } from "lucide-react";
import { formatDate, readingLabel } from "../../lib/format";
import styles from "./ArticleMeta.module.css";

interface ArticleMetaProps {
  author?: string;
  publishedAt?: string;
  readingTime?: number;
  className?: string;
  compact?: boolean;
}

export default function ArticleMeta({
  author,
  publishedAt,
  readingTime,
  className = "",
  compact = false,
}: ArticleMetaProps) {
  const iconSize = 13;
  return (
    <div className={`${styles.meta} ${className}`}>
      {publishedAt && (
        <span className={styles.item}>
          {!compact && <Calendar size={iconSize} aria-hidden />}
          {formatDate(publishedAt)}
        </span>
      )}
      {author && (
        <span className={styles.item}>
          {!compact && <User size={iconSize} aria-hidden />}
          Por {author}
        </span>
      )}
      {readingTime != null && (
        <span className={styles.item}>
          {!compact && <Clock size={iconSize} aria-hidden />}
          {readingLabel(readingTime)}
        </span>
      )}
    </div>
  );
}
