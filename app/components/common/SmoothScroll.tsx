/* "use client";

import { ReactLenis } from "@studio-freight/react-lenis";

const SmoothScroll = ({ children }) => {
  return (
    <ReactLenis root options={{ duration: 1.8, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
};

export default SmoothScroll; */
"use client";

import { useEffect } from "react";
import Lenis from "lenis";

const SmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy(); // Cleanup to prevent memory leaks
    };
  }, []);

  return null;
};

export default SmoothScroll; 