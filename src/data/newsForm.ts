//form compativel com o articulo em tempo real, para futuramente usar com uma API (provavel C#)
import type { ArticleBlock } from "./article";
import type { NewsCategory } from "./mockNews";

export interface NewsFormData {
  title: string;
  summary: string;
  category: NewsCategory;
  tags: string[];
  heroImage: string;
  heroCaption?: string;
  content: ArticleBlock[];
  sidebarNote: { label: string; text: string };
  featured: boolean;
}

export const CURRENT_USER = "James";

export const NEWS_CATEGORIES: NewsCategory[] = [
  "ROCKSTAR",
  "VAZAMENTOS",
  "RUMORES",
  "GAMEPLAY",
  "PERSONAGENS",
];

export type BlockType = ArticleBlock["type"];

export const BLOCK_LABELS: Record<BlockType, string> = {
  paragraph: "Parágrafo",
  heading: "Título",
  highlight: "Destaque",
  image: "Imagem",
  gallery: "Galeria",
  list: "Lista",
  quote: "Citação",
};

export const BLOCK_TYPES: BlockType[] = [
  "paragraph",
  "heading",
  "highlight",
  "image",
  "gallery",
  "list",
  "quote",
];

export function createBlock(type: BlockType): ArticleBlock {
  switch (type) {
    case "paragraph":
      return { type, text: "" };
    case "heading":
      return { type, text: "" };
    case "highlight":
      return { type, label: "PONTO DESTAQUE", text: "" };
    case "image":
      return { type, src: "", alt: "", caption: "" };
    case "gallery":
      return { type, images: [{ src: "", alt: "" }] };
    case "list":
      return { type, items: [""] };
    case "quote":
      return { type, text: "", cite: "" };
  }
}

export function emptyForm(): NewsFormData {
  return {
    title: "",
    summary: "",
    category: "ROCKSTAR",
    tags: [],
    heroImage: "",
    heroCaption: "",
    content: [],
    sidebarNote: { label: "PONTO DESTAQUE", text: "" },
    featured: false,
  };
}

export interface FormErrors {
  title?: string;
  summary?: string;
  heroImage?: string;
  content?: string;
  blocks: Record<number, string>;
}

export function validateForm(data: NewsFormData): FormErrors {
  const errors: FormErrors = { blocks: {} };

  if (!data.title.trim()) errors.title = "Informe um título.";
  if (!data.summary.trim()) errors.summary = "Informe um resumo.";
  if (!data.heroImage.trim()) errors.heroImage = "Adicione uma imagem de capa.";
  if (data.content.length === 0)
    errors.content = "Adicione ao menos um bloco de conteúdo.";

  data.content.forEach((block, index) => {
    switch (block.type) {
      case "paragraph":
      case "heading":
      case "quote":
        if (!block.text.trim()) errors.blocks[index] = "Preencha o texto.";
        break;
      case "highlight":
        if (!block.text.trim()) errors.blocks[index] = "Preencha o destaque.";
        break;
      case "image":
        if (!block.src.trim())
          errors.blocks[index] = "Informe a URL da imagem.";
        break;
      case "gallery":
        if (block.images.every((img) => !img.src.trim()))
          errors.blocks[index] = "Adicione ao menos uma imagem.";
        break;
      case "list":
        if (block.items.every((item) => !item.trim()))
          errors.blocks[index] = "Adicione ao menos um item.";
        break;
    }
  });

  return errors;
}

export function hasErrors(errors: FormErrors): boolean {
  return Boolean(
    errors.title ||
      errors.summary ||
      errors.heroImage ||
      errors.content ||
      Object.keys(errors.blocks).length > 0
  );
}
