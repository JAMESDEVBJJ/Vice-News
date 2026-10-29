import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { Link } from "react-router";
import { Car, ChevronDown, PenSquare, type LucideIcon } from "lucide-react";
import styles from "./PublishMenu.module.css";

interface PublishOption {
  label: string;
  description: string;
  to: string;
  icon: LucideIcon;
}

export const PUBLISH_OPTIONS: PublishOption[] = [
  {
    label: "Artigo",
    description: "Escrever uma notícia ou matéria",
    to: "/admin/news/new",
    icon: PenSquare,
  },
  {
    label: "Veículo",
    description: "Cadastrar na base de dados",
    to: "/admin/vehicles/new",
    icon: Car,
  },
];

interface PublishMenuProps {
  className?: string;
}

export default function PublishMenu({ className }: PublishMenuProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const focusOnOpen = useRef<number | null>(null);

  const lastIndex = PUBLISH_OPTIONS.length - 1;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open && focusOnOpen.current !== null) {
      itemRefs.current[focusOnOpen.current]?.focus();
    }
    focusOnOpen.current = null;
  }, [open]);

  function close(returnFocus = false) {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }

  function openAndFocus(index: number) {
    focusOnOpen.current = index;
    setOpen(true);
  }

  function handleTriggerClick(e: MouseEvent<HTMLButtonElement>) {
    if (open) return close();
    if (e.detail === 0) focusOnOpen.current = 0;
    setOpen(true);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (!open) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        openAndFocus(0);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        openAndFocus(lastIndex);
      }
      return;
    }

    const current = itemRefs.current.indexOf(
      document.activeElement as HTMLAnchorElement
    );
    const focusItem = (i: number) => itemRefs.current[i]?.focus();

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        focusItem(current === lastIndex ? 0 : current + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        focusItem(current <= 0 ? lastIndex : current - 1);
        break;
      case "Home":
        e.preventDefault();
        focusItem(0);
        break;
      case "End":
        e.preventDefault();
        focusItem(lastIndex);
        break;
      case "Escape":
        e.preventDefault();
        close(true);
        break;
      case "Tab":
        close(true);
        break;
    }
  }

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${className ?? ""}`}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={handleTriggerClick}
      >
        <PenSquare size={16} aria-hidden />
        <span>Publicar</span>
        <ChevronDown size={15} className={styles.chevron} aria-hidden />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Publicar novo conteúdo"
          className={styles.menu}
        >
          {PUBLISH_OPTIONS.map(({ label, description, to, icon: Icon }, i) => (
            <Link
              key={to}
              to={to}
              role="menuitem"
              tabIndex={-1}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className={styles.item}
              onClick={() => setOpen(false)}
            >
              <span className={styles.itemIcon}>
                <Icon size={18} aria-hidden />
              </span>
              <span className={styles.itemText}>
                <span className={styles.itemLabel}>{label}</span>
                <span className={styles.itemDesc}>{description}</span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
