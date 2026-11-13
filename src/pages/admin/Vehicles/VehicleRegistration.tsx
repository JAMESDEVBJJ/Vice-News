import {
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { CheckCircle2, ChevronDown, ImageOff, X } from "lucide-react";
import styles from "./VehicleRegistration.module.css";
import {
  getManufacturers,
  getVehicleCategories,
  type ManufacturerResponse,
  type VehicleCategoryResponse,
} from "../../../api/vehicleLookupsApi";
import {
  createVehicle,
  type CreateVehicleRequest,
  type VehicleResponse,
} from "../../../api/vehiclesApi";
import {
  ApiError,
  getErrorMessage,
  type FieldErrors,
} from "../../../api/httpClient";
import { useApiResource } from "../../../hooks/useApiResource";
import { slugify } from "../../../lib/slug";
import { toast } from "../../../lib/toast";

const STATS = [
  { key: "topSpeed", label: "Velocidade Máxima" },
  { key: "acceleration", label: "Aceleração" },
  { key: "braking", label: "Frenagem" },
  { key: "handling", label: "Manuseio" },
] as const;

type StatKey = (typeof STATS)[number]["key"];

export interface VehicleDraft {
  name: string;
  manufacturerId: number | null;
  price: string;
  categoryId: number | null;
  tags: string[];
  description: string;
  imageUrl: string;
  stats: Record<StatKey, number>;
}

interface VehicleRegistrationProps {
  onCreated?: (vehicle: VehicleResponse) => void;

  onSubmittingChange?: (submitting: boolean) => void;
}

const INITIAL_VEHICLE: VehicleDraft = {
  name: "",
  manufacturerId: null,
  price: "",
  categoryId: null,
  tags: [],
  description: "",
  imageUrl: "",
  stats: { topSpeed: 50, acceleration: 50, braking: 50, handling: 50 },
};

const DESCRIPTION_MAX_LENGTH = 300;
const TAG_MAX_LENGTH = 100;

const clampStat = (raw: string) =>
  Math.min(100, Math.max(0, Math.round(Number(raw) || 0)));

const parseOptionId = (raw: string): number | null =>
  raw === "" ? null : Number(raw);

const describedBy = (...ids: Array<string | false | null | undefined>) =>
  ids.filter(Boolean).join(" ") || undefined;

type VehicleErrors = Partial<
  Record<
    | "name"
    | "manufacturerId"
    | "price"
    | "categoryId"
    | "description"
    | "imageUrl"
    | "tags"
    | "stats",
    string
  >
>;

interface VehicleOptions {
  manufacturers: ManufacturerResponse[];
  categories: VehicleCategoryResponse[];
}

function validateVehicle(
  vehicle: VehicleDraft,
  options: VehicleOptions
): VehicleErrors {
  const errors: VehicleErrors = {};

  const name = vehicle.name.trim();
  const price = vehicle.price.trim();
  const description = vehicle.description.trim();
  const imageUrl = vehicle.imageUrl.trim();

  if (!name) {
    errors.name = "Informe o nome do veículo.";
  } else if (name.length > 100) {
    errors.name = "O nome deve ter no máximo 100 caracteres.";
  } else if (!slugify(name)) {
    errors.name = "O nome deve conter letras ou números.";
  }

  if (vehicle.manufacturerId === null) {
    errors.manufacturerId = "Selecione o fabricante ou a marca.";
  } else if (
    !options.manufacturers.some((m) => m.id === vehicle.manufacturerId)
  ) {
    errors.manufacturerId = "Selecione um fabricante válido.";
  }

  if (price === "") {
    errors.price = "Informe o preço em GTA$.";
  } else {
    const numericPrice = Number(price);

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice < 0 ||
      !Number.isSafeInteger(numericPrice)
    ) {
      errors.price = "Informe um preço inteiro maior ou igual a zero.";
    }
  }

  if (vehicle.categoryId === null) {
    errors.categoryId = "Selecione a categoria principal.";
  } else if (!options.categories.some((c) => c.id === vehicle.categoryId)) {
    errors.categoryId = "Selecione uma categoria válida.";
  }

  if (!description) {
    errors.description = "Informe uma breve descrição do veículo.";
  } else if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = `A descrição deve ter no máximo ${DESCRIPTION_MAX_LENGTH} caracteres.`;
  }

  const invalidTag = vehicle.tags.find(
    (tag) => tag.length > TAG_MAX_LENGTH || !slugify(tag)
  );

  if (invalidTag !== undefined) {
    errors.tags =
      invalidTag.length > TAG_MAX_LENGTH
        ? `Cada tag deve ter no máximo ${TAG_MAX_LENGTH} caracteres.`
        : `A tag "${invalidTag}" deve conter letras ou números.`;
  }

  if (imageUrl) {
    try {
      const parsedUrl = new URL(imageUrl);

      if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
        errors.imageUrl = "Utilize uma URL HTTP ou HTTPS.";
      }
    } catch {
      errors.imageUrl = "Informe uma URL de imagem válida.";
    }
  }

  return errors;
}

