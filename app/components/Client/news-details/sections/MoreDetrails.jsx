'use client';
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { moveUp, paragraphItem } from "../../../motionVarients";
import SplitTextAnimation from "../../../../components/common/SplitTextAnimation";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";

const MoreDetrails = ({ data }) => {
  const isArabic = useIsPreferredLanguageArabic();
  const t = useApplyLang(data);
  const sectionRef = useRef(null)
  const { scrollYProgress: shapeProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const shapeY = useTransform(shapeProgress, [0, 1], [-200, 200]);
  return (
    <section className="relative overflow-hidden" ref={sectionRef}>
      <div className="py-8 xl:py-15 2xl:pt-22 3xl:pt-[80px] pb-text30 relative   ">
        <div
          className={`shapenews absolute top-1/3 hidden xl:block -translate-y-1/3 3xl:-translate-y-1/3
    ${isArabic
              ? "right-0 lg:right-[-230px] 2xl:right-[-120px] 3xl:right-0 -scale-x-100"
              : "lg:left-[-230px] 2xl:left-[-120px] 3xl:left-0"
            }
  `}
        >
          <motion.img
            style={{ y: shapeY }}
            src="/assets/images/press-releases/newsbody.svg"
            alt=""
            className="w-md200 h-full lg:w-[478px] lg:h-[669px] 2xl:w-[478px] 2xl:h-[669px] object-cover"
          />
        </div>

        <div className="container relative border-b border-[#cccccc] pb-text30">
          <div className={`xl:max-w-[850px] 2xl:max-w-[1008px] 3xl:max-w-[1208px] ${isArabic ? "mr-auto" : "ml-auto"}`}>
            <div className=" ">
              <div dangerouslySetInnerHTML={{ __html: t }}>
                {/* <motion.p variants={paragraphItem} initial="hidden" whileInView="show" viewport={{amount: 0.2, once: true}} className="text-19 font-light text-paragraph mb-6  md:mb-5 last:lg:mb-13 last:2xl:mb-15">09 January 2024, Mumbai, Kakinada: Shapoorji Pallonji Energy Pvt Ltd (SP Energy), India’s leading specialist in Floating Production Storage and Offloading (FPSO) Units, has achieved a significant milestone of “First Oil” on 07 January 2024 from its FPSO Armada Sterling V at Krishna Godavari deepwater block KG-DWN-98/2, offshore Kakinada. </motion.p>
                 <motion.p variants={paragraphItem} initial="hidden" whileInView="show" viewport={{amount: 0.2, once: true}} className="text-19 font-light text-paragraph mb-6  md:mb-5 last:lg:mb-13 last:2xl:mb-15">"Congratulations and thanks to every stakeholder involved in the Armada Sterling V, a deepwater FPSO project, in enabling SP Energy to achieve this commendable milestone of First Oil" said Mr. Ravi Shankar Srinivasan, Director & CEO - SP Energy. </motion.p>
                 <motion.p variants={paragraphItem} initial="hidden" whileInView="show" viewport={{amount: 0.2, once: true}} className="text-19 font-light text-paragraph mb-6  md:mb-5 last:lg:mb-13 last:2xl:mb-15">Mr. Ravi Shankar added that achieving First Oil for Armada Sterling V is a testament to SP Energy's inhouse capabilities and experience in delivering FPSO projects. The project underscores India’s high-end technical proficiency - it was designed, engineered, and delivered by an Indian team of engineers and managers and its operations would be undertaken entirely by an Indian crew. This positions SP Energy among the world's leading FPSO solution providers, showing that it can undertake large FPSO projects that are required in various parts of the world, including South America and West Africa.G</motion.p>
                 <motion.p variants={paragraphItem} initial="hidden" whileInView="show" viewport={{amount: 0.2, once: true}} className="text-19 font-light text-paragraph mb-6  md:mb-5 last:lg:mb-13 last:2xl:mb-15">Mr. Ravi Shankar expressed his sincerest gratitude to ONGC and to the project’s lenders for their belief in SP Energy. FPSO Armada Sterling V is deployed in KG-DWN-98/2 field, which is ONGC's first deep-water development. It is the largest floating installation in the Indian subcontinent. The FPSO is designed to operate in the cyclone-prone eastern offshore region of India and is developed considering the highest safety standards. </motion.p>
                 <motion.p variants={paragraphItem} initial="hidden" whileInView="show" viewport={{amount: 0.2, once: true}} className="text-19 font-light text-paragraph mb-6  md:mb-5 last:lg:mb-13 last:2xl:mb-15">The FPSO has a processing capacity of about 60,000 bpd of liquid and 3 MMSCMD of gas. She is owned by SP Energy’s 70:30 joint venture with Malaysia’s Bumi Armada group. This is Shapoorji Pallonji’s fourth FPSO, and its third FPSO for Indian waters.</motion.p> */}
              </div>
              {/* <div className=" flex flex-col gap-10 xl:gap-15">
                  <div>
                  <h3 className="text-29 mb-5 leading-[1.35] font-light">
                    <SplitTextAnimation children={"About Shapoorji Pallonji Energy"} staggerDelay={0.2} animationDuration={0.8} delay={0.8} />
                  </h3>
                  <motion.p variants={moveUp(1)} initial="hidden" whileInView="show" viewport={{amount: 0.2, once: true}} className="text-19 font-light text-paragraph   ">Shapoorji Pallonji Energy Private Limited ('SP Energy’) is a wholly-owned subsidiary of the globally diversified Shapoorji Pallonji And Company Private Limited. SP Energy aims at being a premier global company in the oil & gas value chain, encompassing floating solutions and regasification, to help meet world energy demands. Our focus is on creating global benchmarks in Design, Engineering, Procurement, Construction, Installation and Commissioning and delivering excellence in operations and maintenance of floating assets, using innovative technologies with the high standards and strict compliance to Health, Safety and Environment. To know more, please visit: www.shapoorjipallonjienergy.com</motion.p>
                  </div>
                  <div>
                    <h3 className="text-29 mb-5 leading-[1.35] font-light">
                      <SplitTextAnimation children={"About Shapoorji Pallonji And Company Pvt Ltd"} staggerDelay={0.2} animationDuration={0.8} delay={1.2} />
                    </h3>
                    <motion.p variants={moveUp(1.4)} initial="hidden" whileInView="show" viewport={{amount: 0.2, once: true}} className="text-19 font-light text-paragraph ">Shapoorji Pallonji Energy Private Limited ('SP Energy’) is a wholly-owned subsidiary of the globally diversified Shapoorji Pallonji And Company Private Limited. SP Energy aims at being a premier global company in the oil & gas value chain, encompassing floating solutions and regasification, to help meet world energy demands. Our focus is on creating global benchmarks in Design, Engineering, Procurement, Construction, Installation and Commissioning and delivering excellence in operations and maintenance of floating assets, using innovative technologies with the high standards and strict compliance to Health, Safety and Environment. To know more, please visit: www.shapoorjipallonjienergy.com</motion.p>
                  </div>
                </div> */}
            </div>


          </div>

        </div>

      </div>
    </section>
  );
};


export default MoreDetrails;
