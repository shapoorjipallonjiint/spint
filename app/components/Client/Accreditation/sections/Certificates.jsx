"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { moveUp } from "../../../motionVarients";
import { useApplyLang } from "@/lib/applyLang";
import { useState, useEffect } from "react";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

const Certificates = ({ data }) => {
    const MotionImage = motion.create(Image);
    const t = useApplyLang(data);
    const isArabic = useIsPreferredLanguageArabic();

    const [itemIndex, setItemIndex] = useState(null);
    const [pdfIndex, setPdfIndex] = useState(0);
    const [isPdfLoading, setIsPdfLoading] = useState(true);

    const closeModal = () => {
        setItemIndex(null);
        setPdfIndex(0);
    };

    const currentItem = itemIndex !== null ? t[itemIndex] : null;
    const currentPdf =
        currentItem ? currentItem.accreditations[pdfIndex] : null;

    const nextPdf = () => {
        if (!currentItem) return;
        setPdfIndex((prev) =>
            (prev + 1) % currentItem.accreditations.length
        );
    };

    const prevPdf = () => {
        if (!currentItem) return;
        setPdfIndex((prev) =>
            (prev - 1 + currentItem.accreditations.length) %
            currentItem.accreditations.length
        );
    };

    useEffect(() => {
        if (itemIndex !== null) setIsPdfLoading(true);
    }, [itemIndex, pdfIndex]);

    useEffect(() => {
        const handleKeyDown = () => {
            if (!currentItem) return;
            if (e.key === "Escape") closeModal();
            if (e.key === "ArrowRight") nextPdf();
            if (e.key === "ArrowLeft") prevPdf();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentItem]);

    return (
        <section className="py30">
            <div className="container">
                {t.map((item, i) => (
                    <div key={i} className="py-8">
                        <h3 className="text-24 xl:text-24 3xl:text-32 font-normal text-gray-900 mb-10">
                            {item.name}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-y-[80px]">
                            {item.accreditations.map((singleItem, index) => (
                                <motion.div
                                    key={index}
                                    variants={moveUp(0.5 + index * 0.15)}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true }}
                                >
                                    <div
                                        className={`pb-6 lg:pb-[50px] flex justify-center ${isArabic ? "3xl:pl-[137px]" : "3xl:pr-[137px]"
                                            }`}
                                    >
                                        <MotionImage
                                            src={singleItem.fileImage}
                                            alt={singleItem.fileImageAlt}
                                            width={276}
                                            height={400}
                                            className="w-[276px] h-[400px] object-cover cursor-pointer"
                                            onClick={() => {
                                                setItemIndex(i);
                                                setPdfIndex(0);
                                            }}
                                        />
                                    </div>

                                    <div className="h-px bg-[#CCCCCC]" />

                                    <div className="pt-4 lg:pt-[30px] flex">
                                        <h3
                                            className={`text-19 text-black font-light leading-[28px] ${item.accreditations.length > 1
                                                ? "lg:max-w-[18ch]"
                                                : ""
                                                }`}
                                        >
                                            {singleItem.title}
                                        </h3>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* ================= MODAL ================= */}
            <AnimatePresence>
                {currentItem && currentPdf && (
                    <motion.div
                        className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                    >
                        <motion.div
                            className="bg-zinc-900 w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden relative"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center p-4 border-b border-white/10 text-white">
                                <div>
                                    <h3 className="font-medium">
                                        {currentItem.name} – {currentPdf.title}
                                    </h3>
                                    <p className="text-xs text-white/50">
                                        Document {pdfIndex + 1} of{" "}
                                        {currentItem.accreditations.length}
                                    </p>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="w-10 h-10 rounded-full hover:bg-white/10"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* PDF */}
                            <div className="flex-1 bg-white relative">
                                {isPdfLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                                        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
                                    </div>
                                )}

                                <iframe
                                    key={`${itemIndex}-${pdfIndex}`}
                                    src={`/api/pdf-proxy?url=${encodeURIComponent(
                                        currentPdf.file
                                    )}#toolbar=0`}
                                    className="w-full h-full"
                                    onLoad={() => setIsPdfLoading(false)}
                                />
                            </div>

                            {/* Navigation */}
                            {currentItem.accreditations.length > 1 && (
                                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
                                    <button
                                        onClick={prevPdf}
                                        className="pointer-events-auto w-12 h-12 bg-black/60 text-white rounded-full"
                                    >
                                        ←
                                    </button>
                                    <button
                                        onClick={nextPdf}
                                        className="pointer-events-auto w-12 h-12 bg-black/60 text-white rounded-full"
                                    >
                                        →
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Certificates;
