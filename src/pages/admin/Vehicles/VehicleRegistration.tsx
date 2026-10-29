import {
  useId,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { CheckCircle2, ChevronDown, ImageOff, X } from "lucide-react";
import styles from "./VehicleRegistration.module.css";

export const CATEGORIES = ["Carros", "Motos", "Barcos", "Aeronaves"] as const;
export type VehicleCategory = (typeof CATEGORIES)[number];

const STATS = [
  { key: "topSpeed", label: "Velocidade Máxima" },
  { key: "acceleration", label: "Aceleração" },
  { key: "braking", label: "Frenagem" },
  { key: "handling", label: "Manuseio" },
] as const;

type StatKey = (typeof STATS)[number]["key"];

export interface VehicleDraft {
  name: string;
  manufacturer: string;
  price: string;
  category: VehicleCategory;
  tags: string[];
  description: string;
  imageUrl: string;
  stats: Record<StatKey, number>;
}

interface VehicleRegistrationProps {
  onSubmit?: (vehicle: VehicleDraft) => void;
}

const INITIAL_VEHICLE: VehicleDraft = {
  name: "",
  manufacturer: "",
  price: "",
  category: "Carros",
  tags: [],
  description: "",
  imageUrl: "",
  stats: { topSpeed: 50, acceleration: 50, braking: 50, handling: 50 },
};

const clampStat = (raw: string) =>
  Math.min(100, Math.max(0, Math.round(Number(raw) || 0)));

export default function VehicleRegistration({
  onSubmit,
}: VehicleRegistrationProps) {
  const uid = useId();
  const id = (field: string) => `${uid}-${field}`;

  const [vehicle, setVehicle] = useState<VehicleDraft>(INITIAL_VEHICLE);
  const [tagInput, setTagInput] = useState("");
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  function update<K extends keyof VehicleDraft>(
    key: K,
    value: VehicleDraft[K]
  ) {
    setVehicle((prev) => ({ ...prev, [key]: value }));
  }

  function updateStat(key: StatKey, raw: string) {
    setVehicle((prev) => ({
      ...prev,
      stats: { ...prev.stats, [key]: clampStat(raw) },
    }));
  }

  function addTag(raw: string) {
    const tag = raw.replace(/,/g, "").trim();
    if (!tag) return;
    const exists = vehicle.tags.some(
      (t) => t.toLowerCase() === tag.toLowerCase()
    );
    if (!exists) update("tags", [...vehicle.tags, tag]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    update(
      "tags",
      vehicle.tags.filter((t) => t !== tag)
    );
  }

  function handleTagKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && !tagInput && vehicle.tags.length > 0) {
      removeTag(vehicle.tags[vehicle.tags.length - 1]);
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit?.({
      ...vehicle,
      name: vehicle.name.trim(),
      manufacturer: vehicle.manufacturer.trim(),
      description: vehicle.description.trim(),
      imageUrl: vehicle.imageUrl.trim(),
    });
  }

  function handleReset() {
    setVehicle(INITIAL_VEHICLE);
    setTagInput("");
    setFailedUrl(null);
  }

  const imageUrl = vehicle.imageUrl.trim();

  const hasImage = imageUrl !== "" && failedUrl !== imageUrl;

  const imageFailed = imageUrl !== "" && failedUrl === imageUrl;

  const imageStatus = hasImage
    ? "Imagem selecionada."
    : imageFailed
    ? "Não foi possível carregar essa imagem. Confira a URL."
    : "Cole a URL de uma imagem para ver a prévia.";

  const priceNumber = vehicle.price === "" ? null : Number(vehicle.price);
  const priceLabel =
    priceNumber !== null && Number.isFinite(priceNumber)
      ? `GTA$ ${priceNumber.toLocaleString("pt-BR")}`
      : null;

  const vehicleName = vehicle.name.trim();
  const vehicleMaker = vehicle.manufacturer.trim();
  const vehicleDescription = vehicle.description.trim();

  return (
    <div className={styles.root}>
      <div className={styles.layout}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <section className={styles.panel} aria-labelledby={id("general")}>
            <h2 id={id("general")} className={styles.panelTitle}>
              Registros gerais
            </h2>

            <div className={styles.fields}>
              <div className={styles.field}>
                <label htmlFor={id("name")} className={styles.label}>
                  Nome do veículo
                  <span className={styles.required} aria-hidden>
                    *
                  </span>
                </label>
                <input
                  id={id("name")}
                  className={styles.control}
                  type="text"
                  required
                  placeholder="Pfister Comet S2"
                  value={vehicle.name}
                  onChange={(e) => update("name", e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor={id("maker")} className={styles.label}>
                  Fabricante / Marca
                  <span className={styles.required} aria-hidden>
                    *
                  </span>
                </label>
                <input
                  id={id("maker")}
                  className={styles.control}
                  type="text"
                  required
                  placeholder="Pfister"
                  value={vehicle.manufacturer}
                  onChange={(e) => update("manufacturer", e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor={id("price")} className={styles.label}>
                  Preço (GTA$)
                </label>
                <input
                  id={id("price")}
                  className={styles.control}
                  type="number"
                  min={0}
                  step={1}
                  inputMode="numeric"
                  placeholder="GTA$"
                  value={vehicle.price}
                  onChange={(e) => update("price", e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor={id("category")} className={styles.label}>
                  Categoria principal
                </label>
                <div className={styles.selectWrap}>
                  <select
                    id={id("category")}
                    className={`${styles.control} ${styles.select}`}
                    value={vehicle.category}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      update("category", e.target.value as VehicleCategory)
                    }
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className={styles.selectIcon}
                    aria-hidden
                  />
                </div>
              </div>

              <div className={`${styles.field} ${styles.full}`}>
                <label htmlFor={id("tags")} className={styles.label}>
                  Subcategorias / Tags
                </label>
                <div className={styles.tagBox}>
                  {vehicle.tags.map((tag) => (
                    <span key={tag} className={styles.chip}>
                      {tag}
                      <button
                        type="button"
                        className={styles.chipRemove}
                        onClick={() => removeTag(tag)}
                        aria-label={`Remover tag ${tag}`}
                      >
                        <X size={12} aria-hidden />
                      </button>
                    </span>
                  ))}
                  <input
                    id={id("tags")}
                    className={styles.tagInput}
                    type="text"
                    placeholder="Adicionar e Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    onBlur={() => addTag(tagInput)}
                  />
                </div>
              </div>

              <div className={`${styles.field} ${styles.full}`}>
                <label htmlFor={id("description")} className={styles.label}>
                  Breve descrição
                </label>
                <textarea
                  id={id("description")}
                  className={`${styles.control} ${styles.textarea}`}
                  rows={3}
                  placeholder="Breve descrição"
                  value={vehicle.description}
                  onChange={(e) => update("description", e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className={styles.panel} aria-labelledby={id("stats")}>
            <h2 id={id("stats")} className={styles.panelTitle}>
              Estatísticas
            </h2>

            <div className={styles.statsGrid}>
              {STATS.map(({ key, label }) => {
                const value = vehicle.stats[key];
                return (
                  <div key={key} className={styles.stat}>
                    <div className={styles.statHead}>
                      <label htmlFor={id(key)} className={styles.statLabel}>
                        {label}
                      </label>
                      <input
                        className={styles.statValue}
                        type="number"
                        min={0}
                        max={100}
                        value={value}
                        onChange={(e) => updateStat(key, e.target.value)}
                        aria-label={`${label}, valor de 0 a 100`}
                      />
                    </div>
                    <input
                      id={id(key)}
                      className={styles.range}
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={value}
                      style={{ "--value": value } as CSSProperties}
                      onChange={(e) => updateStat(key, e.target.value)}
                    />
                    <div className={styles.ticks} aria-hidden>
                      <span>0</span>
                      <span>50</span>
                      <span>100</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className={styles.panel} aria-labelledby={id("media")}>
            <h2 id={id("media")} className={styles.panelTitle}>
              Mídia principal
            </h2>

            <div className={styles.field}>
              <label htmlFor={id("image")} className={styles.label}>
                URL da imagem
              </label>
              <input
                id={id("image")}
                className={styles.control}
                type="url"
                placeholder="https://..."
                value={vehicle.imageUrl}
                onChange={(e) => update("imageUrl", e.target.value)}
              />
            </div>

            <div className={styles.media}>
              <div
                className={`${styles.thumb} ${
                  hasImage ? styles.thumbFilled : ""
                }`}
              >
                {hasImage ? (
                  <img
                    src={imageUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    onError={() => setFailedUrl(imageUrl)}
                  />
                ) : (
                  <ImageOff size={22} aria-hidden />
                )}
              </div>
              <p
                className={`${styles.mediaStatus} ${
                  imageFailed ? styles.mediaError : ""
                }`}
                aria-live="polite"
              >
                {imageStatus}
              </p>
            </div>
          </section>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.btnGhost}
              onClick={handleReset}
            >
              Limpar
            </button>
          </div>
        </form>

        <aside className={styles.preview} aria-labelledby={id("preview")}>
          <h2 id={id("preview")} className={styles.previewTitle}>
            Prévia do card do veículo
          </h2>

          <article className={styles.card}>
            <div className={styles.cardMedia}>
              {hasImage ? (
                <img
                  src={imageUrl}
                  alt={vehicleName || "Imagem do veículo"}
                  referrerPolicy="no-referrer"
                  onError={() => setFailedUrl(imageUrl)}
                />
              ) : (
                <span className={styles.placeholder}>
                  <ImageOff size={28} aria-hidden />
                  Sem imagem
                </span>
              )}
              <span className={styles.badge}>{vehicle.category}</span>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.cardHeading}>
                <h3
                  className={`${styles.cardName} ${
                    vehicleName ? "" : styles.isEmpty
                  }`}
                >
                  {vehicleName || "Nome do veículo"}
                </h3>
                {priceLabel && (
                  <span className={styles.price}>{priceLabel}</span>
                )}
              </div>

              <p
                className={`${styles.maker} ${
                  vehicleMaker ? "" : styles.isEmpty
                }`}
              >
                {vehicleMaker || "Fabricante / Marca"}
              </p>

              {vehicleDescription && (
                <p className={styles.description}>{vehicleDescription}</p>
              )}

              <ul className={styles.bars}>
                {STATS.map(({ key, label }) => {
                  const value = vehicle.stats[key];
                  return (
                    <li key={key} className={styles.bar}>
                      <div className={styles.barHead}>
                        <span>{label}</span>
                        <strong>{value}</strong>
                      </div>
                      <div
                        className={styles.barTrack}
                        style={{ "--value": value } as CSSProperties}
                        aria-hidden
                      >
                        <div className={styles.barFill} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </article>

          <div className={styles.previewTags}>
            <h3 className={styles.miniTitle}>Subcategorias / Tags</h3>
            {vehicle.tags.length > 0 ? (
              <ul className={styles.pills}>
                {vehicle.tags.map((tag) => (
                  <li key={tag} className={styles.pill}>
                    {tag}
                    <CheckCircle2 size={13} aria-hidden />
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.note}>Nenhuma tag adicionada.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
