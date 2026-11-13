import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import type { VehicleResponse } from "../../api/vehiclesApi";
import { useStatReveal } from "../../hooks/useStatReveal";
import { isAdmin } from "../../lib/auth";
import CategoryIcon from "./CategoryIcon";
import { STAT_MAX, STATS, priceFormat, statPercent } from "./vehicleStats";
import styles from "./VehicleDetailsModal.module.css";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function useBodyScrollLock() {
  useEffect(() => {
    const { body, documentElement } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, []);
}

function useInitialFocus(initialFocusRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    initialFocusRef.current?.focus();

    return () => {
      if (opener?.isConnected) opener.focus();
    };
  }, [initialFocusRef]);
}

function useDialogKeyboard(
  dialogRef: RefObject<HTMLElement | null>,
  onClose: () => void
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      );

      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const outside = !dialog.contains(active);

      if (event.shiftKey && (active === first || outside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || outside)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dialogRef, onClose]);
}

interface VehicleDetailsModalProps {
  vehicle: VehicleResponse;
  onClose: () => void;
}

export default function VehicleDetailsModal({
  vehicle,
  onClose,
}: VehicleDetailsModalProps) {
  const {
    name,
    manufacturer,
    category,
    tags,
    description,
    priceGta,
    imageUrl,
  } = vehicle;

  const brandId = useId();
  const titleId = useId();
  const statsTitleId = useId();
  const adminTitleId = useId();

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const collapseButtonRef = useRef<HTMLButtonElement>(null);
  const reopenButtonRef = useRef<HTMLButtonElement>(null);
  const pressedBackdrop = useRef(false);
  const adminToggled = useRef(false);

  const canManage = isAdmin();
  const [adminOpen, setAdminOpen] = useState(false);

  const [failedImage, setFailedImage] = useState<string | null>(null);
  const showImage = Boolean(imageUrl) && failedImage !== imageUrl;

  const statValues = useStatReveal(STATS.map(({ key }) => vehicle[key]));

  useBodyScrollLock();
  useInitialFocus(closeButtonRef);
  useDialogKeyboard(dialogRef, onClose);

  useEffect(() => {
    if (!adminToggled.current) return;
    (adminOpen ? collapseButtonRef : reopenButtonRef).current?.focus();
  }, [adminOpen]);

  const toggleAdminPanel = (open: boolean) => {
    adminToggled.current = true;
    setAdminOpen(open);
  };

  return createPortal(
    <div
      className={styles.backdrop}
      onPointerDown={(event) => {
        pressedBackdrop.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (pressedBackdrop.current && event.target === event.currentTarget) {
          onClose();
        }
        pressedBackdrop.current = false;
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${brandId} ${titleId}`}
        tabIndex={-1}
        className={styles.dialog}
      >
        <div className={styles.closeBar}>
          <button
            ref={closeButtonRef}
            type="button"
            className={styles.close}
            aria-label="Fechar detalhes do veículo"
            onClick={onClose}
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        <article className={styles.card}>
          <div className={styles.media}>
            {showImage && imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                decoding="async"
                referrerPolicy="no-referrer"
                className={styles.image}
                onError={() => setFailedImage(imageUrl)}
              />
            ) : (
              <div aria-hidden className={styles.placeholder}>
                <CategoryIcon
                  slug={category.slug}
                  size={88}
                  strokeWidth={1}
                  className={styles.placeholderIcon}
                />
              </div>
            )}
          </div>

          <div className={styles.content}>
            <div className={styles.main}>
              <div className={styles.heading}>
                <p id={brandId} className={styles.brand}>
                  {manufacturer.name}
                </p>
                <h2 id={titleId} className={styles.name}>
                  {name}
                </h2>
              </div>

              <span className={styles.category}>
                <CategoryIcon slug={category.slug} size={14} aria-hidden />
                {category.name}
              </span>

              {tags.length > 0 && (
                <ul className={styles.tags} aria-label="Etiquetas">
                  {tags.map((tag) => (
                    <li key={tag.id} className={styles.tag}>
                      {tag.name}
                    </li>
                  ))}
                </ul>
              )}

              {description.trim() !== "" && (
                <p className={styles.description}>{description}</p>
              )}

              <div className={styles.price}>
                <span className={styles.priceLabel}>Preço</span>
                <span className={styles.priceValue}>
                  {priceFormat.format(priceGta)}
                </span>
              </div>
            </div>

            <aside
              className={styles.performance}
              aria-labelledby={statsTitleId}
            >
              <div className={styles.statsHeader}>
                <h3 id={statsTitleId} className={styles.statsTitle}>
                  Desempenho
                </h3>
                <span className={styles.statsNote}>ilustrativo</span>
              </div>

              <ul className={styles.statsList}>
                {STATS.map(({ key, label }, index) => {
                  const current = statValues[index];

                  return (
                    <li key={key}>
                      <div className={styles.statRow}>
                        <span className={styles.statLabel}>{label}</span>
                        <span aria-hidden className={styles.statValue}>
                          {current}
                        </span>
                      </div>
                      <div
                        className={styles.track}
                        role="meter"
                        aria-label={label}
                        aria-valuemin={0}
                        aria-valuemax={STAT_MAX}
                        aria-valuenow={vehicle[key]}
                      >
                        <span
                          className={styles.fill}
                          style={{ width: `${statPercent(current)}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>

              <p className={styles.footnote}>
                Desempenho e preços são valores ilustrativos e não representam
                estatísticas oficiais do jogo.
              </p>
            </aside>
          </div>
        </article>

        {canManage && adminOpen && (
          <section className={styles.admin} aria-labelledby={adminTitleId}>
            <div className={styles.adminHeader}>
              <ShieldCheck size={15} aria-hidden />
              <h3 id={adminTitleId} className={styles.adminTitle}>
                Ações administrativas
              </h3>
              <span className={styles.adminHint}>Somente administradores</span>
            </div>

            <div className={styles.adminActions}>
              <button
                type="button"
                className={`${styles.adminAction} ${styles.adminEdit}`}
                disabled
              >
                <Pencil size={15} aria-hidden />
                <span>Editar veículo</span>
                <span className={styles.soon}>Em breve</span>
              </button>
              <button
                type="button"
                className={`${styles.adminAction} ${styles.adminDelete}`}
                disabled
              >
                <Trash2 size={15} aria-hidden />
                <span>Excluir veículo</span>
                <span className={styles.soon}>Em breve</span>
              </button>
            </div>

            <button
              ref={collapseButtonRef}
              type="button"
              className={styles.adminCollapse}
              onClick={() => toggleAdminPanel(false)}
            >
              <ChevronUp size={14} aria-hidden />
              Recolher painel
            </button>
          </section>
        )}

        {canManage && !adminOpen && (
          <button
            ref={reopenButtonRef}
            type="button"
            className={styles.adminReopen}
            onClick={() => toggleAdminPanel(true)}
          >
            <ShieldCheck size={14} aria-hidden />
            Ações administrativas
            <ChevronDown size={14} aria-hidden />
          </button>
        )}
      </div>
    </div>,
    document.body
  );
}
