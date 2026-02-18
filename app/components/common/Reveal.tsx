"use client";

import { motion } from "framer-motion";
import { useRevealInView } from "@/lib/useRevealInView";

type Props = {
  children: React.ReactNode;
  variants: any;
  className?: string;
  delayRange?: number;
};

export default function Reveal({
  children,
  variants,
  className,
  delayRange = 0.22,
}: Props) {
  const { ref, controls } = useRevealInView({ delayRange });

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={controls}
      className={className}
    >
      {children}
    </motion.div>
  );
}
