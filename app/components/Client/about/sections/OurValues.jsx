"use client";
import { motion } from "framer-motion";
import { moveUp } from "../../../motionVarients";
import H2Title from "../../../../components/common/H2Title";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";

// the background shape lives in ValuesCta, shared with the CTA section below
const OurValues = ({ data }) => {
  const isArabic = useIsPreferredLanguageArabic();
  const t = useApplyLang(data);

  return (
    <section className="section-spacing relative overflow-hidden">
      <div className="container relative z-[1]">
        <H2Title titleText={t.title} marginClass={"mb-4 xl:mb-10 3xl:mb-[54px]"} />

        {/* value groups side by side under one line; column widths follow the design at 1920 (347 / 557 / 300) */}
        <div className="lg:max-w-[90%] 3xl:max-w-[74.51%] border-t border-black/20 pt-5 3xl:pt-[26px] grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[347fr_557fr_300fr] gap-x-6 xl:gap-x-0 gap-y-5 lg:gap-y-8">
          {t.items.map((item, index) => (
            <motion.div
              key={index}
              variants={moveUp(0.2 + index * 0.15)}
              initial="hidden"
              whileInView="show"
              viewport={{ amount: 0.2, once: true }}
            >
              <h3 className="text-20 xl:text-29 font-light leading-[1.344827586206897] text-paragraph mb-3 xl:mb-6">
                {item.title}
              </h3>
              <div
                dangerouslySetInnerHTML={{ __html: item.description }}
                // 3xl: 18px between the 7px dot and the text (text starts at 7 + 18 = 25px); ! because the base list CSS is unlayered
                className={isArabic ? "our-values-about-ar 3xl:[&_li]:pr-[25px]!" : "our-values-about 3xl:[&_li]:pl-[25px]!"}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurValues;
