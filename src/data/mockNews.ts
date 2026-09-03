//dados mockados ficticios para testes
export type NewsCategory =
  | "GAMEPLAY"
  | "PERSONAGENS"
  | "ROCKSTAR"
  | "VAZAMENTOS"
  | "RUMORES";

export interface NewsArticle {
  id: number;
  title: string;
  category: NewsCategory;
  summary: string;
  image: string;
  author: string;
  publishedAt: string;
  readingTime: number;
  featured?: boolean;
}

export interface Guide {
  id: number;
  title: string;
  category: string;
  image: string;
  readingTime: number;
}

export const CATEGORY_FILTERS = [
  "TODAS",
  "ROCKSTAR",
  "VAZAMENTOS",
  "RUMORES",
  "GAMEPLAY",
] as const;

export type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

const img = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`;

export const featuredArticle: NewsArticle = {
  id: 1,
  title: "Tudo que foi mostrado no Extended Look de GTA 6",
  category: "ROCKSTAR",
  summary:
    "Exibido hoje na Netflix, o especial reúne quase 30 minutos de material inteiramente capturado dentro do próprio jogo, misturando exploração do mundo aberto e cenas cinematográficas.",
  image: "https://i.imgur.com/jS9dykA.png",
  author: "James",
  publishedAt: "2026-08-15",
  readingTime: 5,
  featured: true,
};

export const secondaryArticles: NewsArticle[] = [
  {
    id: 2,
    title: "Vazamento de gameplay mostra mecânicas de combate atualizadas",
    category: "GAMEPLAY",
    summary:
      "Sequências indicam um sistema de tiro reformulado e maior liberdade de movimentação.",
    image:
      "https://sm.ign.com/t/ign_pt/photo/default/mega-14-1787856672033_ccde.1400.jpg",
    author: "James",
    publishedAt: "2026-08-16",
    readingTime: 5,
  },
  {
    id: 3,
    title:
      "Netflix registrou mais de 3 mil relatos de instabilidade durante os 26 minutos de gameplay do GTA 6.",
    category: "ROCKSTAR",
    summary:
      "Rostos conhecidos devem reaparecer em papéis inesperados na nova narrativa.",
    image: "https://i.imgur.com/oB31cVd.jpeg",
    author: "James",
    publishedAt: "2026-08-13",
    readingTime: 5,
  },
];

/** Coluna lateral de destaques compactos. */
export const columnArticles: NewsArticle[] = [
  {
    id: 4,
    title: "Data de lançamento de GTA VI não será adiada, diz rumor",
    category: "GAMEPLAY",
    summary:
      "Fontes apontam que os desenvolvedores vão atuar até a ultimas horas de lançamento para garantir polimento final do título.",
    image:
      "https://sm.ign.com/t/ign_pt/news/g/gta-6-reve/gta-6-reveal-15-new-screenshots-including-1-exclusive-on-ign_w5c4.1400.jpg",
    author: "Ana Rocha",
    publishedAt: "2026-08-15",
    readingTime: 4,
  },
  {
    id: 5,
    title: "Modo online promete ser revolucionário",
    category: "GAMEPLAY",
    summary:
      "Estrutura social do modo multiplayer deve ser o pilar do jogo por anos.",
    image: "https://i.imgur.com/UjyVdfy.jpeg",
    author: "Ana Rocha",
    publishedAt: "2026-08-15",
    readingTime: 6,
  },
  {
    id: 6,
    title: "Todos os rumores confirmados até agora sobre a Vice City de 2025",
    category: "RUMORES",
    summary:
      "Reunimos o que já é tratado como quase certo pela comunidade e pela imprensa.",
    image:
      "https://images.unsplash.com/photo-1623424455593-da762bf80815?w=400&h=300&fit=crop&auto=format",
    author: "Ana Rocha",
    publishedAt: "2026-08-15",
    readingTime: 8,
  },
];

export const latestNews: NewsArticle[] = [
  {
    id: 7,
    title: "Novos detalhes sobre o sistema de veículos",
    category: "GAMEPLAY",
    summary:
      "Físicas de direção mais realistas e customização profunda de carros.",
    image: img("1726607430822-1825ea40e648"),
    author: "James",
    publishedAt: "2026-08-14",
    readingTime: 5,
  },
  {
    id: 8,
    title: "Conheça os protagonistas de GTA VI: Lucia e Jason",
    category: "PERSONAGENS",
    summary: "A primeira dupla jogável da série ganha profundidade narrativa.",
    image: "https://i.imgur.com/4uyosh1.png",
    author: "Ana Rocha",
    publishedAt: "2026-08-12",
    readingTime: 6,
  },
  {
    id: 9,
    title: "Vazamento revela sistema de crime e polícia renovado",
    category: "VAZAMENTOS",
    summary:
      "IA das forças policiais reagirá de forma dinâmica às ações do jogador.",
    image: "https://i.imgur.com/nJajfoZ.png",
    author: "James",
    publishedAt: "2026-08-10",
    readingTime: 4,
  },
  {
    id: 10,
    title: "Todas as musicas que teve no novo Trailer 3 Extended Look",
    category: "ROCKSTAR",
    summary:
      "Cronograma pode ter mudado para priorizar estabilidade no lançamento.",
    image:
      "https://sm.ign.com/t/ign_pt/photo/default/mega-9-1787856672032_e57k.1400.jpg",
    author: "Ana Rocha",
    publishedAt: "2026-08-08",
    readingTime: 5,
  },
];

export const guides: Guide[] = [
  {
    id: 1,
    title: "Guia completo de armas e acessórios",
    category: "GUIA",
    image: "https://i.imgur.com/1Mh3iqT.jpeg",
    readingTime: 15,
  },
  {
    id: 2,
    title: "Como ganhar dinheiro no GTA VI",
    category: "GUIA",
    image:
      "https://preview.redd.it/screenshots-in-hdr-in-4k-v0-srnipznnu7ze1.jpg?width=3840&format=pjpg&auto=webp&s=b6b6240b116c15a9b8a5d14c6727d5e41c2e5881",
    readingTime: 8,
  },
  {
    id: 3,
    title: "Dicas de sobrevivência no mundo aberto",
    category: "GUIA",
    image:
      "https://preview.redd.it/screenshots-in-hdr-in-4k-v0-srnipznnu7ze1.jpg?width=3840&format=pjpg&auto=webp&s=b6b6240b116c15a9b8a5d14c6727d5e41c2e5881",
    readingTime: 6,
  },
];
