import { Car, CheckCircle2, Gamepad2, Map, Users, type LucideIcon } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import styles from "./GTASection.module.css";

interface GTAHub {
  label: string;
  icon: LucideIcon;
  href: string;
}

const HUBS: GTAHub[] = [
  { label: "MAPA", icon: Map, href: "#" },
  { label: "PERSONAGENS", icon: Users, href: "#" },
  { label: "VEÍCULOS", icon: Car, href: "#" },
  { label: "GAMEPLAY", icon: Gamepad2, href: "#" },
  { label: "TUDO CONFIRMADO", icon: CheckCircle2, href: "#" },
];

export default function GTASection() {
  return (
    <section id="gta-vi" aria-labelledby="gta-heading" className={styles.section}>
      <SectionHeading
        id="gta-heading"
        eyebrow="SEÇÃO GTA VI"
        title="Explore o mundo de GTA VI"
      />

      <ul className={styles.grid}>
        {HUBS.map(({ label, icon: Icon, href }) => (
          <li key={label}>
            <a href={href} className={styles.hub}>
              <span className={styles.icon}>
                <Icon size={22} strokeWidth={1.6} aria-hidden />
              </span>
              <span className={styles.label}>{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
