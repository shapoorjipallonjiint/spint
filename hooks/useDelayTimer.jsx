import { useRef } from "react";

export function useFirstTimeDelay(trigger, firstDelay, regularDelay) {
  const firstRun = useRef(true);

  if (!trigger) return null;

  if (firstRun.current) {
    firstRun.current = false;
    return firstDelay;      // First time entering section → BIG DELAY
  }

  return regularDelay;      // After first time → SMALL DELAY
}