function hasErrors(errors: VehicleErrors): boolean {
  return Object.keys(errors).length > 0;
}

function toCreateVehicleRequest(vehicle: VehicleDraft): CreateVehicleRequest {
  return {
    name: vehicle.name.trim(),
    manufacturerId: vehicle.manufacturerId as number,
    categoryId: vehicle.categoryId as number,
    priceGta: Number(vehicle.price.trim()),
    description: vehicle.description.trim(),
    maxSpeed: vehicle.stats.topSpeed,
    acceleration: vehicle.stats.acceleration,
    braking: vehicle.stats.braking,
    handling: vehicle.stats.handling,
    imageUrl: vehicle.imageUrl.trim() || null,
    tags: vehicle.tags.map((tag) => tag.trim()).filter(Boolean),
  };
}

/** Campos do CreateVehicleRequestDto (chaves já em camelCase) → campos do formulário. */
const SERVER_FIELD_TO_FORM_FIELD: Record<string, keyof VehicleErrors> = {
  name: "name",
  manufacturerId: "manufacturerId",
  categoryId: "categoryId",
  priceGta: "price",
  description: "description",
  imageUrl: "imageUrl",
  tags: "tags",
  maxSpeed: "stats",
  acceleration: "stats",
  braking: "stats",
  handling: "stats",
};

/** Separa os erros de validação da API entre campos do formulário e mensagens avulsas. */
function mapServerFieldErrors(fieldErrors: FieldErrors) {
  const errors: VehicleErrors = {};
  const unmatched: string[] = [];

  for (const [key, messages] of Object.entries(fieldErrors)) {
    const field = SERVER_FIELD_TO_FORM_FIELD[key];

    if (!field) {
      unmatched.push(...messages);
      continue;
    }

    errors[field] = [errors[field], ...messages].filter(Boolean).join(" ");
  }

  return { errors, unmatched };
}

type LookupStatus = "loading" | "success" | "error";

function describeLookupError(error: unknown, resource: string): string {
  if (error instanceof ApiError && error.kind !== "network") {
    return `Não foi possível carregar ${resource}. ${error.message}`;
  }

  return `Não foi possível carregar ${resource}. Verifique se a API está em execução.`;
}

function useLookupList<T>(
  load: (signal: AbortSignal) => Promise<T[]>,
  resource: string
) {
  const { status, data, error, retry } = useApiResource(load);
  const items = useMemo(() => data ?? [], [data]);

  return {
    status,
    items,
    error: status === "error" ? describeLookupError(error, resource) : null,
    retry,
  };
}

function lookupPlaceholder(
  status: LookupStatus,
  isEmpty: boolean,
  labels: { loading: string; error: string; empty: string; idle: string }
): string {
  if (status === "loading") return labels.loading;
  if (status === "error") return labels.error;
  if (isEmpty) return labels.empty;
  return labels.idle;
}

