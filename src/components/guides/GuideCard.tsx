import { Clock } from "lucide-react";
import type { Guide } from "../../data/mockNews.ts"
import CategoryBadge from "../ui/CategoryBadge";
import { readingLabel } from "../../lib/format";
import styles from "./GuideCard.module.css";

interface GuideCardProps {
  guide: Guide;
}

export default function GuideCard({ guide }: GuideCardProps) {
  return (
    <article className={styles.card}>
      <a href="#" className={styles.link}>
        {guide.image && (
          <img
            src={guide.image}
            alt={guide.title}
            loading="lazy"
            className={styles.image}
          />
        )}
        <div className={styles.overlay} />
      </a>
      <div className={styles.body}>
        <CategoryBadge category={guide.category} />
        <h3 className={styles.title}>{guide.title}</h3>
        <span className={styles.time}>
          <Clock size={13} aria-hidden />
          {readingLabel(guide.readingTime)}
        </span>
      </div>
    </article>
  );
}
