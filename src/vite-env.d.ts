/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base da API, incluindo o prefixo /api (ex.: https://localhost:7067/api). */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
