import { API_BASE_URL } from "../config/env";

export type ApiErrorKind =
  | "validation"
  | "not-found"
  | "conflict"
  | "server"
  | "network"
  | "invalid-response"
  | "unexpected";

export type FieldErrors = Record<string, string[]>;

const FALLBACK_MESSAGES: Record<ApiErrorKind, string> = {
  validation:
    "Alguns dados enviados são inválidos. Revise os campos destacados.",
  "not-found": "O recurso solicitado não foi encontrado.",
  conflict:
    "A operação entrou em conflito com dados já existentes. Tente novamente.",
  server:
    "Ocorreu um erro inesperado no servidor. Tente novamente em instantes.",
  network:
    "Não foi possível conectar à API. Verifique sua conexão e se o servidor está em execução.",
  "invalid-response": "A API retornou dados em um formato inesperado.",
  unexpected: "Não foi possível concluir a operação. Tente novamente.",
};

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly fieldErrors: FieldErrors;

  constructor(
    kind: ApiErrorKind,
    message: string = FALLBACK_MESSAGES[kind],
    options: { status?: number; fieldErrors?: FieldErrors } = {}
  ) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = options.status;
    this.fieldErrors = options.fieldErrors ?? {};
  }
}

interface ProblemDetails {
  title?: unknown;
  detail?: unknown;
  errors?: unknown;
}

function normalizeFieldKey(key: string): string {
  const [first = ""] = key.replace(/^\$\.?/, "").split(/[.[]/);
  return first.charAt(0).toLowerCase() + first.slice(1);
}

function readFieldErrors(errors: unknown): FieldErrors {
  if (typeof errors !== "object" || errors === null) return {};

  const result: FieldErrors = {};

  for (const [key, value] of Object.entries(errors)) {
    const messages = Array.isArray(value)
      ? value.filter(
          (message): message is string => typeof message === "string"
        )
      : [];

    if (messages.length === 0) continue;

    const field = normalizeFieldKey(key);
    result[field] = [...(result[field] ?? []), ...messages];
  }

  return result;
}

async function readProblemDetails(response: Response): Promise<ProblemDetails> {
  try {
    const data: unknown = await response.json();
    return typeof data === "object" && data !== null ? data : {};
  } catch {
    return {};
  }
}

function kindFromStatus(status: number): ApiErrorKind {
  if (status === 400) return "validation";
  if (status === 404) return "not-found";
  if (status === 409) return "conflict";
  if (status >= 500) return "server";
  return "unexpected";
}

async function toApiError(response: Response): Promise<ApiError> {
  const { status } = response;
  const kind = kindFromStatus(status);
  const problem = await readProblemDetails(response);
  const detail =
    typeof problem.detail === "string" ? problem.detail : undefined;

  switch (kind) {
    case "validation":
      return new ApiError(kind, detail, {
        status,
        fieldErrors: readFieldErrors(problem.errors),
      });
    case "not-found":
    case "conflict":
      return new ApiError(kind, detail, { status });
    case "server":
      return new ApiError(kind, undefined, { status });
    default:
      return new ApiError(kind, `A API respondeu com status ${status}.`, {
        status,
      });
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions<T> {
  method?: HttpMethod;
  body?: unknown;
  signal?: AbortSignal;
  validate: (data: unknown) => data is T;
}

/**
 * Executa uma requisição JSON contra a API. Erros HTTP, de rede e de formato viram
 * ApiError; cancelamentos via AbortSignal são repassados sem conversão.
 */
export async function apiRequest<T>(
  path: string,
  { method = "GET", body, signal, validate }: RequestOptions<T>
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new ApiError("network");
  }

  if (!response.ok) {
    throw await toApiError(response);
  }

  let data: unknown;

  try {
    data = await response.json();
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new ApiError("invalid-response", undefined, {
      status: response.status,
    });
  }

  if (!validate(data)) {
    throw new ApiError("invalid-response", undefined, {
      status: response.status,
    });
  }

  return data;
}

/** Mensagem amigável para qualquer erro lançado pela camada de API. */
export function getErrorMessage(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : FALLBACK_MESSAGES.unexpected;
}
