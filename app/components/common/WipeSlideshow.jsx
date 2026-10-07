"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const WIPE_EASE = [0.77, 0, 0.175, 1];
const FULL = "inset(0% 0% 0% 0%)";

// Slideshow where every `delay` ms the current slide is wiped away right-to-left (left-to-right in Arabic)
// with a clip-path, revealing the next slide underneath, which settles from a slight zoom.
// renderSlide(item, index, isLayer, isCurrent): isLayer is true when the slide is drawn inside an absolutely
// positioned layer that it should fill (w-full h-full); false for the single-item / sizing render.
// isCurrent tells the slide whether it is the one showing (e.g. to run a nested slideshow only then).
// index: pass it to control the slide from outside (no autoplay); leave it out to autoplay every `delay` ms.
// active: autoplay only runs while true; when it turns true again it restarts from the first slide.
const WipeSlideshow = ({ items, renderSlide, delay = 3000, isArabic = false, index, active = true }) => {
    const count = items?.length || 0;
    const controlled = index !== undefined;
    const [autoIndex, setAutoIndex] = useState(0);
    const current = controlled ? index : autoIndex;
    const [outgoing, setOutgoing] = useState(null);
    const [shown, setShown] = useState(current);
    const [prevActive, setPrevActive] = useState(active);

    // adjust state during render (React's "previous value" pattern) rather than in an effect
    if (active !== prevActive) {
        setPrevActive(active);
        // becoming active again: jump back to the first slide (no wipe) so the timer starts over
        if (active && !controlled) {
            setAutoIndex(0);
            setShown(0);
            setOutgoing(null);
        }
    } else if (current !== shown) {
        // the slide changed (timer or parent): wipe the previous one away
        setOutgoing(shown);
        setShown(current);
    }

    // the timer starts once the wipe has finished, so every slide is fully on screen for `delay` ms
    useEffect(() => {
        if (controlled || !active || count < 2 || outgoing !== null) return;
        const timer = setTimeout(() => setAutoIndex((i) => (i + 1) % count), delay);
        return () => clearTimeout(timer);
    }, [controlled, active, autoIndex, count, delay, outgoing]);

    if (count === 0) return null;
    if (count === 1) return renderSlide(items[0], 0, false, true);

    return (
        <div className="relative overflow-hidden">
            {/* sizes the box exactly like a single slide would */}
            <div className="invisible" aria-hidden="true">
                {renderSlide(items[0], 0, false, false)}
            </div>

            {/* every slide keeps its own layer (and state); the outgoing one is clipped away on top of the current one */}
            {items.map((item, i) => {
                const isCurrent = i === current;
                const isOutgoing = i === outgoing;
                return (
                    // outer layer: stacking + the clip-path wipe; inner layer: the zoom. Kept separate so the
                    // zoom finishing can't be mistaken for the wipe finishing (which would cut the wipe short).
                    <motion.div
                        key={i}
                        className="absolute inset-0"
                        aria-hidden={!isCurrent}
                        style={{ zIndex: isOutgoing ? 2 : isCurrent ? 1 : 0, opacity: isCurrent || isOutgoing ? 1 : 0 }}
                        initial={false}
                        animate={{ clipPath: isOutgoing ? (isArabic ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)") : FULL }}
                        transition={isOutgoing ? { duration: 0.9, ease: WIPE_EASE } : { duration: 0 }}
                        onAnimationComplete={() => {
                            if (isOutgoing) setOutgoing((o) => (o === i ? null : o));
                        }}
                    >
                        <motion.div
                            className="w-full h-full"
                            initial={false}
                            animate={{ scale: isCurrent || isOutgoing ? 1 : 1.08 }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {renderSlide(item, i, true, isCurrent)}
                        </motion.div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default WipeSlideshow;
