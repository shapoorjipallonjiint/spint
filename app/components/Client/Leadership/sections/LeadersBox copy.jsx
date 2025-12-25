import H2Title from "../../../components/common/H2Title";
import {useRef} from "react";
import { useMediaQuery } from "react-responsive";
import {assets} from "../../../assets/index";
import { motion, useScroll ,useTransform } from "framer-motion";
import { moveUp, fadeIn } from "../../../motionVarients";
const LeaderBox = ({ data }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 }); // < 768
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 }); // 768 - 1023
  const imageOffset = isMobile ? [-30, 30] : isTablet ? [-80, 80] : [-150, 150];
  const shapeOffset = isMobile ? [-50, 50] : isTablet ? [-100, 100] : [-200, 200];
  const sectionRef = useRef(null)
  const imageContainerRefOne = useRef(null);
  const imageContainerRefTwo = useRef(null);

  // Parallax for main image container
  const { scrollYProgress: imageProgress } = useScroll({
    target: imageContainerRefOne,
    offset: ["start end", "end start"]
  });
  const imageY = useTransform(imageProgress, [0, 1], imageOffset);

  const { scrollYProgress: imageProgress2 } = useScroll({
    target: imageContainerRefTwo,
    offset: ["start end", "end start"]
  });
  const image2Y = useTransform(imageProgress2, [0, 1], imageOffset);

  const { scrollYProgress: shapeProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const shapeY = useTransform(shapeProgress, [0, 1], shapeOffset);
  return (
    <section className="relative overflow-hidden" ref={sectionRef}>
        <motion.img style={{y:shapeY}} src={assets.mainShape2} alt="" className="absolute right-0 lg:left-0 bottom-20 w-[150px] md:w-[40%] 3xl:w-[764px]" />
      <div className="container">
       <div className="border-b border-cmnbdr relative overflow-hidden mb-5 xl:mb-20 2xl:mb-25">
          <div className="grid items-center grid-cols-1 lg:grid-cols-2 3xl:grid-cols-[739px_auto]  pt25 3xl:pt-18 pb-10 3xl:pb-[135px]">
            <div className="relative flex flex-col justify-end" ref={imageContainerRefOne}>
              <motion.img style={{ y: imageY }} variants={fadeIn(0.6)} initial="hidden" whileInView="show" viewport={{amount: 0.1, once: true}} src={data[0].image} alt={data[0].name} className="relative w-fit object-contain mr-auto ml-3 lg:ml-auto lg:mr-2 z-20 h-[250px] xs:h-[400px] xl:h-[450px] 2xl:h-[600px] 3xl:h-[735.62px]  max-w-[710px]" />
              <motion.div style={{y:imageY}} variants={fadeIn(0.2)} initial="hidden" whileInView="show" viewport={{amount: 0.1, once: true}} className="absolute bottom-0 left-0 h-[80%] lg:h-[70%] xl:h-[90%] 3xl:h-[612px] w-full bg-primary z-10"></motion.div>
              <motion.div style={{y:imageY}} variants={fadeIn(0.4)} initial="hidden" whileInView="show" viewport={{amount: 0.1, once: true}} className="absolute bottom-0 left-0 h-[60%] lg:h-[60%] xl:h-[60%] 3xl:h-[382px] w-full bg-gradient-to-t from-primary to-transparent z-30"></motion.div>
            </div>
            <div className="pt-5 xl:pt-8 2xl:pt-12 3xl:pt-[68.5px] pl-6 md:pl-10 xl:pl-15 2xl:pl-17 3xl:pl-[97px]">
              <H2Title titleText={data[0].name} marginClass={"mb-[10px]"} />
              <motion.h3 variants={moveUp(0.4)} initial="hidden" whileInView="show" viewport={{amount: 0.1, once: true}} className="text-29 font-light leading-[1.344827586206897] text-paragraph mb-6 lg:mb-8 xl:mb-[45px]">{data[0].position}</motion.h3>
              <div className="lg:max-h-[385px] lg:overflow-y-scroll scrollbar-thin">
                {data[0].desc.map((item, index) => (
                  <motion.div variants={moveUp(0.6 + 0.2*index)} initial="hidden" whileInView="show" viewport={{amount: 0.1, once: true}} key={index} className="">
                    <p className="text-19 leading-[1.473684210526316] text-paragraph font-light max-w-[52ch] mb-4 2xl:mb-7">{item}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          <div className="2xl:mt-[205px] 3xl:mt-[165px] grid items-center grid-cols-1 lg:grid-cols-2 3xl:grid-cols-[793px_auto] gap-6 md:gap-10 xl:gap-15 2xl:gap-17 3xl:gap-[88px] pb-10 xl:pb-25 3xl:pb-[135px]">
            <div className="relative lg:order-2 " ref={imageContainerRefTwo}>
              <motion.img style={{y:image2Y}} variants={fadeIn(0.6)} initial="hidden" whileInView="show" viewport={{amount: 0.1, once: true}} src={data[1].image} alt={data[1].name} className="relative w-fit ml-auto mr-3 z-20 h-[250px] xs:h-[400px] xl:h-[450px] 2xl:h-[600px] 3xl:h-[735.62px]" />
              <motion.div style={{y:image2Y}} className="absolute bottom-0 left-0 h-[80%] xl:h-[90%] 3xl:h-[612px] w-full bg-primary z-10"></motion.div>
              <motion.div style={{ y: image2Y }} className="absolute bottom-0 left-0 left-0 h-[60%] lg:h-[60%] xl:h-[60%] 3xl:h-[382px] w-full bg-gradient-to-t from-primary to-transparent z-30"></motion.div>

            </div>
            <div className="pt-5 xl:pt-8 2xl:pt-12 3xl:pt-[63.89px] lg:order-1">
              <H2Title titleText={data[1].name} marginClass={"mb-[10px]"} />
              <motion.h3 variants={moveUp(0.4)} initial="hidden" whileInView="show" viewport={{amount: 0.1, once: true}} className="text-29 font-light leading-[1.344827586206897] text-paragraph mb-6 lg:mb-8 xl:mb-[45px]">{data[1].position}</motion.h3>
              <div className="lg:max-h-[350px] 2xl:max-h-[490px] lg:overflow-y-scroll scrollbar-thin">
                {data[1].desc.map((item, index) => (
                  <motion.div variants={moveUp(0.6 + 0.2*index)} initial="hidden" whileInView="show" viewport={{amount: 0.1, once: true}} key={index} className="">
                    <p className="text-19 leading-[1.473684210526316] text-paragraph font-light max-w-[54ch] mb-4 2xl:mb-6">{item}</p>
                  </motion.div>
                ))}
              </div>
            </div>
           
          </div>
       </div>
      </div>
    </section>
  );
}

export default LeaderBox;