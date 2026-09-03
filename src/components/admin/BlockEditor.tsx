import { ArrowUp, ArrowDown, Copy, Trash2, Plus, X } from "lucide-react";
import type { ArticleBlock } from "../../data/article";
import { BLOCK_LABELS } from "../../data/newsForm";
import styles from "./BlockEditor.module.css";

interface BlockEditorProps {
  block: ArticleBlock;
  index: number;
  total: number;
  error?: string;
  onChange: (index: number, block: ArticleBlock) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onDuplicate: (index: number) => void;
  onRemove: (index: number) => void;
}

export default function BlockEditor({
  block,
  index,
  total,
  error,
  onChange,
  onMove,
  onDuplicate,
  onRemove,
}: BlockEditorProps) {
  const update = (next: ArticleBlock) => onChange(index, next);

  const handleRemove = () => {
    if (window.confirm("Remover este bloco? Esta ação não pode ser desfeita."))
      onRemove(index);
  };

  return (
    <div className={`${styles.card} ${error ? styles.cardError : ""}`}>
      <div className={styles.cardHead}>
        <span className={styles.type}>{BLOCK_LABELS[block.type]}</span>
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.ctrl}
            onClick={() => onMove(index, -1)}
            disabled={index === 0}
            aria-label="Mover bloco para cima"
          >
            <ArrowUp size={15} />
          </button>
          <button
            type="button"
            className={styles.ctrl}
            onClick={() => onMove(index, 1)}
            disabled={index === total - 1}
            aria-label="Mover bloco para baixo"
          >
            <ArrowDown size={15} />
          </button>
          <button
            type="button"
            className={styles.ctrl}
            onClick={() => onDuplicate(index)}
            aria-label="Duplicar bloco"
          >
            <Copy size={15} />
          </button>
          <button
            type="button"
            className={`${styles.ctrl} ${styles.ctrlDanger}`}
            onClick={handleRemove}
            aria-label="Remover bloco"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className={styles.cardBody}>
        {(block.type === "paragraph" || block.type === "highlight") && (
          <>
            {block.type === "highlight" && (
              <input
                className={styles.input}
                placeholder="Rótulo (ex.: PONTO DESTAQUE)"
                value={block.label ?? ""}
                onChange={(e) => update({ ...block, label: e.target.value })}
                aria-label="Rótulo do destaque"
              />
            )}
            <textarea
              className={styles.textarea}
              placeholder="Digite o texto..."
              value={block.text}
              rows={block.type === "paragraph" ? 4 : 3}
              onChange={(e) => update({ ...block, text: e.target.value })}
              aria-label="Texto do bloco"
            />
          </>
        )}

        {block.type === "heading" && (
          <input
            className={styles.input}
            placeholder="Texto do título"
            value={block.text}
            onChange={(e) => update({ ...block, text: e.target.value })}
            aria-label="Texto do título"
          />
        )}

        {block.type === "quote" && (
          <>
            <textarea
              className={styles.textarea}
              placeholder="Texto da citação..."
              value={block.text}
              rows={3}
              onChange={(e) => update({ ...block, text: e.target.value })}
              aria-label="Texto da citação"
            />
            <input
              className={styles.input}
              placeholder="Autoria / fonte (opcional)"
              value={block.cite ?? ""}
              onChange={(e) => update({ ...block, cite: e.target.value })}
              aria-label="Autoria da citação"
            />
          </>
        )}

        {block.type === "image" && (
          <>
            <input
              className={styles.input}
              placeholder="URL da imagem"
              value={block.src}
              onChange={(e) => update({ ...block, src: e.target.value })}
              aria-label="URL da imagem"
            />
            {block.src && (
              <img className={styles.imgPreview} src={block.src} alt="" />
            )}
            <input
              className={styles.input}
              placeholder="Texto alternativo (alt)"
              value={block.alt}
              onChange={(e) => update({ ...block, alt: e.target.value })}
              aria-label="Texto alternativo"
            />
            <input
              className={styles.input}
              placeholder="Legenda (opcional)"
              value={block.caption ?? ""}
              onChange={(e) => update({ ...block, caption: e.target.value })}
              aria-label="Legenda da imagem"
            />
          </>
        )}

        {block.type === "gallery" && (
          <div className={styles.subList}>
            {block.images.map((image, i) => (
              <div key={i} className={styles.subRow}>
                <div className={styles.subFields}>
                  <input
                    className={styles.input}
                    placeholder={`URL da imagem ${i + 1}`}
                    value={image.src}
                    onChange={(e) => {
                      const images = block.images.slice();
                      images[i] = { ...images[i], src: e.target.value };
                      update({ ...block, images });
                    }}
                    aria-label={`URL da imagem ${i + 1}`}
                  />
                  <input
                    className={styles.input}
                    placeholder="Texto alternativo (alt)"
                    value={image.alt}
                    onChange={(e) => {
                      const images = block.images.slice();
                      images[i] = { ...images[i], alt: e.target.value };
                      update({ ...block, images });
                    }}
                    aria-label={`Alt da imagem ${i + 1}`}
                  />
                </div>
                <button
                  type="button"
                  className={styles.ctrl}
                  onClick={() => {
                    const images = block.images.filter((_, j) => j !== i);
                    update({
                      ...block,
                      images: images.length ? images : [{ src: "", alt: "" }],
                    });
                  }}
                  aria-label={`Remover imagem ${i + 1}`}
                >
                  <X size={15} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className={styles.addSub}
              onClick={() =>
                update({
                  ...block,
                  images: [...block.images, { src: "", alt: "" }],
                })
              }
            >
              <Plus size={14} /> Adicionar imagem
            </button>
          </div>
        )}

        {block.type === "list" && (
          <div className={styles.subList}>
            {block.items.map((item, i) => (
              <div key={i} className={styles.subRow}>
                <input
                  className={styles.input}
                  placeholder={`Item ${i + 1}`}
                  value={item}
                  onChange={(e) => {
                    const items = block.items.slice();
                    items[i] = e.target.value;
                    update({ ...block, items });
                  }}
                  aria-label={`Item ${i + 1}`}
                />
                <button
                  type="button"
                  className={styles.ctrl}
                  onClick={() => {
                    const items = block.items.filter((_, j) => j !== i);
                    update({ ...block, items: items.length ? items : [""] });
                  }}
                  aria-label={`Remover item ${i + 1}`}
                >
                  <X size={15} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className={styles.addSub}
              onClick={() => update({ ...block, items: [...block.items, ""] })}
            >
              <Plus size={14} /> Adicionar item
            </button>
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}
