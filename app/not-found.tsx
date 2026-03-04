"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const MotionImage = motion(Image);

export default function NotFound() {
  const sectionRef = useRef(null);

  const { scrollYProgress: shapeProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const shapeY = useTransform(shapeProgress, [0, 1], [-200, 200]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-white pt-20 pb-12 sm:pt-24 sm:pb-16 xl:pt-30 xl:pb-20"
    >
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ y: -120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -right-6 bottom-0"
        >
          <MotionImage
            style={{ y: shapeY }}
            src="/assets/images/svg/sv-02.svg"
            alt=""
            width={432}
            height={607}
            className="w-[110px] sm:w-[210px] lg:w-[360px] 2xl:w-[432px]"
          />
        </motion.div>
        <motion.div
          initial={{ y: -160, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -left-6 top-16"
        >
          <MotionImage
            style={{ y: shapeY }}
            src="/assets/images/svg/sv-02.svg"
            alt=""
            width={432}
            height={607}
            className="w-[72px] -scale-x-100 opacity-30 sm:w-[160px] sm:opacity-35 lg:w-[280px]"
          />
        </motion.div>
      </div>

      <div className="container relative z-10">
        <div className="mx-auto max-w-[980px] border-y border-black/15 py-10 md:py-14 xl:py-18">
          <p className="text-19 font-light text-paragraph">Error page</p>

          <h1 className="relative mt-3 inline-block text-36 font-light leading-[1.08] text-black sm:text-48 xl:text-60">
            <span>404 - Page Not Found</span>
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 text-transparent bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.14)_40%,rgba(255,255,255,0.8)_50%,rgba(255,255,255,0.14)_60%,transparent_100%)] bg-[length:240%_100%] bg-clip-text"
              animate={{ backgroundPosition: ["220% 0%", "-220% 0%"] }}
              transition={{ duration: 5.6, repeat: Infinity, ease: "linear" }}
            >
              404 - Page Not Found
            </motion.span>
          </h1>

          <p className="mt-6 max-w-[62ch] text-19 font-light leading-[1.7] text-paragraph">
            The page you are trying to access is unavailable or may have moved.
            Use the links below to continue browsing.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3 md:gap-4">
            <Link
              href="/"
              className="inline-flex w-full sm:w-auto sm:min-w-[170px] items-center justify-center rounded-none border border-primary bg-primary px-6 py-3 text-16 font-medium text-white transition-colors duration-300 hover:bg-[#163a8a]"
            >
              Back to Home
            </Link>

            <Link
              href="/about-us"
              className="inline-flex w-full sm:w-auto sm:min-w-[170px] items-center justify-center rounded-none border border-primary px-6 py-3 text-16 font-medium text-primary transition-colors duration-300 hover:bg-[#eaf2ff]"
            >
              About Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
