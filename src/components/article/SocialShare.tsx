import { AtSign, MessageCircle, Send, Link2 } from "lucide-react"
import styles from "./SocialShare.module.css"

const LINKS = [
  { label: "Compartilhar no X", Icon: MessageCircle, href: "#" },
  { label: "Instagram", Icon: AtSign, href: "#" },
  { label: "Enviar", Icon: Send, href: "#" },
  { label: "Copiar link", Icon: Link2, href: "#" },
]

export default function SocialShare() {
  return (
    <div className={styles.wrap}>
      {LINKS.map(({ label, Icon, href }) => (
        <a
          key={label}
          href={href}
          className={styles.button}
          aria-label={label}
        >
          <Icon size={17} aria-hidden />
        </a>
      ))}
    </div>
  )
}
