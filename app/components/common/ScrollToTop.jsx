"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// set after the first render of a real page load (refresh / direct visit), shared by the en + ar layouts
let pageLoaded = false;

const samePath = (a, b) => {
  try {
    return decodeURI(a) === decodeURI(b);
  } catch {
    return a === b;
  }
};

// Scrolls to the top on link navigation only. A refresh/direct visit and browser back/forward
// keep the position the browser restores.
const ScrollToTop = () => {
  const pathname = usePathname();
  const lastPath = useRef(null);
  const poppedPath = useRef(null);

  useEffect(() => {
    // popstate fires (with the new URL already in location) before Next updates the pathname
    const onPopState = () => {
      poppedPath.current = window.location.pathname;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const prev = lastPath.current;
    const popped = poppedPath.current;
    lastPath.current = pathname;
    poppedPath.current = null;

    // StrictMode re-run of the same effect: nothing changed
    if (prev === pathname) return;
    // first render after a real page load: leave the browser's restored position
    if (prev === null && !pageLoaded) {
      pageLoaded = true;
      return;
    }
    // back/forward to this page
    if (popped && samePath(popped, pathname)) return;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto", // change to "smooth" if you want
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
