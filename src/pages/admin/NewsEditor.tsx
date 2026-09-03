import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  Plus,
  Star,
  Save,
  Send,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import type { ArticleBlock } from "../../data/article";
import {
  BLOCK_LABELS,
  BLOCK_TYPES,
  CURRENT_USER,
  NEWS_CATEGORIES,
  createBlock,
  emptyForm,
  hasErrors,
  validateForm,
  type BlockType,
  type FormErrors,
  type NewsFormData,
} from "../../data/newsForm";
import type { NewsCategory } from "../../data/mockNews";
import BlockEditor from "../../components/admin/BlockEditor";
import ArticlePreview from "../../components/admin/ArticlePreview";
import styles from "./NewsEditor.module.css";

type Tab = "editor" | "preview";
type Status = { kind: "draft" | "published"; message: string } | null;

export default function NewsEditor() {
  const [data, setData] = useState<NewsFormData>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({ blocks: {} });
  const [showErrors, setShowErrors] = useState(false);
  const [tab, setTab] = useState<Tab>("editor");
  const [tagInput, setTagInput] = useState("");
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const addMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showErrors) return;
    setErrors(validateForm(data));
  }, [data, showErrors]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node))
        setAddMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const patch = (partial: Partial<NewsFormData>) =>
    setData((prev) => ({ ...prev, ...partial }));

  const addBlock = (type: BlockType) => {
    patch({ content: [...data.content, createBlock(type)] });
    setAddMenuOpen(false);
  };
  const updateBlock = (index: number, block: ArticleBlock) => {
    const content = data.content.slice();
    content[index] = block;
    patch({ content });
  };
  const moveBlock = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= data.content.length) return;
    const content = data.content.slice();
    [content[index], content[target]] = [content[target], content[index]];
    patch({ content });
  };
  const duplicateBlock = (index: number) => {
    const content = data.content.slice();
    content.splice(index + 1, 0, structuredClone(data.content[index]));
    patch({ content });
  };
  const removeBlock = (index: number) =>
    patch({ content: data.content.filter((_, i) => i !== index) });

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !data.tags.includes(tag)) patch({ tags: [...data.tags, tag] });
    setTagInput("");
  };
  const removeTag = (tag: string) =>
    patch({ tags: data.tags.filter((t) => t !== tag) });

  const handlePublish = () => {
    const next = validateForm(data);
    setErrors(next);
    setShowErrors(true);
    if (hasErrors(next)) {
      setTab("editor");
      setStatus(null);
      return;
    }
    setStatus({
      kind: "published",
      message: "Notícia publicada com sucesso (simulação).",
    });
    console.log("Publicar notícia:", data);
  };
  const handleSaveDraft = () => {
    setStatus({ kind: "draft", message: "Rascunho salvo localmente." });
    console.log("Rascunho:", data);
  };

  return (
    <div className={styles.page}>
      <div aria-hidden className={styles.ambient} />

      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <Link to="/" className={styles.back}>
            <ArrowLeft size={16} aria-hidden />
            Notícias
          </Link>

          <div className={styles.topbarTitle}>
            <span className={styles.eyebrow}>ADMIN</span>
            <h1 className={styles.pageTitle}>Nova Notícia</h1>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.toggle} ${
                data.featured ? styles.toggleOn : ""
              }`}
              onClick={() => patch({ featured: !data.featured })}
              aria-pressed={data.featured}
            >
              <Star size={15} aria-hidden />
              Destaque
            </button>
            <button
              type="button"
              className={styles.btnGhost}
              onClick={handleSaveDraft}
            >
              <Save size={15} aria-hidden />
              Salvar rascunho
            </button>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={handlePublish}
            >
              <Send size={15} aria-hidden />
              Publicar
            </button>
          </div>
        </div>

        <div
          className={styles.tabs}
          role="tablist"
          aria-label="Alternar visualização"
        >
          <button
            role="tab"
            aria-selected={tab === "editor"}
            className={`${styles.tab} ${
              tab === "editor" ? styles.tabActive : ""
            }`}
            onClick={() => setTab("editor")}
          >
            Editor
          </button>
          <button
            role="tab"
            aria-selected={tab === "preview"}
            className={`${styles.tab} ${
              tab === "preview" ? styles.tabActive : ""
            }`}
            onClick={() => setTab("preview")}
          >
            Preview
          </button>
        </div>
      </header>

      {status && (
        <div
          className={`${styles.banner} ${
            status.kind === "published" ? styles.bannerOk : styles.bannerInfo
          }`}
          role="status"
        >
          <Check size={16} aria-hidden />
          {status.message}
          <button
            type="button"
            className={styles.bannerClose}
            onClick={() => setStatus(null)}
            aria-label="Fechar aviso"
          >
            <X size={15} />
          </button>
        </div>
      )}

      <main className={styles.main}>
        <div
          className={`${styles.column} ${
            tab === "editor" ? styles.colVisible : ""
          }`}
        >
          <section className={styles.panel} aria-labelledby="info-heading">
            <h2 id="info-heading" className={styles.panelTitle}>
              Informações gerais
            </h2>

            <div className={styles.field}>
              <label htmlFor="f-title" className={styles.label}>
                Título <span className={styles.req}>*</span>
              </label>
              <input
                id="f-title"
                className={styles.input}
                value={data.title}
                onChange={(e) => patch({ title: e.target.value })}
                placeholder="Título da notícia"
              />
              {errors.title && <p className={styles.err}>{errors.title}</p>}
            </div>

            <div className={styles.field}>
              <label htmlFor="f-summary" className={styles.label}>
                Resumo <span className={styles.req}>*</span>
              </label>
              <textarea
                id="f-summary"
                className={styles.textarea}
                rows={3}
                value={data.summary}
                onChange={(e) => patch({ summary: e.target.value })}
                placeholder="Breve resumo exibido nas listagens e no topo da notícia"
              />
              {errors.summary && <p className={styles.err}>{errors.summary}</p>}
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="f-category" className={styles.label}>
                  Categoria <span className={styles.req}>*</span>
                </label>
                <select
                  id="f-category"
                  className={styles.select}
                  value={data.category}
                  onChange={(e) =>
                    patch({ category: e.target.value as NewsCategory })
                  }
                >
                  {NEWS_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <span className={styles.label}>Autor</span>
                <div className={styles.readonly}>{CURRENT_USER}</div>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="f-tags" className={styles.label}>
                Tags
              </label>
              <div className={styles.tagBox}>
                {data.tags.map((tag) => (
                  <span key={tag} className={styles.tagChip}>
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      aria-label={`Remover tag ${tag}`}
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
                <input
                  id="f-tags"
                  className={styles.tagInput}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder={data.tags.length ? "" : "Adicionar tag e Enter"}
                />
              </div>
            </div>
          </section>

          <section className={styles.panel} aria-labelledby="cover-heading">
            <h2 id="cover-heading" className={styles.panelTitle}>
              Imagem de capa <span className={styles.req}>*</span>
            </h2>
            <div className={styles.field}>
              <input
                className={styles.input}
                value={data.heroImage}
                onChange={(e) => patch({ heroImage: e.target.value })}
                placeholder="URL da imagem de capa"
                aria-label="URL da imagem de capa"
              />
              {errors.heroImage && (
                <p className={styles.err}>{errors.heroImage}</p>
              )}
            </div>
            {data.heroImage && (
              <img
                className={styles.coverPreview}
                src={data.heroImage}
                alt=""
              />
            )}
            <div className={styles.field}>
              <label htmlFor="f-caption" className={styles.label}>
                Legenda da capa
              </label>
              <input
                id="f-caption"
                className={styles.input}
                value={data.heroCaption ?? ""}
                onChange={(e) => patch({ heroCaption: e.target.value })}
                placeholder="Legenda opcional"
              />
            </div>
          </section>

          <section className={styles.panel} aria-labelledby="content-heading">
            <h2 id="content-heading" className={styles.panelTitle}>
              Conteúdo
            </h2>

            {data.content.length === 0 && (
              <div className={styles.emptyState}>
                <AlertCircle size={18} aria-hidden />
                <p>
                  Nenhum bloco ainda. Comece adicionando um bloco de conteúdo.
                </p>
              </div>
            )}
            {errors.content && data.content.length === 0 && (
              <p className={styles.err}>{errors.content}</p>
            )}

            <div className={styles.blocks}>
              {data.content.map((block, index) => (
                <BlockEditor
                  key={index}
                  block={block}
                  index={index}
                  total={data.content.length}
                  error={errors.blocks[index]}
                  onChange={updateBlock}
                  onMove={moveBlock}
                  onDuplicate={duplicateBlock}
                  onRemove={removeBlock}
                />
              ))}
            </div>

            <div className={styles.addWrap} ref={addMenuRef}>
              <button
                type="button"
                className={styles.addBlock}
                onClick={() => setAddMenuOpen((v) => !v)}
                aria-expanded={addMenuOpen}
                aria-haspopup="menu"
              >
                <Plus size={16} aria-hidden />
                Adicionar bloco
              </button>
              {addMenuOpen && (
                <div className={styles.addMenu} role="menu">
                  {BLOCK_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      role="menuitem"
                      className={styles.addMenuItem}
                      onClick={() => addBlock(type)}
                    >
                      {BLOCK_LABELS[type]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className={styles.panel} aria-labelledby="note-heading">
            <h2 id="note-heading" className={styles.panelTitle}>
              Nota da sidebar{" "}
              <span className={styles.optional}>(opcional)</span>
            </h2>
            <div className={styles.field}>
              <label htmlFor="f-note-label" className={styles.label}>
                Rótulo
              </label>
              <input
                id="f-note-label"
                className={styles.input}
                value={data.sidebarNote.label}
                onChange={(e) =>
                  patch({
                    sidebarNote: { ...data.sidebarNote, label: e.target.value },
                  })
                }
                placeholder="PONTO DESTAQUE"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="f-note-text" className={styles.label}>
                Texto
              </label>
              <textarea
                id="f-note-text"
                className={styles.textarea}
                rows={3}
                value={data.sidebarNote.text}
                onChange={(e) =>
                  patch({
                    sidebarNote: { ...data.sidebarNote, text: e.target.value },
                  })
                }
                placeholder="Informação de destaque exibida na sidebar"
              />
            </div>
          </section>
        </div>

        <div
          className={`${styles.column} ${styles.previewColumn} ${
            tab === "preview" ? styles.colVisible : ""
          }`}
        >
          <div className={styles.previewPanel}>
            <div className={styles.previewLabel}>
              <span>Preview em tempo real</span>
            </div>
            <div className={styles.previewScroll}>
              <ArticlePreview data={data} author={CURRENT_USER} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
