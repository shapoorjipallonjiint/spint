"use client";

// import { regionalData } from "../data";
import { motion } from "framer-motion";
import Image from 'next/image'
import { moveUp } from "../../../motionVarients";
import { useApplyLang } from "@/lib/applyLang";
import ImageLightbox from "../../../common/ImagePopup";
import { useState } from "react";

const Certificates = ({ data }) => {
    const MotionImage = motion.create(Image);
    const t = useApplyLang(data)
    const [activeImage, setActiveImage] = useState(null);
    return (
        <section className="py-30">
            <div className="container ">
                {/* <H2Title titleText={data.title} titleColor="black" marginClass="mb-4 2xl:mb-50px" /> */}
                <div className="relative">

                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 3xl:grid-cols-4 gap-y-[80px]">
                {t.items.map((item,index)=>(
                    <div className="" key={index}>
                                <div className="pb-[50px] flex max-md:justify-center 3xl:pr-[137px]">
                                <MotionImage
                                    variants={moveUp(0.5 + 0.2 * 2)}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ amount: 0.2, once: true }}
                                    src={item.fileImage}
                                    alt={item.fileImageAlt}
                                    width={276}
                                    height={400}
                                    className="h-[400px] object-cover w-[276px] "
                                    onClick={() => setActiveImage(item.fileImage)}
                                />
                                </div>
                                
        <div className="
          col-span-full
          h-px
          bg-[#CCCCCC]
          
        " />
      
                                <div className="flex max-md:justify-center pt-[30px]">
                                <motion.h3
                                    variants={moveUp(0.5 + 0.2 * 2)}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ amount: 0.2, once: true }}
                                    className="text-19 lg:text-29  text-black font-light leading-[38px]  max-w-[15ch]"
                                >
                                    {item.fileName}
                                </motion.h3>
                                </div>
                                
                            </div>
                ))}
                

                </div>
                </div>
            </div>
            <ImageLightbox src={activeImage} alt="Certificate preview" onClose={() => setActiveImage(null)} />
        </section>
    );
};

export default Certificates;
