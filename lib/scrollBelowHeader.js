// Bottom of whatever fixed / sticky bar covers the top of the screen (the mobile header), 0 if none.
const getHeaderBottom = () => {
    for (let node = document.elementFromPoint(window.innerWidth / 2, 1); node && node !== document.body; node = node.parentElement) {
        const position = getComputedStyle(node).position;
        if (position === "fixed" || position === "sticky") {
            const bottom = node.getBoundingClientRect().bottom;
            // a full-screen fixed layer (background, overlay) is not a header
            return bottom < window.innerHeight * 0.4 ? Math.max(0, bottom) : 0;
        }
    }
    return 0;
};

// Smoothly scrolls `el` to the top of the screen, just below the fixed / sticky header (if any).
// Native smooth scrollIntoView gets cancelled by Lenis, so this scrolls through Lenis when it's running.
export const scrollBelowHeader = (el, { gap = 16, duration = 0.9 } = {}) => {
    if (!el) return;
    const offset = getHeaderBottom() + gap;
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(el, { offset: -offset, duration });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: "smooth" });
};

// Same as scrollBelowHeader, but only scrolls when `el` isn't already fully visible below the header.
export const revealBelowHeader = (el, options) => {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top >= getHeaderBottom() && rect.bottom <= window.innerHeight) return;
    scrollBelowHeader(el, options);
};
