"use client";

import { useEffect } from "react";

// For a horizontally scrollable element (e.g. the world map on small screens): on load, scroll it so the point at
// `fraction` of its scroll width (0 = left edge, 1 = right edge) sits in the middle of the visible area.
// Only below `maxWidth` (where it scrolls); works for RTL pages too, where scrollLeft runs from the right.
export function useInitialScrollFocus(ref, fraction, maxWidth = 1023) {
    useEffect(() => {
        const el = ref.current;
        if (!el || window.innerWidth > maxWidth) return;

        const focus = () => {
            const overflow = el.scrollWidth - el.clientWidth;
            if (overflow <= 0) return;
            const fromLeft = Math.min(overflow, Math.max(0, el.scrollWidth * fraction - el.clientWidth / 2));
            const rtl = window.getComputedStyle(el).direction === "rtl";
            el.scrollLeft = rtl ? fromLeft - overflow : fromLeft;
        };

        focus();
        // once more after layout settles (fonts / images), only if the user hasn't scrolled yet
        const initial = el.scrollLeft;
        const timer = setTimeout(() => {
            if (el.scrollLeft === initial) focus();
        }, 300);
        return () => clearTimeout(timer);
    }, [ref, fraction, maxWidth]);
}
