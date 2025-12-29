
import { assets } from "../../../assets/index";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import H2Title from "components/common/H2Title";
gsap.registerPlugin(ScrollTrigger);
const DesignExcellence = ({ data }) => {
  const imageContainerRefTwo = useRef(null);
  const overlayRefTwo = useRef(null);

  useEffect(() => {
    const container = imageContainerRefTwo.current;
    const overlay = overlayRefTwo.current;

    if (!container || !overlay) return;

    // Set initial state - overlay covers the image
    gsap.set(overlay, { scaleX: 1, transformOrigin: 'right' });

    // Create ScrollTrigger animation with scrub
    gsap.to(overlay, {
      scaleX: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        end: 'top 20%',
        // scrub: 1,
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  return (
    <section className="relative overflow-hidden mt-15 xl:mt-25 2xl:mt-[161px] 2xl:pb-30 pb-16 xl:pb-30">
      <div className="absolute bottom-0 left-0 h-full w-full "><img src={assets.mainShape2} alt="" className="w-[425px] h-auto max-w-[425px] object-contain" /></div>
      <div className="container">
        <div>
          <div>
            <div className="max-w-[1207px] ml-auto ">
              <H2Title titleText={data.title} marginClass="mb-4 xl:mb-7 2xl:mb-10" />
              <p className="mb-4 xl:mb-8 last:mb-0">{data.desc}</p>
              <div ref={imageContainerRefTwo} className="relative overflow-hidden">
                <img src={data.img} alt="" width={1270} height={470} className="w-full xl:h-[300px] 2xl:w-[1270px] 2xl:h-[470px]  object-cover" />
                <div ref={overlayRefTwo} className="absolute top-0 left-0 w-full h-full bg-white z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DesignExcellence;