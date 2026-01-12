"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const SplitTextAnimation = ({
  children,
  className = "",
  staggerDelay,
  animationDuration,
  delay = 0 // Add delay prop with default 0
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // Extract text from children
  const getText = (children) => {
    if (typeof children === 'string') return children;
    if (Array.isArray(children)) return children.join('');
    return '';
  };

  const text = getText(children);
  // Split by line breaks
  const lines = text.split("\n");

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
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
        duration: animationDuration,
        ease: [0.33, 1, 0.68, 1]
      }
    }
  };

  return (
    <div ref={ref} className={className}>
      <motion.div
        variants={container}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
      >
        {lines.map((line, lineIndex) => (
          <p key={lineIndex} className="overflow-hidden">
            <motion.div
              variants={child}
            >
              {line}
              {lineIndex < lines.length - 1 && <br />}
            </motion.div>
          </p>
        ))}
      </motion.div>
    </div>
  );
};

export default SplitTextAnimation;