import { useEffect } from "react";

type LenisLike = { stop: () => void; start: () => void };

// Stops the page behind a modal from scrolling while `locked` is true.
// The body is pinned with position: fixed (offset by the current scroll) so wheel/touch scrolling has nothing to move,
// and the scroll position is restored on unlock. Lenis is paused too when it is running (SmoothScroll exposes it as window.__lenis).
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const html = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;
    const prev = {
      htmlOverflow: html.style.overflow,
      htmlScrollBehavior: html.style.scrollBehavior,
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    const lenis = (window as Window & { __lenis?: LenisLike }).__lenis;
    lenis?.stop();

    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.overflow;
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      // jump straight back; the global `scroll-behavior: smooth` would otherwise animate from the top
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, scrollY);
      html.style.scrollBehavior = prev.htmlScrollBehavior;
      lenis?.start();
    };
  }, [locked]);
}
