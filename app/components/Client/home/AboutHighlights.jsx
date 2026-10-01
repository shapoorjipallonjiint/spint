"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const highlights = [
  { title: "A Legacy of Trust", icon: "/assets/images/home/icons/legacy.svg" },
  {
    title: "Global Diversification",
    icon: "/assets/images/home/icons/legacy.svg",
  },
  {
    title: "Integrated Excellence",
    icon: "/assets/images/home/icons/legacy.svg",
  },
  {
    title: "Engineering the Future",
    icon: "/assets/images/home/icons/legacy.svg",
  },
  {
    title:
      "Across Every Frontier: Construction | Infrastructure | Water | Real Estate | Energy | Renewables",
    icon: "/assets/images/home/icons/legacy.svg",
  },
  {
    title: "Committed to Timely Delivery",
    icon: "/assets/images/home/icons/legacy.svg",
  },
  {
    title: "Building Global Partnerships",
    icon: "/assets/images/home/icons/legacy.svg",
  },
];

const SECONDS_PER_ITEM = 4;

// cuts the padding-box out of a gradient background, leaving only a 1px ring
const ringMask = {
  WebkitMask:
    "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
};

// Icon + title that cycle over time, with a white bar filling the stats line underneath.
// The bar's progress drives which highlight is shown, so both always stay in sync.
const AboutHighlights = ({ active, isArabic, containerRef }) => {
  const barRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    gsap.set(bar, { scaleX: 0 });
    setActiveIndex(0);
    if (!active) return;

    const count = highlights.length;
    const tween = gsap.to(bar, {
      scaleX: 1,
      duration: count * SECONDS_PER_ITEM,
      ease: "none",
      repeat: -1,
      onUpdate() {
        const index = Math.min(Math.floor(this.progress() * count), count - 1);
        setActiveIndex((prev) => (prev === index ? prev : index));
      },
    });

    return () => tween.kill();
  }, [active]);

  // track the rendered title height (changes when a title wraps to more lines, or on resize)
  const titleRef = useRef(null);
  const [titleHeight, setTitleHeight] = useState(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const height = entry.contentRect.height;
      // skip the empty moment between exit and enter (mode="wait") so it doesn't collapse
      if (height > 0) setTitleHeight(height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const current = highlights[activeIndex];

  return (
    <div
      ref={containerRef}
      className="relative z-[41] hidden lg:block pb-6 xl:pb-[30px] text-white"
    >
      {/* circle stays put; only the icon inside it swaps */}
      <div className="relative flex items-center justify-center w-14 h-14 xl:w-[60px] xl:h-[60px] 3xl:w-[67px] 3xl:h-[67px] rounded-full bg-white/12 backdrop-blur-[15px] mb-[13px]">
        {/* 1px gradient border: gradient bg masked down to a ring (border-image doesn't work with border-radius), spinning forever */}
        <span
          className="absolute inset-0 rounded-full p-px pointer-events-none animate-[spin_6s_linear_infinite] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0)_100%)]"
          style={ringMask}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Image
              src={current.icon}
              alt=""
              width={37}
              height={34}
              className="h-6 xl:h-7 3xl:h-8 w-auto"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* animate the title's height so 1-line <-> multi-line swaps glide instead of jumping the circle */}
      <motion.div
        className="overflow-hidden"
        animate={{ height: titleHeight ?? "auto" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div ref={titleRef}>
          <AnimatePresence mode="wait">
            <motion.h3
              key={activeIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-24 xl:text-29 font-light leading-[1.3] max-w-[30ch]"
            >
              {current.title}
            </motion.h3>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* sits exactly on top of the stats line (bottom edge of this block = top of the stats row) */}
      <span
        ref={barRef}
        className={`absolute -bottom-px left-0 w-full h-px bg-white ${isArabic ? "origin-right" : "origin-left"}`}
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
};

export default AboutHighlights;
