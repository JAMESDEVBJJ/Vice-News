import type { NewsCategory } from "./mockNews";
import { columnArticles, latestNews } from "./mockNews";

export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "highlight"; label?: string; text: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "gallery"; images: { src: string; alt: string }[] }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; cite?: string };

export interface FullArticle {
  id: number;
  category: NewsCategory;
  title: string;
  summary: string;
  author: string;
  publishedAt: string;
  readingTime: number;
  heroImage: string;
  heroCaption?: string;
  content: ArticleBlock[];
  tags: string[];
  sidebarNote: { label: string; text: string };
}

export const article: FullArticle = {
  id: 100,
  category: "VAZAMENTOS",
  title:
    "GTA VI pode ter novidades importantes no mapa de Vice City, segundo novas informações",
  summary:
    "Novos detalhes publicados recentemente reacendem discussões entre a comunidade sobre o mapa e a ambientação do próximo jogo da Rockstar.",
  author: "James",
  publishedAt: "2026-08-30",
  readingTime: 6,
  heroImage: "https://i.imgur.com/jS9dykA.png",
  heroCaption:
    "Cenário costeiro de Vice City ao entardecer — imagem capturada dentro do jogo.",
  content: [
    {
      type: "paragraph",
      text: "Nas últimas semanas, uma série de relatos ganhou tração dentro da comunidade de GTA VI. Segundo fontes que acompanham de perto o desenvolvimento, a Rockstar estaria expandindo áreas do mapa de Vice City que, até então, apareciam apenas de forma marginal nos materiais oficiais divulgados pelo estúdio.",
    },
    {
      type: "paragraph",
      text: "Ainda que nada tenha sido confirmado, o volume e a consistência das informações fizeram com que jogadores voltassem a discutir o tamanho real do mundo aberto e a densidade das regiões que ligam o centro urbano às zonas costeiras e pantanosas do estado fictício de Leonida.",
    },
    {
      type: "heading",
      text: "O que as novas informações indicam",
    },
    {
      type: "paragraph",
      text: "De acordo com os relatos, o foco não estaria apenas em ampliar a extensão do mapa, mas em aumentar a variedade de sistemas que reagem ao jogador. Isso inclui desde o comportamento do trânsito até a forma como diferentes bairros mudam de atmosfera ao longo do dia e da noite.",
    },
    {
      type: "highlight",
      label: "PONTO DESTAQUE",
      text: "Novas fontes indicam uma integração profunda de sistemas meteorológicos, incluindo tempestades dinâmicas e marés que alteram áreas costeiras.",
    },
    {
      type: "paragraph",
      text: "Se confirmado, esse nível de simulação seria um salto significativo em relação aos jogos anteriores da série, aproximando a experiência de um mundo verdadeiramente vivo — onde o ambiente deixa de ser cenário e passa a influenciar diretamente a jogabilidade.",
    },
    {
      type: "gallery",
      images: [
        {
          src: "https://sm.ign.com/t/ign_pt/photo/default/mega-14-1787856672033_ccde.1400.jpg",
          alt: "Vista aérea de uma avenida movimentada de Vice City",
        },
        {
          src: "https://sm.ign.com/t/ign_pt/photo/default/mega-9-1787856672032_e57k.1400.jpg",
          alt: "Orla de Vice City iluminada pelo pôr do sol",
        },
      ],
    },
    {
      type: "heading",
      text: "Por que a comunidade levou a sério",
    },
    {
      type: "paragraph",
      text: "Boa parte da credibilidade dessas informações vem do histórico de acertos de algumas das fontes envolvidas. Além disso, os detalhes se encaixam com pistas já presentes nos trailers oficiais, o que reforça a percepção de que não se trata apenas de especulação isolada.",
    },
    {
      type: "list",
      items: [
        "Referências recorrentes a regiões costeiras ainda não exploradas nos trailers.",
        "Indícios de um ciclo climático mais agressivo e imprevisível.",
        "Mudanças de ambientação entre bairros ao longo do dia.",
      ],
    },
    {
      type: "quote",
      text: "A ambição do mapa parece ser transformar Vice City em um personagem por si só — algo que respira e reage.",
      cite: "Fonte próxima ao desenvolvimento",
    },
    {
      type: "paragraph",
      text: "Vale reforçar que, até um anúncio oficial da Rockstar, tudo deve ser tratado com cautela. Ainda assim, o entusiasmo em torno do mapa mostra o quanto Vice City segue sendo o coração das expectativas da comunidade para GTA VI.",
    },
  ],
  tags: ["GTA VI", "Vazamentos", "Vice City"],
  sidebarNote: {
    label: "PONTO DESTAQUE",
    text: "Novas fontes indicam uma integração profunda de sistemas meteorológicos, incluindo tempestades dinâmicas e marés que alteram áreas costeiras.",
  },
};

/** Notícia em miniatura exibida na sidebar. */
export const sidebarHighlight = columnArticles[0];

/** Notícias exibidas na seção "Leia também". */
export const relatedNews = latestNews.slice(0, 3);
