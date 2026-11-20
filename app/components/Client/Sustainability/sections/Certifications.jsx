"use client"

import H2Title from "../../../../components/common/H2Title";
import {motion} from "framer-motion"
import { moveUp } from "../../../motionVarients";
import Image from "next/image";
import { useApplyLang } from '@/lib/applyLang'

const Certifications = ({ data }) => {
  const t = useApplyLang(data);
  return (
    <section className="pt-80px">
      <div className="container ">
       <div className="border-b border-cmnbdr pb25">
         <H2Title titleText={t.title} marginClass="mb-5 lg:mb-10 2xl:mb-15" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 gap-y-10">
          {
            t.itemsOne.map((item, index) => (
              <div key={index}>
                <motion.div variants={moveUp(0.4 + 0.1 * index)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }}>
                  <div className="border-b border-cmnbdr pb-30px mb-4">
                    <Image src={item.icon} alt="" width={360} height={360} className="w-auto h-28 md:h-36 2xl:h-[180px] max-w-full object-contain" />
                  </div>
                  <h3 className="text-20 md:text-26 leading-[1.2] 2xl:leading-[1.4] font-light font-title max-w-[85%]">{item.title}</h3>
                </motion.div>
              </div>
            ))
          }
        </div>
       </div>
      </div>
    </section>
  );
}

export default Certifications;