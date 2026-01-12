// "use client";

// import { motion, AnimatePresence } from "framer-motion";
// import { moveUp } from "../motionVarients";

// const AccordionCareer = ({ accData, openIndex, setOpenIndex }) => {
//     const toggleAccordion = (index) => {
//         setOpenIndex((prev) => (prev === index ? null : index));
//     };

//     return (
//         <div className="space-y-1">
//             {accData.items.map((item, index) => (
//                 <motion.div
//                     key={item._id || index}
//                     variants={moveUp(0.4 + index * 0.15)}
//                     initial="hidden"
//                     whileInView="show"
//                     viewport={{ amount: 0.2, once: true }}
//                     className={`border-b border-black/20 relative transition-all duration-500 ${
//                         openIndex === index ? "pl-5 2xl:pl-[40px]" : "pl-0"
//                     }`}
//                 >
//                     {/* LEFT ACTIVE BAR */}
//                     <div
//                         className={`absolute left-0 top-1/2 -translate-y-1/2 bg-[#30B6F9] ${
//                             openIndex === index
//                                 ? "w-[3px] h-[80%] transition-all duration-500"
//                                 : "w-0 h-[80%] transition-all duration-150"
//                         }`}
//                     />

//                     {/* HEADER */}
//                     <button
//                         onClick={() => toggleAccordion(index)}
//                         className={`w-full ${
//                             openIndex === index
//                                 ? "pt-[20px] pb-3 xl:pb-[15px]"
//                                 : "py-3 2xl:py-[32px]"
//                         } flex items-center justify-between text-left group transition-all duration-500`}
//                     >
//                         <div className="flex-1">
//                             <h3
//                                 className={`text-[20px] 2xl:text-29 leading-[1.3125] text-paragraph ${
//                                     openIndex === index
//                                         ? "font-bold"
//                                         : "font-light 2xl:font-extralight"
//                                 }`}
//                             >
//                                 {item.title}
//                             </h3>
//                         </div>
//                     </button>

//                     {/* CONTENT */}
//                     <AnimatePresence initial={false}>
//                         {openIndex === index && (
//                             <motion.div
//                                 key="content"
//                                 initial={{ height: 0, opacity: 0 }}
//                                 animate={{ height: "auto", opacity: 1 }}
//                                 exit={{ height: 0, opacity: 0 }}
//                                 transition={{
//                                     height: {
//                                         duration: 0.55,
//                                         ease: [0.4, 0, 0.2, 1],
//                                     },
//                                     opacity: { duration: 0.3 },
//                                 }}
//                                 className="overflow-hidden"
//                             >
//                                 <div className="pb-5 xl:pb-[34px]">
//                                     <motion.p
//                                         variants={moveUp(0.001)}
//                                         initial="hidden"
//                                         animate="show"
//                                         className="text-19 text-paragraph font-extralight leading-[1.52] max-w-5xl max-w-[38ch]"
//                                     >
//                                         {item.description}
//                                     </motion.p>
//                                 </div>
//                             </motion.div>
//                         )}
//                     </AnimatePresence>
//                 </motion.div>
//             ))}
//         </div>
//     );
// };

// export default AccordionCareer;


"use client";

import { useRef, useLayoutEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { moveUp } from "../motionVarients";

const AccordionCareer = ({ accData, openIndex, setOpenIndex }) => {
  const contentRefs = useRef([]);
  const [heights, setHeights] = useState({});

  const toggleAccordion = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  // ✅ Measure height AFTER render (React-safe)
  useLayoutEffect(() => {
    if (openIndex === null) return;

    const el = contentRefs.current[openIndex];
    if (!el) return;

    setHeights((prev) => ({
      ...prev,
      [openIndex]: el.scrollHeight,
    }));
  }, [openIndex]);

  return (
    <div className="space-y-1">
      {accData.items.map((item, index) => (
        <motion.div
          key={item._id || index}
          variants={moveUp(0.4 + index * 0.15)}
          initial="hidden"
          whileInView="show"
          viewport={{ amount: 0.2, once: true }}
          className={`border-b border-black/20 relative transition-all duration-500 ${
            openIndex === index ? "pl-5 2xl:pl-[40px]" : "pl-0"
          }`}
        >
          {/* LEFT ACTIVE BAR */}
          <div
            className={`absolute left-0 top-1/2 -translate-y-1/2 bg-[#30B6F9] ${
              openIndex === index
                ? "w-[3px] h-[80%] transition-all duration-500"
                : "w-0 h-[80%] transition-all duration-150"
            }`}
          />

          {/* HEADER */}
          <button
            onClick={() => toggleAccordion(index)}
            className={`w-full ${
              openIndex === index
                ? "pt-[20px] "
                : "py-3 2xl:py-[32px]"
            } flex items-center justify-between text-left group transition-all duration-500`}
          >
            <div className="flex-1">
              <h3
                className={`text-[20px] 2xl:text-29 leading-[1.3125] text-paragraph ${
                  openIndex === index
                    ? "font-bold"
                    : "font-light 2xl:font-extralight"
                }`}
              >
                {item.title}
              </h3>

              {item.subtitle && openIndex === index && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                  className="text-19 leading-[1.52] text-paragraph mt-1 2xl:mt-[15px]"
                >
                  {item.subtitle}
                </motion.p>
              )}
            </div>
          </button>

          {/* CONTENT */}
          <AnimatePresence initial={false}>
            {openIndex === index && (
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: heights[index] || "auto",
                  opacity: 1,
                }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  height: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
                  opacity: { duration: 0.3 },
                }}
                className="overflow-hidden"
              >
                <div
                  ref={(el) => (contentRefs.current[index] = el)}
                  className="pb-5 xl:pb-[34px]"
                >
                  <motion.p
                    variants={moveUp(0.001)}
                    initial="hidden"
                    animate="show"
                    className="text-19 text-paragraph font-extralight leading-[1.52] max-w-5xl max-w-[38ch]"
                  >
                    {item.description}
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

export default AccordionCareer;
