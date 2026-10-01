"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
} from "framer-motion";
import H2Title from "../../../common/H2Title";

// Put your logo files in /public/clients/ and update the names here
const logos = [
  { name: "EMAC", src: "/clients/emac.png" },
  { name: "Emaar", src: "/clients/emaar.png" },
  { name: "Seven", src: "/clients/seven.png" },
  { name: "Saudi Electricity Company", src: "/clients/sec.png" },
  { name: "SABIC", src: "/clients/sabic.png" },
  { name: "Majid Al Futtaim", src: "/clients/majid-al-futtaim.png" },
];

const SPEED = 60; // pixels per second, raise to go faster

const LogoSlider = () => {
  const x = useMotionValue(0);
  const trackRef = useRef(null);
  const paused = useRef(false);
  const reduceMotion = useReducedMotion();

  useAnimationFrame((_, delta) => {
    if (paused.current || reduceMotion || !trackRef.current) return;

    // The list is rendered twice, so one full set = half the track width
    const setWidth = trackRef.current.scrollWidth / 2;
    let next = x.get() - (SPEED * delta) / 1000;
    if (next <= -setWidth) next += setWidth; // seamless wrap
    x.set(next);
  });

  return (
    <section className="py-80px">
      <div className="container">
        <H2Title titleText={"Our Clients"} marginClass={" mb-40px"} />
      </div>

      {/* Mask gives the soft fade on the left and right edges */}
      <div
        aria-label="Our clients"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
        className="overflow-hidden
          [-webkit-mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]
          [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]"
      >
        <motion.ul ref={trackRef} style={{ x }} className="flex w-max">
          {[...logos, ...logos].map((logo, i) => (
            <li
              key={`${logo.name}-${i}`}
              aria-hidden={i >= logos.length ? "true" : undefined}
              className="relative mr-2 h-[90px] w-[160px] shrink-0 border border-[#e6e6e6] bg-white sm:h-[110px] sm:w-[220px]"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                fill
                sizes="220px"
                className="object-contain p-5 sm:px-7"
              />
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
};

export default LogoSlider;