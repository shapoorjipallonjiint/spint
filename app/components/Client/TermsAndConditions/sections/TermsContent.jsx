"use client";
import { motion } from "framer-motion";
import { moveUp } from "../../../motionVarients";
import { withNormalSpaces } from "@/lib/withNormalSpaces";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

const TermsContent = ({ content }) => {
  const isArabic = useIsPreferredLanguageArabic();

  return (
    <section className="section-spacing relative">
      <div className="container">
        <motion.div
          variants={moveUp(0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ amount: 0.1, once: true }}
          className={`${isArabic ? "our-values-about-ar" : "our-values-about"} wrap-break-word
            text-19 font-light leading-[1.474] text-paragraph
            [&_h2]:text-[1.7rem] xs:[&_h2]:text-[1.8rem] md:[&_h2]:text-[2rem] lg:[&_h2]:text-[2.3rem] xl:[&_h2]:text-[2.5rem] 2xl:[&_h2]:text-[2.6rem] 3xl:[&_h2]:text-60
            [&_h2]:font-light [&_h2]:leading-[1.166666666666667] [&_h2]:text-black [&_h2]:mb-50px
            [&_h3]:text-20 xl:[&_h3]:text-29 [&_h3]:font-light [&_h3]:leading-[1.344827586206897] [&_h3]:text-paragraph [&_h3]:mt-50px [&_h3]:mb-3 xl:[&_h3]:mb-6
            [&_p]:mb-4 xl:[&_p]:mb-8 [&_ul]:mb-4 xl:[&_ul]:mb-8 [&_ol]:mb-4 xl:[&_ol]:mb-8
            [&_strong]:font-semibold [&_a]:text-primary [&_a]:underline
            [&>*:first-child]:mt-0 [&>*:last-child]:mb-0`}
          dangerouslySetInnerHTML={{ __html: withNormalSpaces(content) }}
        />
      </div>
    </section>
  );
};

export default TermsContent;
