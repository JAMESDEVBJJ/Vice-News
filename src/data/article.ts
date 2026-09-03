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
  id: 101,
  category: "GAMEPLAY",
  title: "Todas as músicas que tocaram no novo Trailer 3 Extended Look",
  summary:
    "O recém-lançado Trailer 3 'Extended Look' de GTA VI trouxe cenas eletrizantes de Vice City embaladas por uma curadoria musical impecável. Confira a lista completa das faixas que marcaram o vídeo.",
  author: "James",
  publishedAt: "2026-09-03",
  readingTime: 4,
  heroImage:
    "https://www.rockstargames.com/VI/_next/static/media/Jason_and_Lucia_Beach_landscape.0419q._86ukpt.jpg",
  heroCaption:
    "A atmosfera vibrante de Vice City, onde a música dita o ritmo da cidade.",
  content: [
    {
      type: "paragraph",
      text: "O lançamento surpresa do aguardado Trailer 3 'Extended Look' de GTA VI dominou as redes sociais nesta manhã. Além das melhorias gráficas notáveis e novos detalhes sobre a relação de Jason e Lucia, um elemento clássico da Rockstar roubou a cena: a trilha sonora.",
    },
    {
      type: "paragraph",
      text: "Diferente do primeiro trailer, que focou em uma única música para definir o clima, o 'Extended Look' funcionou quase como uma demonstração das estações de rádio do jogo, apresentando diferentes faixas que se alinhavam dinamicamente com as transições de cenários e ações.",
    },
    {
      type: "heading",
      text: "A Lista Completa de Músicas",
    },
    {
      type: "paragraph",
      text: "Graças aos esforços conjuntos da comunidade, que analisou cada segmento de áudio do trailer de 3 minutos, conseguimos identificar todas as canções licenciadas (e uma possível faixa original). Veja a lista:",
    },
    {
      type: "list",
      items: [
        "Tom Petty - 'Runnin' Down A Dream' (Toca durante a cena inicial nas rodovias de Leonida)",
        "The Weeknd - 'Blinding Lights' (Marca a transição para a vibrante vida noturna de Vice City)",
        "Anita Ward - 'Ring My Bell' (Som de fundo no trecho que mostra o interior do clube noturno)",
        "Faixa Instrumental Desconhecida - (Toca durante a fuga intensa da polícia no final; possivelmente uma música original composta para GTA VI)",
      ],
    },
    {
      type: "highlight",
      label: "CURIOSIDADE",
      text: "A inclusão de Tom Petty reforça o gosto musical da equipe de áudio da Rockstar, que já havia utilizado brilhantemente 'Love Is A Long Road' do mesmo artista no Trailer 1.",
    },
    {
      type: "heading",
      text: "O Impacto da Curadoria Musical",
    },
    {
      type: "paragraph",
      text: "Em poucas horas, as músicas licenciadas apresentaram um salto gigantesco de reproduções nas plataformas de streaming como o Spotify e Apple Music. Isso demonstra o poder cultural que a franquia Grand Theft Auto ainda exerce sobre a indústria fonográfica global.",
    },
    {
      type: "gallery",
      images: [
        {
          src: "https://www.rockstargames.com/VI/_next/static/media/DreQuan_Priest_landscape.0_b7hszyze6cy.jpg",
          alt: "Cenário de um trapper no baile de vice city.",
        },
        {
          src: "https://www.rockstargames.com/VI/_next/static/media/Lucia_Caminos_10.0s770xrip~yb..jpg",
          alt: "Perseguição de carros em alta velocidade pelas ruas de Leonida",
        },
      ],
    },
    {
      type: "quote",
      text: "A música no GTA sempre serviu para capturar a essência de uma era e de um local. Vice City exige aquele contraste entre o glamour ensolarado e a sujeira noturna, e essa trilha resumiu isso perfeitamente.",
      cite: "Comunidade GTA Forums",
    },
    {
      type: "paragraph",
      text: "Ainda não sabemos se a Rockstar vai lançar uma playlist oficial em breve, mas os fãs já se encarregaram de compilar essas músicas e criar suas próprias 'rádios' para entrar no clima do jogo enquanto aguardam o lançamento oficial.",
    },
  ],
  tags: ["GTA VI", "Trailer", "Música", "Trilha Sonora", "Vice City"],
  sidebarNote: {
    label: "FEBRE NO SPOTIFY",
    text: "Fãs já criaram dezenas de playlists recriando a 'Vibe Vice City' com base nas faixas reveladas neste trailer, acumulando milhares de curtidas.",
  },
};

export const sidebarHighlight = columnArticles[0];

export const relatedNews = latestNews.slice(0, 3);
