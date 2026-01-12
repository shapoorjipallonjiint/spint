"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { assets } from "@/app/assets";

type ImageLightboxProps = {
    src: string | null;
    alt?: string;
    onClose: () => void;
};

const ImageLightbox = ({ src, alt = "", onClose }: ImageLightboxProps) => {
    

    return (
        <AnimatePresence mode="wait">
            {src && <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
                onClick={onClose}
            >
                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1}}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="relative max-w-[95vw] max-h-[95vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="absolute -top-4 right-0 w-9 h-9 rounded-full border border-white text-black flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300"
                    >
                        <Image src={assets.close} width={20} height={20} alt="Close" className="w-3 h-3" />
                    </button>

                    {/* Image */}
                    <Image
                        src={src}
                        alt={alt}
                        width={1200}
                        height={1600}
                        className="max-w-full max-h-[80vh] object-contain"
                    />
                </motion.div>
            </motion.div>}
        </AnimatePresence>
    );
};

export default ImageLightbox;
