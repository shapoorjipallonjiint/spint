"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import H2Title from "../../../../components/common/H2Title";
import Image from "next/image";
import { fadeIn, moveUp } from "../../../motionVarients";

const MotionImage = motion.create(Image);

const LeaderItem = ({ item, imageOffset }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], imageOffset);

    return (
        <div className="grid items-center lg:grid-cols-2 gap-y-10">
            {/* IMAGE */}
            <div ref={containerRef} className="relative flex justify-end">
                <MotionImage
                    width={1000}
                    height={1920}
                    src={item.image}
                    alt={item.imageAlt}
                    style={{ y }}
                    variants={fadeIn(0.6)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="relative z-20"
                />

                <motion.div
                    style={{ y }}
                    className="absolute bottom-0 left-0 w-full h-[70%] bg-primary z-10"
                />
            </div>

            {/* TEXT */}
            <div>
                <H2Title titleText={item.name} />
                <motion.h3
                    variants={moveUp(0.4)}
                    initial="hidden"
                    whileInView="show"
                >
                    {item.designation}
                </motion.h3>

                {item.description.split("\n").map((p, i) => (
                    <p key={i} className="mt-3">
                        {p}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default LeaderItem;
