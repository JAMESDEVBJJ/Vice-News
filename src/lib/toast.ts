export type ToastVariant = "success" | "error" | "info";

export interface ToastItem {
  id: number;
  variant: ToastVariant;
  title: string;
  description?: string;
}

const DURATION_MS: Record<ToastVariant, number> = {
  success: 4500,
  info: 5000,
  error: 7000,
};

const MAX_VISIBLE = 4;

let toasts: readonly ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const timers = new Map<number, ReturnType<typeof setTimeout>>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function dismissToast(id: number) {
  clearTimeout(timers.get(id));
  timers.delete(id);

  if (!toasts.some((toast) => toast.id === id)) return;

  toasts = toasts.filter((toast) => toast.id !== id);
  emit();
}

function show(variant: ToastVariant, title: string, description?: string) {
  const id = nextId++;
  const visible = [...toasts, { id, variant, title, description }];

  visible.slice(0, -MAX_VISIBLE).forEach((toast) => {
    clearTimeout(timers.get(toast.id));
    timers.delete(toast.id);
  });

  toasts = visible.slice(-MAX_VISIBLE);
  timers.set(
    id,
    setTimeout(() => dismissToast(id), DURATION_MS[variant])
  );
  emit();

  return id;
}

export const toast = {
  success: (title: string, description?: string) =>
    show("success", title, description),
  error: (title: string, description?: string) =>
    show("error", title, description),
  info: (title: string, description?: string) =>
    show("info", title, description),
};

export function subscribeToToasts(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getToasts() {
  return toasts;
}
