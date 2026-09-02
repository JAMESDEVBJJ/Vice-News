import styles from "./Logo.module.css";

interface LogoProps {
  showWordmark?: boolean;
  size?: "sm" | "md";
}

export default function Logo({ showWordmark = true, size = "md" }: LogoProps) {
  const markSize = size === "sm" ? styles.markSm : styles.markMd;

  return (
    <a
      href="/"
      className={styles.root}
      aria-label="Vice City Update — página inicial"
    >
      <span className={styles.markWrap}>
        <span aria-hidden className={styles.glow} />
        <span className={styles.markBox}>
          <span className={`${styles.mark} ${markSize}`}>VI</span>
        </span>
      </span>

      {showWordmark && (
        <span className={styles.wordmark}>
          <span className={styles.name}>VICE NEWS BR</span>
          <span className={styles.sub}>PORTAL BRASILEIRO DE GTA VI</span>
        </span>
      )}
    </a>
  );
}
