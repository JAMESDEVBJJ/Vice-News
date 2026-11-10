import { useSyncExternalStore } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  dismissToast,
  getToasts,
  subscribeToToasts,
  type ToastVariant,
} from "../../lib/toast";
import styles from "./Toaster.module.css";

const ICONS: Record<ToastVariant, LucideIcon> = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
};

export default function Toaster() {
  const toasts = useSyncExternalStore(subscribeToToasts, getToasts, getToasts);

  return (
    <section className={styles.viewport} aria-label="Notificações">
      {toasts.map(({ id, variant, title, description }) => {
        const Icon = ICONS[variant];

        return (
          <div
            key={id}
            role={variant === "error" ? "alert" : "status"}
            className={`${styles.toast} ${styles[variant]}`}
          >
            <Icon size={18} className={styles.icon} aria-hidden />
            <div className={styles.content}>
              <p className={styles.title}>{title}</p>
              {description && (
                <p className={styles.description}>{description}</p>
              )}
            </div>
            <button
              type="button"
              className={styles.close}
              onClick={() => dismissToast(id)}
              aria-label="Fechar notificação"
            >
              <X size={14} aria-hidden />
            </button>
          </div>
        );
      })}
    </section>
  );
}
