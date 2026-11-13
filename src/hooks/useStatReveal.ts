import { useEffect, useState, useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

const getReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;
const getServerReducedMotion = () => false;

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion
  );
}

interface StatRevealOptions {
  duration?: number;
  stagger?: number;
  startDelay?: number;
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

export function useStatReveal(
  targets: readonly number[],
  { duration = 900, stagger = 90, startDelay = 200 }: StatRevealOptions = {}
): number[] {
  const reducedMotion = usePrefersReducedMotion();
  const count = targets.length;
  const key = targets.join("|");
  const [frame, setFrame] = useState({ key, elapsed: 0 });

  useEffect(() => {
    if (reducedMotion) return;

    const total = startDelay + stagger * Math.max(0, count - 1) + duration;
    let origin: number | null = null;
    let handle = 0;

    const tick = (now: number) => {
      if (origin === null) origin = now;
      const elapsed = now - origin;
      setFrame({ key, elapsed });
      if (elapsed < total) handle = requestAnimationFrame(tick);
    };

    handle = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(handle);
  }, [key, count, reducedMotion, startDelay, stagger, duration]);

  const elapsed = reducedMotion
    ? Infinity
    : frame.key === key
    ? frame.elapsed
    : 0;

  return targets.map((target, index) => {
    const progress = Math.min(
      1,
      Math.max(0, (elapsed - startDelay - index * stagger) / duration)
    );
    return progress === 1
      ? target
      : Math.round(target * easeOutCubic(progress));
  });
}
