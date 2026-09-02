import type { ReactNode } from "react";
import styles from "./SectionHeading.module.css";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
  id?: string;
}

export default function SectionHeading({ eyebrow, title, action, id }: SectionHeadingProps) {
  return (
    <div className={styles.header}>
      <div>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <h2 id={id} className={styles.title}>
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
