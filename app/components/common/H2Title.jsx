"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const H2Title = ({
  titleText,
  titleColor,
  marginClass,
  maxW,
  delay = 0.2 // Add delay prop with default 0
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // Split text into words
  const words = titleText.split(" ");

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: delay, // Use the delay prop here
        delay: delay // Add delay to the main transition
      }
    }
  };

  const child = {
    hidden: {
      y: "100%",
      opacity: 0
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.33, 1, 0.68, 1]
      }
    }
  };

  return (
    <h2 ref={ref} className={`text-[1.7rem] xs:text-[1.8rem] md:text-[2rem] lg:text-[2.3rem] xl:text-[2.5rem] 2xl:text-[2.6rem] 3xl:text-60 font-light leading-[1.166666666666667] text-${titleColor} ${marginClass} ${maxW}`} >
      <motion.span
        variants={container}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
      >
        {words.map((word, wordIndex) => (
          <span key={wordIndex}>
            <span className="overflow-hidden inline-block align-top">
              <motion.span
                variants={child}
                className="inline-block"
              >
                {word}
              </motion.span>
            </span>
            {wordIndex < words.length - 1 && " "}
          </span>
        ))}
      </motion.span>
    </h2>
  );
};

export default H2Title;