"use client";

import H2Title from "../../../common/H2Title";
import { motion } from "framer-motion";
import { moveUp } from "../../../motionVarients";
import InsideCounter from "../../../InsideCounter";
import Image from "next/image";

const Horizons = ({ data }) => {
    return (
        <section className="relative overflow-hidden pt-text90 pb30 bg-f5f5">
            <div className="container">
                <H2Title titleText={data.title} titleColor="black" marginClass="mb-50px" />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-6 lg:gap-y-10 xl:gap-y-[120px]">
                    {data.items.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={moveUp(0.1 * index)}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ amount: 0.2, once: true }}
                            className="group border-l border-black/20 border-t-cmnbdr lg:border-t-transparent border-y lg:border-y-2 lg:border-y-transparent bdrrst hover:border-y-2 hover:border-y-[#30B6F9]"
                        >
                            <h3 className="text-29 font-light leading-[1.311] mb-4 lg:mb-[22px]  px-3 lg:px-10 pt-4 lg:pt-7">
                                {item.name}
                            </h3>
                            <div className="relative">
                                <div className="absolute bottom-0 w-full h-0 group-hover:h-full group-hover:bg-[linear-gradient(180deg,rgba(48,182,249,0)_0%,rgba(48,182,249,0.75)_100%)] transition-all duration-300 ">
                                    <div className="h-0 w-8 group-hover:h-8 lg:w-10 group-hover:lg:h-10 2xl:w-20 group-hover:2xl:h-20 bg-primary flex items-center justify-center absolute bottom-0 transition-all duration-300 delay-100 ">
                                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 delay-150">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="32"
                                                height="32"
                                                viewBox="0 0 35 35"
                                                fill="none"
                                                className="w-4 h-4 xl:w-8 xl:h-8"
                                            >
                                                <path
                                                    d="M1.25 1.25012H33.2484V33.2412"
                                                    stroke="#30B6F9"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M33.2517 1.25L1.40625 33.2411"
                                                    stroke="#30B6F9"
                                                    strokeWidth="2.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <Image
                                    width={1920}
                                    height={310}
                                    src={item.image}
                                    alt={item.imageAlt}
                                    className="h-[200px] lg:h-[310px] object-cover w-full"
                                />
                            </div>
                            <div className="p-4 lg:p-7 2xl:p-10  2xl:pb-[35px]">
                                <div className="flex gap-5 lg:gap-[45px]   max-w-[413px]">
                                    <div className="w-[185px]">
                                        <p className="text-[30px] xl:text-40 leading-[1.3] font-light mb-[2px]">
                                            <InsideCounter value={item.projects} delay={10} />+
                                        </p>
                                        <p className="text-19 font-light text-black/70">Projects</p>
                                    </div>
                                    <div>
                                        <p className="text-[30px] xl:text-40 leading-[1.1] font-light mb-[2px]">
                                            <InsideCounter
                                                value={item.country}
                                                delay={10}
                                                suffix={item.location === "Oceania" ? "" : "+"}
                                            />
                                        </p>

                                        <p className="text-19 font-light text-black/70">Countries</p>
                                    </div>
                                </div>
                                <ul className="flex flex-wrap gap-2 ulst pt-3 lg:pt-5 2xl:pt-[35px] mt-3 lg:mt-5 2xl:mt-[35px] border-t border-black/20">
                                    {item.countries.map((country, i) => (
                                        <li key={i} className="text-19 text-paragraph font-light ">
                                            {country.name}
                                            <span className="text-[#30B6F9] pl-2 laststs">|</span>{" "}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Horizons;
