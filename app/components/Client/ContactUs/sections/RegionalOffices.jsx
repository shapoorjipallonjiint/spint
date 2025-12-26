"use client";

// import { regionalData } from "../data";
import H2Title from "../../../common/H2Title";
import { motion } from "framer-motion";
import { zoomIn } from "../../../motionVarients";
import Link from "next/link";

const RegionalOffices = ({ data }) => {
    return (
        <section className="pt-text30  pb25">
            <div className="container ">
                <H2Title titleText={data.title} titleColor="black" marginClass="mb-4 2xl:mb-50px" />
                <div className="grid md:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-[506px_1fr_1fr] md:gap-y-8 3xl:gap-y-17">
                    {data.items?.map((office, index) => (
                        <motion.div
                            variants={zoomIn(0.4 + 0.1 * index)}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ amount: 0.2, once: true }}
                            key={index}
                            className="odd:md:border-r-0 odd:2xl:border-r-1 first:pt-0 first:md:pt-8 px-0 md:px-5 p-5 py-8 3xl:px-15 3xl:pb-15 md:border-r md:border-t border-b border-[#CCCCCC] no-border-right no-pl0 "
                        >
                            <div className="mb-2 md:mb-5">
                                {" "}
                                <h3 className="text-19 font-bold max-w-[32ch]">{office.name}</h3>
                            </div>
                            <p
                                className={`text-19 font-light  leading-[1.5] md:leading-[1.6] lg:leading-[1.48] text-paragraph ${
                                    office.phone || office.fax ? "mb-4 lg:mb-[45px]" : null
                                }`}
                                dangerouslySetInnerHTML={{ __html: office.address }}
                            ></p>

                            {office.phone || office.fax ? (
                                <div className="bg-f5f5 p-5 2xl:px-7 3xl:px-10 3xl:pt-[34px] 3xl:pb-[36px] md:max-w-[446px]">
                                    <div className="flex flex-wrap justify-between mb-5 lg:mb-[35px] ">
                                        {office.phone ? (
                                            <div>
                                                <p className="text-paragraph text-19 font-light mb-[4px] leading-[1.48] ">
                                                    Phone
                                                </p>
                                                <div>
                                                    {/* {office.phone.map((phone, index) => ( */}
                                                    <p
                                                        key={index}
                                                        className=" text-16 3xl:text-19 font-bold leading-[1.53] "
                                                    >
                                                        {office.phone}
                                                    </p>
                                                    {/* ))} */}
                                                </div>
                                            </div>
                                        ) : null}
                                        {office.fax ? (
                                            <div>
                                                <p className="text-paragraph text-19 font-light mb-[4px] leading-[1.48] ">
                                                    Fax
                                                </p>
                                                <p className=" text-16 3xl:text-19 font-bold leading-[1.31] ">
                                                    {office.fax}
                                                </p>
                                            </div>
                                        ) : null}
                                    </div>

                                    <Link href={office.location} target="blank">
                                        <div className="flex gap-[6px] items-center cursor-pointer">
                                            <p className="text-16 font-light leading-[1.75] uppercase text-paragraph">
                                                Location
                                            </p>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="15"
                                                height="19"
                                                viewBox="0 0 15 19"
                                                fill="none"
                                            >
                                                <g clipPath="url(#clip0_3796_2437)">
                                                    <path
                                                        d="M7.49886 1.06396C3.95699 1.06396 1.08594 3.91705 1.08594 7.43674C1.08594 8.72329 1.47165 9.91985 2.12904 10.9198L7.43513 17.7258L12.8653 10.9198C13.5261 9.91652 13.9084 8.71996 13.9084 7.43674C13.9151 3.91705 11.0407 1.06396 7.49886 1.06396Z"
                                                        stroke="#30B6F9"
                                                        strokeWidth="2"
                                                        strokeMiterlimit="10"
                                                        strokeLinecap="round"
                                                    />
                                                    <path
                                                        d="M7.5 10C8.88071 10 10 8.88071 10 7.5C10 6.11929 8.88071 5 7.5 5C6.11929 5 5 6.11929 5 7.5C5 8.88071 6.11929 10 7.5 10Z"
                                                        stroke="#30B6F9"
                                                        strokeWidth="2"
                                                        strokeMiterlimit="10"
                                                        strokeLinecap="round"
                                                    />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_3796_2437">
                                                        <rect width="15" height="19" fill="white" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </div>
                                    </Link>
                                </div>
                            ) : null}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RegionalOffices;
