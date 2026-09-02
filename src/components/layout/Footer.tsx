import { AtSign, MessageCircle, Send } from "lucide-react";
import Logo from "../brand/Logo";
import styles from "./Footer.module.css";

const INSTITUTIONAL = [
  "Sobre Nós",
  "Contato",
  "Política de Privacidade",
  "Termos de Uso",
];

const SOCIALS = [
  { label: "X (Twitter)", icon: AtSign, href: "#" },
  { label: "Comunidade", icon: MessageCircle, href: "#" },
  { label: "Newsletter", icon: Send, href: "#" },
];

export default function Footer() {
  return (
    <footer id="sobre" className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <Logo size="sm" />

          <nav aria-label="Links institucionais">
            <ul className={styles.linkList}>
              {INSTITUTIONAL.map((label) => (
                <li key={label}>
                  <a href="#" className={styles.link}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.socials}>
            {SOCIALS.map(({ label, icon: Icon, href }) => (
              <a key={label} href={href} aria-label={label} className={styles.social}>
                <Icon size={17} aria-hidden />
              </a>
            ))}
          </div>
        </div>

        <p className={styles.copyright}>
          © 2026 Vice News BR. Todos os direitos reservados. Site de fãs e
          notícias, não afiliado à Rockstar Games. Conteúdo de demonstração —
          títulos e informações são fictícios.
        </p>
      </div>
    </footer>
  );
}
