// "use client";
// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { assets } from '../../assets';
// import { moveUp } from '../../motionVarients';

// const AccordionStyle1 = ({ accData }) => {
//   console.log(accData)
//   const [openIndex, setOpenIndex] = useState(1);
//   const toggleAccordion = (index) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   return (
//     <div className="space-y-1">
//       {accData.items.map((item, index) => (
//         <motion.div variants={moveUp(0.6 + 0.2 * index)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} key={index} className={`border-b border-cmnbdr relative  ${openIndex === index
//           ? 'pl-50px '
//           : 'pl-0 '
//           }`} >
//           <div className={`absolute left-0 top-[50%] translate-y-[-50%]  h-[80%] bg-[#30B6F9] ${openIndex === index
//             ? 'w-[3px] '
//             : 'w-0 '
//             }`} />
//           <button
//             onClick={() => toggleAccordion(index)}
//             className={`w-full ${openIndex === index ? 'pt-30px pb-2 xl:pb-[15px] ' : 'pt-30px pb-30px'} flex items-center justify-between text-left group`}
//           >
//             <div className="flex-1">
//               <h3 className="text-24 xl:text-24 3xl:text-32 leading-[1.3125] font-normal text-gray-900">
//                 {item.title}
//               </h3>
//               {item.subtitle && openIndex === index && (
//                 <motion.p
//                   initial={{ opacity: 0, y: -5 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3, delay: 0.1 }}
//                   className="text-19 leading-[1.526315789473684] text-paragraph"
//                 >
//                   {item.subtitle}
//                 </motion.p>
//               )}
//             </div>
//             <motion.div
//               animate={{ rotate: openIndex === index ? 180 : 0 }}
//               transition={{ duration: 0.3, ease: "easeInOut" }}
//               className={`flex-shrink-0 ml-4 w-6 h-6 md:w-10 md:h-10 xl:w-[50px] xl:h-[50px] rounded-full border  flex items-center justify-center transition-colors duration-300 ${openIndex === index
//                 ? 'bg-[#30B6F9] text-white border-[#30B6F9]'
//                 : 'bg-white border-black/20'
//                 }`}
//             >
//               {/* <ChevronDown size={18} /> */}
//               <img src={assets.arrowDown} alt="" width={15} height={15} className={`w-[10px] h-[10px] lg:w-[15px] lgh-[15px] xl:w-auto xl:h-auto ${openIndex === index
//                 ? 'brightness-0 invert-100'
//                 : ''
//                 }`} />
//             </motion.div>
//           </button>

//           <AnimatePresence initial={false}>
//             {openIndex === index && (
//               <motion.div
//                 initial={{ height: 0, opacity: 0 }}
//                 animate={{
//                   height: "auto",
//                   opacity: 1,
//                   transition: {
//                     height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
//                     opacity: { duration: 0.3, delay: 0.1 }
//                   }
//                 }}
//                 exit={{
//                   height: 0,
//                   opacity: 0,
//                   transition: {
//                     height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
//                     opacity: { duration: 0.2 }
//                   }
//                 }}
//                 className="overflow-hidden"
//               >
//                 <div className="pb-5 xl:pb-10">
//                   <motion.p variants={moveUp(0.001)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} className="text-19 text-paragraph font-light leading-[1.526315789473684] max-w-5xl">
//                     {item.content}
//                   </motion.p>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.div>
//       ))}
//     </div>
//   );
// };

// export default AccordionStyle1;

"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../../assets";
import { moveUp } from "@/app/components/motionVarients";
import Image from "next/image";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

const AccordionStyle1 = ({ accData }) => {
    const isArabic = useIsPreferredLanguageArabic();
    const [openIndex, setOpenIndex] = useState(1);
    const contentRefs = useRef([]);

    const toggleAccordion = (index) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };

    return (
        <div className="space-y-1">
            {accData.items.map((item, index) => (
                <motion.div
                    key={index}
                    variants={moveUp(0.4 + index * 0.15)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ amount: 0.2, once: true }}
                    className={`border-b border-cmnbdr relative transition-colors duration-500 mb-0 ${
                        openIndex === index ? (isArabic ? "pr-50px" : "pl-50px") : ""
                    }`}
                >
                    {/* LEFT ACTIVE BAR */}
                    <div
                        className={`absolute top-1/2 -translate-y-1/2 bg-[#30B6F9] ${
                            isArabic ? "right-0" : "left-0"
                        } w-[3px] h-[80%] transition-transform ${
                            openIndex === index ? "scale-y-100 duration-500" : "scale-y-0 duration-150"
                        }`}
                        style={{ transformOrigin: "top" }}
                    />

                    {/* HEADER */}
                    <button
                        onClick={() => toggleAccordion(index)}
                        className={`w-full ${
                            openIndex === index ? "pt-30px" : "pt-30px pb-30px"
                        } flex items-center justify-between ${
                            isArabic ? "text-right" : "text-left"
                        } group transition-all duration-500 cursor-pointer`}
                    >
                        <div className="flex-1">
                            <h3 className="text-24 xl:text-24 3xl:text-32 leading-[1.3125] font-normal text-gray-900">
                                {item.title}
                            </h3>

                            {item.description && openIndex === index && (
                                <motion.p
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
                                    className="text-19 leading-[1.52] text-paragraph mt-1 2xl:mt-[15px]"
                                >
                                    {item.description}
                                </motion.p>
                            )}
                        </div>

                        {/* ARROW BUTTON */}
                        <motion.div
                            animate={{ rotate: openIndex === index ? 180 : 0 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                            className={`${isArabic ? "mr-4" : "ml-4"} w-6 h-6 md:w-10 md:h-10 xl:w-[50px] xl:h-[50px]
  rounded-full flex items-center justify-center border transition-colors duration-300 ${
      openIndex === index ? "bg-[#30B6F9] text-white border-[#30B6F9]" : "bg-white border-black/20"
  }`}
                        >
                            <Image
                                src={assets.arrowDown}
                                alt="arrow"
                                width={15}
                                height={15}
                                className={`${
                                    openIndex === index ? "brightness-0 invert" : ""
                                } w-[10px] h-[10px] lg:w-[15px] lg:h-[15px]`}
                            />
                        </motion.div>
                    </button>

                    {/* CONTENT */}
                    <AnimatePresence initial={false}>
                        {openIndex === index && (
                            <motion.div
                                key="content"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{
                                    height: contentRefs.current[index]?.scrollHeight || "auto",
                                    opacity: 1,
                                }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                    height: { duration: 0.55, ease: [0.4, 0, 0.2, 1] }, // smoother expand
                                    opacity: { duration: 0.3 },
                                }}
                                className="overflow-hidden"
                            >
                                <div ref={(el) => (contentRefs.current[index] = el)} className="pb-5 xl:pb-10">
                                    <motion.p
                                        variants={moveUp(0.001)}
                                        initial="hidden"
                                        animate="show"
                                        className="text-19 text-paragraph font-light leading-[1.52] max-w-5xl"
                                    >
                                        {item.content}
                                    </motion.p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}
        </div>
    );
};

export default AccordionStyle1;
