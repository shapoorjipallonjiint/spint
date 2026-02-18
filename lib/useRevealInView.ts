"use client";

import { useEffect, useRef } from "react";
import { useInView, useAnimation } from "framer-motion";

type RootMargin =
  | `${number}px`
  | `${number}px ${number}px`
  | `${number}px ${number}px ${number}px`
  | `${number}px ${number}px ${number}px ${number}px`;

type Options = {
  margin?: RootMargin;
  amount?: number;
  delayRange?: number;
};

export function useRevealInView(options: Options = {}) {
  const {
    margin = "-30px 0px",
    amount = 0.25,
    delayRange = 0.22,
  } = options;

  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { margin, amount, once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (!inView) return;

    const delay = Math.random() * delayRange;

    const timer = setTimeout(() => {
      controls.start("show");
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [inView, controls, delayRange]);

  return { ref, controls };
}
