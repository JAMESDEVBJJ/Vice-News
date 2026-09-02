import { useState } from "react";
import { Link } from "react-router";
import { Menu, PenSquare, Search, X } from "lucide-react";
import Logo from "../brand/Logo";
import { isAdmin } from "../../lib/auth";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { label: "Notícias", href: "#ultimas-noticias" },
  { label: "GTA VI", href: "#gta-vi" },
  { label: "Guias", href: "#guias" },
  { label: "Sobre", href: "#sobre" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const admin = isAdmin();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Logo />

        <nav aria-label="Navegação principal" className={styles.nav}>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
              <span className={styles.navLinkUnderline} />
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          {admin && (
            <Link
              to="/admin/news/new"
              className={styles.postButton}
              aria-label="Postar novo artigo"
            >
              <PenSquare size={16} aria-hidden />
              <span>Postar Artigo</span>
            </Link>
          )}

          <label className={styles.search}>
            <Search size={16} aria-hidden />
            <input
              type="search"
              placeholder="Buscar"
              aria-label="Buscar no portal"
              className={styles.searchInput}
            />
          </label>

          <button
            type="button"
            aria-label="Buscar"
            className={`${styles.iconButton} ${styles.searchButton}`}
          >
            <Search size={18} />
          </button>

          <button
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className={`${styles.iconButton} ${styles.menuButton}`}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav aria-label="Navegação mobile" className={styles.mobileNav}>
          <ul className={styles.mobileList}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={styles.mobileLink}
                >
                  {link.label}
                </a>
              </li>
            ))}
            {admin && (
              <li>
                <Link
                  to="/admin/news/new"
                  onClick={() => setMenuOpen(false)}
                  className={`${styles.mobileLink} ${styles.mobilePost}`}
                >
                  <PenSquare size={17} aria-hidden />
                  Postar Artigo
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
