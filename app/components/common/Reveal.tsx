"use client";

import { motion } from "framer-motion";
import { useRevealInView } from "@/lib/useRevealInView";

type Props = {
  children: React.ReactNode;
  variants: any;
  className?: string;
  delayRange?: number;
  // optional overrides for when the reveal starts (defaults come from useRevealInView)
  amount?: number;
  margin?: `${number}px` | `${number}px ${number}px`;
  // extra delay (s) added to the "show" animation, e.g. to wait for something above to animate first
  delay?: number;
};

export default function Reveal({
  children,
  variants,
  className,
  delayRange = 0.22,
  amount,
  margin,
  delay = 0,
}: Props) {
  const { ref, controls } = useRevealInView({
    delayRange,
    ...(amount !== undefined && { amount }),
    ...(margin !== undefined && { margin }),
  });

  return (
    <motion.div
      ref={ref}
      variants={
        delay
          ? { ...variants, show: { ...variants?.show, transition: { ...variants?.show?.transition, delay } } }
          : variants
      }
      initial="hidden"
      animate={controls}
      className={className}
    >
      {children}
    </motion.div>
  );
}
