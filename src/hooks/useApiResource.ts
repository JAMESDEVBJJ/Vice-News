import { useCallback, useEffect, useState } from "react";

export type ResourceStatus = "loading" | "success" | "error";

interface ResourceState<T> {
  status: ResourceStatus;
  data: T | undefined;
  error: unknown;
}

const LOADING = { status: "loading", data: undefined, error: null } as const;

/**
 * Carrega um recurso da API ao montar o componente, cancelando a requisição ao
 * desmontar. `load` deve ser estável (função de módulo ou memoizada).
 */
export function useApiResource<T>(load: (signal: AbortSignal) => Promise<T>) {
  const [state, setState] = useState<ResourceState<T>>(LOADING);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    load(controller.signal)
      .then((data) => setState({ status: "success", data, error: null }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({ status: "error", data: undefined, error });
      });

    return () => controller.abort();
  }, [load, attempt]);

  const retry = useCallback(() => {
    setState(LOADING);
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, retry };
}
