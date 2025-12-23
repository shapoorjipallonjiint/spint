"use client";
import { fadeIn, moveUp, paragraphItem } from "../motionVarients";
import { motion } from "framer-motion";
import  Link from "next/link";

const Footer = () => {
  return (
    <div className="bg-[#191919] pt-10 md:pt-12 lg:pt-10 xl:pt-15  2xl:pt-20 3xl:pt-[153px] text-white ">
      <div className="container">
        <div onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
         className="fixed right-4 lg:right-15 bottom-4  flex flex-col gap-1 items-center bg-white/70  rounded-sm cursor-pointer  px-2 pt-2 pb-2 lg:pb-0 z-[999]">
          <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" className="w-[15px] h-[15px] lg:w-[23px] lg:h-[23px] " viewBox="0 0 23 23" fill="none">
          <path d="M21.3187 11.286L11.2832 1.25052L1.25 11.2837M11.2804 1.25L11.2347 21.2708" stroke="#30B6F9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="hidden lg:block font-size[13px] font-light leading-[1.6] text-paragraph">TOP</p>
        </div>
        <div className="border-b border-white/30 grid gap-6 lg:gap-0 grid-cols-1 lg:grid-cols-[350px_auto] xl:grid-cols-[549px_auto]">
          <div className="lg:border-r border-white/30">
            <motion.img variants={fadeIn(0.5)} initial="hidden" animate="show" src="./assets/images/logo.svg" alt="logo" className="w-[169px] h-auto" />
          </div>
          <div className="lg:pl-20 xl:pl-20 2xl:pl-[107px] pb-6 md:pb-9 lg:pb-15 xl:pb-20">
            <motion.p variants={moveUp(0.2)} initial="hidden" animate="show" className="text-19 font-extralight leading-[1.578947368421053] text-white/70 mb-[22px] max-w-[35ch]">Al Hudaiba Mall, Al Mina Street <br />P.O. Box No. 118219 Dubai, UAE <br />Office 307, 3rd Floor </motion.p>
            <motion.div variants={moveUp(0.3)} initial="hidden" animate="show" className="flex flex-wrap items-center gap-[22px] 2xl:gap-[40px] 3xl:gap-[62px] mb-[35px]">
              <a href="tel:+97142156222" className="text-19 lg:text-20 xl:text-29 font-light leading-[1.344827586206897]">+971 42156222</a>
              <a href="mailto:info@spinternational.com" className="text-19 lg:text-20 xl:text-29 font-light leading-[1.344827586206897]">info@spinternational.com</a>
            </motion.div>
            <div>
              <motion.ul variants={paragraphItem} initial="hidden" animate="show" className="flex items-center gap-[4px]">
              
                <li className="relative p-[2px] rounded-full bg-[linear-gradient(90deg,#30B6F9,#1E45A2,#30B6F9)] bg-[length:200%_200%] animate-[gradient_3s_linear_infinite] inline-flex items-center justify-center transition-all duration-300 hover:scale-[1.08]">
                  <Link href="#" className="w-[34px] h-[34px] rounded-full bg-black flex items-center justify-center">
                    <img src="./assets/images/icons/insta.svg" alt="insta" className="invert-100 w-[16px]" />
                  </Link>
                </li>
                <li className="relative p-[2px] rounded-full bg-[linear-gradient(90deg,#30B6F9,#1E45A2,#30B6F9)] bg-[length:200%_200%] animate-[gradient_3s_linear_infinite] inline-flex items-center justify-center transition-all duration-300 hover:scale-[1.08]">
                  <Link href="#" className="w-[34px] h-[34px] rounded-full bg-black flex items-center justify-center">
                    <img src="./assets/images/icons/linked-in.svg" alt="linked-in" />
                  </Link>
                </li>
                <li className="relative p-[2px] rounded-full bg-[linear-gradient(90deg,#30B6F9,#1E45A2,#30B6F9)] bg-[length:200%_200%] animate-[gradient_3s_linear_infinite] inline-flex items-center justify-center transition-all duration-300 hover:scale-[1.08]">
                  <Link href="#" className="w-[34px] h-[34px] rounded-full bg-black flex items-center justify-center">
                    <img src="./assets/images/icons/youtube.svg" alt="youtube" />
                  </Link>
                </li>
              </motion.ul>
            </div>
          </div>
        </div>
        <div className="grid gap-y-6 md:gap-y-8 lg:gap-10 sm:grid-cols-2 lg:grid-cols-[1fr_1.5fr_1.3fr_1fr] 2xl:grid-cols-[auto_250px_280px_auto_auto] 3xl:grid-cols-[260px_373px_350px_1fr_1fr] pt-5 md:pt-8 lg:pt-12 xl:pt-[53px] pb-5 md:pb-8 lg:pb-12 xl:pb-[45px]">
          <motion.div variants={moveUp(0.2)} initial="hidden" animate="show">
            <h3 className="text-24 lg:text-29 leading-[1.344827586206897] font-light mb-2 lg:mb-[27px]">About</h3>
            <ul>
              <li className="opacity-70 hover:opacity-100 transition-all duration-200 text-[16px] xl:text-19 leading-[1.578947368421053] font-extralight">  <Link href="/about-us">Overview</Link></li>
              {/* <li className="opacity-70 hover:opacity-100 transition-all duration-200 text-[16px] xl:text-19 leading-[1.578947368421053] font-light"><Link href="">Legacy</Link></li> */}
              <li className="opacity-70 hover:opacity-100 transition-all duration-200 text-[16px] xl:text-19 leading-[1.578947368421053] font-extralight"><Link href="/leadership">Leadership</Link></li>
            </ul>
          </motion.div>
          <motion.div variants={moveUp(0.3)} initial="hidden" animate="show">
            <h3 className="text-24 lg:text-29 leading-[1.344827586206897] font-light mb-2 lg:mb-[27px]">Services</h3>
            <ul>
              <li className="opacity-70 hover:opacity-100 transition-all duration-200 text-[16px] xl:text-19 leading-[1.578947368421053] font-extralight"><Link href="/engineering-construction">Engineering & Construction</Link></li>
              <li className="opacity-70 hover:opacity-100 transition-all duration-200 text-[16px] xl:text-19 leading-[1.578947368421053] font-extralight"><Link href="/mep">MEP</Link></li>
              <li className="opacity-70 hover:opacity-100 transition-all duration-200 text-[16px] xl:text-19 leading-[1.578947368421053] font-extralight"><Link href="/interior-design">Interior Fit-out</Link></li>
              <li className="opacity-70 hover:opacity-100 transition-all duration-200 text-[16px] xl:text-19 leading-[1.578947368421053] font-extralight"><Link href="/facade">Façade</Link></li>
              <li className="opacity-70 hover:opacity-100 transition-all duration-200 text-[16px] xl:text-19 leading-[1.578947368421053] font-extralight"><Link href="/integrated-facility-management">Facilities Management</Link></li>
              <li className="opacity-70 hover:opacity-100 transition-all duration-200 text-[16px] xl:text-19 leading-[1.578947368421053] font-extralight"><Link href="/water">Water</Link></li>
              <li className="opacity-70 hover:opacity-100 transition-all duration-200 text-[16px] xl:text-19 leading-[1.578947368421053] font-extralight"><Link href="/design-studio">Design Studio</Link></li>
            </ul>
          </motion.div>
          <motion.div variants={moveUp(0.4)} initial="hidden" animate="show">
            <h3 className="text-24 lg:text-29 leading-[1.344827586206897] font-light mb-2 lg:mb-[27px]">Commitments</h3>
            <ul>
              <li className="opacity-70 hover:opacity-100 transition-all duration-200 text-[16px] xl:text-19 leading-[1.578947368421053] font-extralight"><Link href="/sustainability">Sustainability</Link></li>
              <li className="opacity-70 hover:opacity-100 transition-all duration-200 text-[16px] xl:text-19 leading-[1.578947368421053] font-extralight"><Link href="/community-engagement">Community Engagement</Link></li>
              {/* <li className="opacity-70 hover:opacity-100 transition-all duration-200 text-[16px] xl:text-19 leading-[1.578947368421053] font-light"><Link href="/quality-safety">Safety & Quality</Link></li> */}
              <li className="opacity-70 hover:opacity-100 transition-all duration-200 text-[16px] xl:text-19 leading-[1.578947368421053] font-extralight"><Link href="/hse">Health safety & environmental</Link></li>
              <li className="opacity-70 hover:opacity-100 transition-all duration-200 text-[16px] xl:text-19 leading-[1.578947368421053] font-extralight"><Link href="/quality">Quality</Link></li>
            </ul>
          </motion.div>
          <motion.div variants={moveUp(0.5)} initial="hidden" animate="show">
            <h3 className="text-24 lg:text-29 leading-[1.344827586206897] font-light mb-2 lg:mb-[27px]">Media</h3>
            <ul>
              <li className="opacity-70 hover:opacity-100 transition-all duration-200 text-[16px] xl:text-19 leading-[1.578947368421053] font-extralight"><Link href="/press-releases">Press Releases</Link></li>
              {/* <li className="opacity-70 hover:opacity-100 transition-all duration-200 text-[16px] xl:text-19 leading-[1.578947368421053] font-light"><Link href="/gallery">Media Coverage</Link></li> */}
              {/* <li className="opacity-70 hover:opacity-100 transition-all duration-200 text-[16px] xl:text-19 leading-[1.578947368421053] font-light"><Link href="#">Thought Leadership</Link></li> */}
            </ul>
          </motion.div>
          <motion.div variants={moveUp(0.6)} initial="hidden" animate="show">
            <h3 className="text-24 lg:text-29 leading-[1.344827586206897] font-light mb-2 lg:mb-[27px]">Quick Links</h3>
            <ul>
              <li className="opacity-70 hover:opacity-100 transition-all duration-200 text-[16px] xl:text-19 leading-[1.578947368421053] font-extralight"><Link href="/careers">Careers</Link></li>
              <li className="opacity-70 hover:opacity-100 transition-all duration-200 text-[16px] xl:text-19 leading-[1.578947368421053] font-extralight"><Link href="/projects">Projects</Link></li>
            </ul>
          </motion.div>
        </div>
      </div>
      <motion.div variants={moveUp(0.7)} initial="hidden" animate="show" className="py-1 lg:pt-[26px] lg:pb-[28px] border-t border-white/30">
        <div className="container">
          <p className="text-14 leading-[2.857142857142857] font-normal opacity-50">© {new Date().getFullYear()} SP International. All rights reserved.</p>
        </div>
      </motion.div>
    </div>
  );
}

export default Footer;