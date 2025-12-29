
"use client";
import { motion } from "framer-motion";
import { moveUp } from "@/app/components/motionVarients";
import { engineeringData } from "../data";
import H2Title from "@/app/components/common/H2Title";
import Image from "next/image";
const OurApproach = ({data}) => {
  return (
    <section className="pt-text30 pb30">
      <div className="container">
        <H2Title titleText={data.title} titleColor="black" marginClass="mb-4 md:mb-6 lg:mb-6 xl:mb-10 2xl:mb-50px" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-30px gap-y-8">
          {
            data.items.map((item, index) => (
              <motion.div variants={moveUp(0.2 * index)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} key={index}>
                <div className="border-b border-cmnbdr pb-4 xl:pb-8">
                  <Image src={item.image} alt={item.imageAlt} width={40} height={40} className="lg:w-[65px] w-10 h-10 3xl:h-[65px] object-contain" />
                </div>
                <div className="pt-5 xl:pt-8">
                  <h3 className="text-20 xl:text-24 3xl:text-29 leading-[1.344827586206897] font-light mb-2 md:mb-3 xl:mb-[15px]">{item.title}</h3>
                  <p className="text-paragraph text-19 leading-[1.473684210526316] font-light">{item.desc}</p>
                </div>
              </motion.div>
            ))
          }
        </div>
      </div>
    </section>
  );
}

export default OurApproach;