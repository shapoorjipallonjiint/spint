"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const Banner = ({ title, image }) => {
  const sectionRef = useRef(null);
  const imgRef = useRef(null);
  const overlayRef = useRef(null);
  const titleRef = useRef(null);
  const maskRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 1.4 },
      });

      tl
        // Step 1: mask slides left → right revealing the overlay + image
        .fromTo(
          maskRef.current,
          {
            x: "0%",
          },
          {
            x: "100%",
            duration: 1.6,
            ease: "power4.inOut",
          }
        )
        // Step 2: subtle image zoom-out
        .fromTo(
          imgRef.current,
          { scale: 1.15 },
          { scale: 1, duration: 1.6, ease: "power3.out" },
          "-=1.2"
        )
        // Step 3: text fade-in after reveal
        .fromTo(
          titleRef.current,
          { opacity: 0, x: -40 },
          { opacity: 1, x: 0, duration: 1, ease: "power3.out" },
          "-=0.6"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-[200px] md:h-[280px] lg:h-[350px] 2xl:h-[450px] 3xl:h-[560px] overflow-hidden bg-secondary/20">
      {/* Background Image */}
      {/* <img ref={imgRef} src={image} alt={title} className="absolute inset-0 w-full h-full object-cover object-center z-0" /> */}
<img
  ref={imgRef}
  src={image}
  alt={title}
  className="absolute inset-0 w-full h-full object-cover object-top z-0"
/>

      {/* Single Gradient Overlay (dark bottom → transparent top) */}
      <div ref={overlayRef} className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.75)_20%,rgba(0,0,0,0)_80%)] z-10"></div>

      {/* White mask that slides away to reveal the gradient */}
      <div ref={maskRef} className="absolute inset-0 bg-primary z-20"></div>

      {/* Content */}
      <div className="container relative z-30 h-full">
        <div className="flex flex-col justify-end h-full pb-5 sm:pb-8  md:pb-8 lg:pb-10 2xl:pb-13 3xl:pb-26">
          <h1 ref={titleRef} className="text-white text-60 xl:text-70 font-light leading-[1.08] capitalize">{title}</h1>
        </div>
      </div>
    </section>
  );
};

export default Banner;
