"use client";

// import { regionalData } from "../data";
import H2Title from "../../../common/H2Title";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from 'next/image'
import { moveUp } from "../../../motionVarients";
import {certificates} from '../data'

const Certificates = ({ data }) => {
    const MotionImage = motion.create(Image);
    return (
        <section className="py-30">
            <div className="container ">
                {/* <H2Title titleText={data.title} titleColor="black" marginClass="mb-4 2xl:mb-50px" /> */}
                <div className="relative">

                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 3xl:grid-cols-4 gap-y-[80px]">
                {certificates.map((item,index)=>(
                    <div className="">
                                <div className="pb-[50px] flex max-md:justify-center 3xl:pr-[137px]">
                                <MotionImage
                                    variants={moveUp(0.5 + 0.2 * 2)}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ amount: 0.2, once: true }}
                                    src={'/assets/images/accreditation/cert-1.jpg'}
                                    alt={"Image"}
                                    width={276}
                                    height={400}
                                    className="h-[400px] object-cover w-[276px] "
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
                                    EN ISO 9001
                                </motion.h3>
                                </div>
                                
                            </div>
                ))}
                

                </div>
                </div>
            </div>
        </section>
    );
};

export default Certificates;
