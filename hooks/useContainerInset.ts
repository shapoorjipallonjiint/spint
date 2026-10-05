import { RefObject, useEffect, useState } from "react";

// Distance from the viewport edges to a .container's content box (its margin + padding), on each side.
// Pass a ref to measure a specific container; otherwise the first .container on the page is used.
export function useContainerInset(ref?: RefObject<HTMLElement | null>) {
  const [inset, setInset] = useState({ left: 0, right: 0 });

  useEffect(() => {
    const el = ref?.current ?? document.querySelector<HTMLElement>(".container");
    if (!el) return;

    const calculate = () => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      setInset({
        left: rect.left + parseFloat(style.paddingLeft),
        right: document.documentElement.clientWidth - rect.right + parseFloat(style.paddingRight),
      });
    };

    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, [ref]);

  return inset;
}