export default function VehicleRegistration({
  onCreated,
  onSubmittingChange,
}: VehicleRegistrationProps) {
  const [showErrors, setShowErrors] = useState(false);
  const [serverErrors, setServerErrors] = useState<VehicleErrors>({});
  const [submitting, setSubmitting] = useState(false);
  // Trava síncrona: evita dois envios antes de o estado "submitting" renderizar.
  const submittingRef = useRef(false);
  const uid = useId();
  const id = (field: string) => `${uid}-${field}`;

  const [vehicle, setVehicle] = useState<VehicleDraft>(INITIAL_VEHICLE);
  const [tagInput, setTagInput] = useState("");
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  const manufacturers = useLookupList(getManufacturers, "os fabricantes");
  const categories = useLookupList(getVehicleCategories, "as categorias");

  const manufacturerItems = manufacturers.items;
  const categoryItems = categories.items;

  // Erros do cliente são derivados do rascunho; os da API valem até a próxima edição.
  const errors: VehicleErrors = {
    ...(showErrors
      ? validateVehicle(vehicle, {
          manufacturers: manufacturerItems,
          categories: categoryItems,
        })
      : {}),
    ...serverErrors,
  };

  function clearServerErrors() {
    setServerErrors((current) =>
      Object.keys(current).length > 0 ? {} : current
    );
  }

  function update<K extends keyof VehicleDraft>(
    key: K,
    value: VehicleDraft[K]
  ) {
    setVehicle((prev) => ({ ...prev, [key]: value }));
    clearServerErrors();
  }

  function updateStat(key: StatKey, raw: string) {
    setVehicle((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [key]: clampStat(raw),
      },
    }));
    clearServerErrors();
  }

  function setSubmittingState(value: boolean) {
    submittingRef.current = value;
    setSubmitting(value);
    onSubmittingChange?.(value);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (submittingRef.current) return;

    const nextErrors = validateVehicle(vehicle, {
      manufacturers: manufacturerItems,
      categories: categoryItems,
    });

    setShowErrors(true);
    setServerErrors({});

    if (hasErrors(nextErrors)) {
      return;
    }

    setSubmittingState(true);

    try {
      const created = await createVehicle(toCreateVehicleRequest(vehicle));
      handleReset();
      onCreated?.(created);
    } catch (error) {
      handleSubmitError(error);
    } finally {
      setSubmittingState(false);
    }
  }

  function handleSubmitError(error: unknown) {
    if (!(error instanceof ApiError)) {
      toast.error("Não foi possível cadastrar o veículo", getErrorMessage(error));
      return;
    }

    switch (error.kind) {
      case "validation": {
        const { errors: fieldErrors, unmatched } = mapServerFieldErrors(
          error.fieldErrors
        );
        setServerErrors(fieldErrors);
        toast.error(
          "Revise os dados do veículo",
          unmatched.length > 0 ? unmatched.join(" ") : error.message
        );
        break;
      }
      case "not-found":
        // Fabricante ou categoria removidos: recarrega as opções dos selects.
        toast.error("Registro não encontrado", error.message);
        manufacturers.retry();
        categories.retry();
        break;
      case "conflict":
        toast.error("Conflito ao salvar o veículo", error.message);
        break;
      default:
        toast.error("Não foi possível cadastrar o veículo", error.message);
    }
  }

  function handleReset() {
    setVehicle(INITIAL_VEHICLE);
    setTagInput("");
    setFailedUrl(null);
    setShowErrors(false);
    setServerErrors({});
  }

  function addTag(raw: string) {
    const tag = raw.replace(/,/g, "").trim().replace(/\s+/g, " ");
    if (!tag) return;
    // Mesma regra da API: "Tunável", "tunavel" e "TUNAVEL" são a mesma tag.
    const slug = slugify(tag);
    const exists = vehicle.tags.some((t) => slugify(t) === slug);
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
  const vehicleDescription = vehicle.description.trim();

  const vehicleMaker =
    manufacturerItems.find((m) => m.id === vehicle.manufacturerId)?.name ?? "";
  const vehicleCategory =
    categoryItems.find((c) => c.id === vehicle.categoryId)?.name ?? "";

  const manufacturersUnavailable =
    manufacturers.status !== "success" || manufacturerItems.length === 0;
  const categoriesUnavailable =
    categories.status !== "success" || categoryItems.length === 0;

  const manufacturerStatusId =
    manufacturers.status === "error" ||
    (manufacturers.status === "success" && manufacturerItems.length === 0)
      ? id("manufacturer-status")
      : undefined;
  const categoryStatusId =
    categories.status === "error" ||
    (categories.status === "success" && categoryItems.length === 0)
      ? id("category-status")
      : undefined;

  return (
    <div className={styles.root}>
      <div className={styles.layout}>
        <form
          className={styles.form}
          id="vehicle-registration-form"
          onSubmit={handleSubmit}
          noValidate
          aria-busy={submitting}
        >
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
                  maxLength={100}
                  placeholder="Pfister Comet S2"
                  value={vehicle.name}
                  onChange={(e) => update("name", e.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? id("name-error") : undefined}
                />

                {errors.name && (
                  <p
                    id={id("name-error")}
                    className={styles.fieldError}
                    role="alert"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor={id("manufacturer")} className={styles.label}>
                  Fabricante / Marca
                  <span className={styles.required} aria-hidden>
                    *
                  </span>
                </label>
                <div className={styles.selectWrap}>
                  <select
                    id={id("manufacturer")}
                    className={`${styles.control} ${styles.select} ${
                      vehicle.manufacturerId === null ? styles.selectEmpty : ""
                    }`}
                    required
                    disabled={manufacturersUnavailable}
                    value={vehicle.manufacturerId ?? ""}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      update("manufacturerId", parseOptionId(e.target.value))
                    }
                    aria-busy={manufacturers.status === "loading"}
                    aria-invalid={Boolean(errors.manufacturerId)}
                    aria-describedby={describedBy(
                      manufacturerStatusId,
                      errors.manufacturerId && id("manufacturer-error")
                    )}
                  >
                    <option value="">
                      {lookupPlaceholder(
                        manufacturers.status,
                        manufacturerItems.length === 0,
                        {
                          loading: "Carregando fabricantes…",
                          error: "Fabricantes indisponíveis",
                          empty: "Nenhum fabricante cadastrado",
                          idle: "Selecione um fabricante",
                        }
                      )}
                    </option>
                    {manufacturerItems.map((manufacturer) => (
                      <option key={manufacturer.id} value={manufacturer.id}>
                        {manufacturer.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className={styles.selectIcon}
                    aria-hidden
                  />
                </div>

                {manufacturers.status === "error" && (
                  <p
                    id={id("manufacturer-status")}
                    className={styles.fieldError}
                    role="alert"
                  >
                    {manufacturers.error}{" "}
                    <button
                      type="button"
                      className={styles.retry}
                      onClick={manufacturers.retry}
                    >
                      Tentar novamente
                    </button>
                  </p>
                )}

                {manufacturers.status === "success" &&
                  manufacturerItems.length === 0 && (
                    <p
                      id={id("manufacturer-status")}
                      className={styles.fieldHint}
                    >
                      Cadastre um fabricante na API para continuar.
                    </p>
                  )}

                {errors.manufacturerId && (
                  <p
                    id={id("manufacturer-error")}
                    className={styles.fieldError}
                    role="alert"
                  >
                    {errors.manufacturerId}
                  </p>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor={id("price")} className={styles.label}>
                  Preço (GTA$)
                  <span className={styles.required} aria-hidden>
                    *
                  </span>
                </label>
                <input
                  id={id("price")}
                  className={styles.control}
                  type="number"
                  required
                  min={0}
                  step={1}
                  inputMode="numeric"
                  placeholder="GTA$"
                  value={vehicle.price}
                  onChange={(e) => update("price", e.target.value)}
                  aria-invalid={Boolean(errors.price)}
                  aria-describedby={
                    errors.price ? id("price-error") : undefined
                  }
                />
                {errors.price && (
                  <p
                    id={id("price-error")}
                    className={styles.fieldError}
                    role="alert"
                  >
                    {errors.price}
                  </p>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor={id("category")} className={styles.label}>
                  Categoria principal
                  <span className={styles.required} aria-hidden>
                    *
                  </span>
                </label>
                <div className={styles.selectWrap}>
                  <select
                    id={id("category")}
                    className={`${styles.control} ${styles.select} ${
                      vehicle.categoryId === null ? styles.selectEmpty : ""
                    }`}
                    required
                    disabled={categoriesUnavailable}
                    value={vehicle.categoryId ?? ""}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      update("categoryId", parseOptionId(e.target.value))
                    }
                    aria-busy={categories.status === "loading"}
                    aria-invalid={Boolean(errors.categoryId)}
                    aria-describedby={describedBy(
                      categoryStatusId,
                      errors.categoryId && id("category-error")
                    )}
                  >
                    <option value="">
                      {lookupPlaceholder(
                        categories.status,
                        categoryItems.length === 0,
                        {
                          loading: "Carregando categorias…",
                          error: "Categorias indisponíveis",
                          empty: "Nenhuma categoria cadastrada",
                          idle: "Selecione uma categoria",
                        }
                      )}
                    </option>
                    {categoryItems.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className={styles.selectIcon}
                    aria-hidden
                  />
                </div>

                {categories.status === "error" && (
                  <p
                    id={id("category-status")}
                    className={styles.fieldError}
                    role="alert"
                  >
                    {categories.error}{" "}
                    <button
                      type="button"
                      className={styles.retry}
                      onClick={categories.retry}
                    >
                      Tentar novamente
                    </button>
                  </p>
                )}

                {categories.status === "success" &&
                  categoryItems.length === 0 && (
                    <p id={id("category-status")} className={styles.fieldHint}>
                      Cadastre uma categoria na API para continuar.
                    </p>
                  )}

                {errors.categoryId && (
                  <p
                    id={id("category-error")}
                    className={styles.fieldError}
                    role="alert"
                  >
                    {errors.categoryId}
                  </p>
                )}
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
                    maxLength={TAG_MAX_LENGTH}
                    placeholder="Adicionar e Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    onBlur={() => addTag(tagInput)}
                    aria-invalid={Boolean(errors.tags)}
                    aria-describedby={errors.tags ? id("tags-error") : undefined}
                  />
                </div>
                {errors.tags && (
                  <p
                    id={id("tags-error")}
                    className={styles.fieldError}
                    role="alert"
                  >
                    {errors.tags}
                  </p>
                )}
              </div>

              <div className={`${styles.field} ${styles.full}`}>
                <label htmlFor={id("description")} className={styles.label}>
                  Breve descrição
                  <span className={styles.required} aria-hidden>
                    *
                  </span>
                </label>
                <textarea
                  id={id("description")}
                  className={`${styles.control} ${styles.textarea}`}
                  rows={3}
                  required
                  placeholder="Breve descrição"
                  value={vehicle.description}
                  onChange={(e) => update("description", e.target.value)}
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={
                    errors.description ? id("description-error") : undefined
                  }
                />
                {errors.description && (
                  <p
                    id={id("description-error")}
                    className={styles.fieldError}
                    role="alert"
                  >
                    {errors.description}
                  </p>
                )}
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
            {errors.stats && (
              <p className={styles.fieldError} role="alert">
                {errors.stats}
              </p>
            )}
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
                aria-invalid={Boolean(errors.imageUrl)}
                aria-describedby={
                  errors.imageUrl ? id("imageUrl-error") : undefined
                }
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
            {errors.imageUrl && (
              <p
                id={id("imageUrl-error")}
                className={styles.fieldError}
                role="alert"
              >
                {errors.imageUrl}
              </p>
            )}
          </section>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.btnGhost}
              onClick={handleReset}
              disabled={submitting}
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
              {vehicleCategory && (
                <span className={styles.badge}>{vehicleCategory}</span>
              )}
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
