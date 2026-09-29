"use client";
import { useApplyLang } from "@/lib/applyLang";
import { fadeIn, moveUp, paragraphItem } from "../motionVarients";
import { motion } from "framer-motion";
import Image from "next/image";
import LangLink from "@/lib/LangLink";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import Link from "next/link";

const MotionImage = motion.create(Image);

const footerLinks = [
  {
    title: "About",
    title_ar: "",
    delay: 0.2,
    span: "lg:col-span-2",
    links: [
      { label: "Overview", label_ar: "", href: "/about-us" },
      { label: "Legacy", label_ar: "", href: "/legacy" },
      { label: "Leadership", label_ar: "", href: "/leadership" },
    ],
  },
  {
    title: "Services",
    title_ar: "",
    delay: 0.3,
    span: "lg:col-span-3",
    links: [
      { label: "Engineering & Construction", label_ar: "", href: "/services/engineering-construction" },
      { label: "MEP", label_ar: "", href: "/services/mep" },
      { label: "Interior Fit-out", label_ar: "", href: "/services/interior-design" },
      { label: "Façade", label_ar: "", href: "/services/facade" },
      { label: "Facilities Management", label_ar: "", href: "/services/integrated-facility-management" },
      { label: "Water", label_ar: "", href: "/services/water" },
    ],
  },
  {
    title: "Commitments",
    title_ar: "",
    delay: 0.4,
    span: "lg:col-span-3",
    links: [
      { label: "Sustainability", label_ar: "", href: "/sustainability" },
      { label: "Community Engagement", label_ar: "", href: "/community-engagement" },
      { label: "Safety & Quality", label_ar: "", href: "/quality" },
    ],
  },
  {
    title: "Media",
    title_ar: "",
    delay: 0.5,
    span: "lg:col-span-2",
    links: [
      { label: "Press Releases", label_ar: "", href: "/press-releases" },
      { label: "Media Coverage", label_ar: "", href: "/media-coverage" },
      { label: "Thought Leadership", label_ar: "", href: "/thought-leadership" },
    ],
  },
  {
    title: "Quick Links",
    title_ar: "",
    delay: 0.6,
    span: "lg:col-span-2",
    links: [
      { label: "Careers", label_ar: "", href: "/careers" },
      { label: "Projects", label_ar: "", href: "/projects" },
    ],
  },
];

const socials = [
  { icon: "/assets/images/icons/insta.svg", alt: "insta" },
  { icon: "/assets/images/icons/linked-in.svg", alt: "linked-in" },
  { icon: "/assets/images/icons/youtube.svg", alt: "youtube" },
];

const FooterTwo = () => {
  const tFooterLinks = useApplyLang(footerLinks);
  const isArabic = useIsPreferredLanguageArabic();

  return (
    <footer className="bg-primary pt-5 md:pt-6 lg:pt-8 xl:pt-10 2xl:pt-12 3xl:pt-[74.99px] text-white">
      <div className="container">
        {/* Scroll To Top */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed ${isArabic ? "left-4 lg:left-15" : "right-4 lg:right-15"} bottom-4 flex flex-col gap-1 items-center bg-white/70 rounded-sm cursor-pointer px-2 pt-2 pb-2 lg:pb-0 z-[999]`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" className="w-[15px] h-[15px] lg:w-[23px] lg:h-[23px]" viewBox="0 0 23 23" fill="none" >
            <path d="M21.3187 11.286L11.2832 1.25052L1.25 11.2837M11.2804 1.25L11.2347 21.2708" stroke="#30B6F9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="hidden lg:block font-size[13px] font-light leading-[1.6] text-paragraph"> TOP </p>
        </div>

        {/* ONE GRID FOR THE WHOLE FOOTER */}
        <div className="grid grid-cols-12 gap-x-6 xl:gap-x-0">

          <div className="col-span-12 grid grid-cols-12 gap-y-4 mb-60px">
            {/* Row 1: logo */}
            <div className="col-span-12 lg:col-span-5 ">
              <MotionImage
                width={0}
                height={0}
                variants={fadeIn(0.5)}
                initial="hidden"
                whileInView="show"
                viewport={{ amount: 0.1, once: true }}
                src="/assets/images/sp-logo.png"
                alt="logo"
                className="w-[169px] h-auto brightness-0 invert"
              />
            </div>

            {/* Row 1: address, phone, email */}
            <div className="col-span-12 lg:col-span-5 ">
              <motion.p
                variants={moveUp(0.2)}
                initial="hidden"
                whileInView="show"
                viewport={{ amount: 0.1, once: true }}
                className="text-19 font-extralight leading-[1.578947368421053] text-white/70 mb-[22px] max-w-[35ch]"
              >
                Al Hudaiba Mall, Al Mina Street P.O. Box No. 118219 <br />
                Dubai, UAE, Office 307, 3rd Floor
              </motion.p>

              <motion.div
                variants={moveUp(0.3)}
                initial="hidden"
                whileInView="show"
                viewport={{ amount: 0.1, once: true }}
                className="flex flex-wrap items-center gap-[22px] 2xl:gap-[40px] 3xl:gap-[62px]"
              >
                <a
                  href="tel:+97142156222"
                  className="text-19 lg:text-20 xl:text-29 font-light leading-[1.344827586206897]"
                >
                  +971 42156222
                </a>
                <a
                  href="mailto:info@spinternational.ae"
                  className="text-19 lg:text-20 xl:text-29 font-light leading-[1.344827586206897]"
                >
                  info@spinternational.ae
                </a>
              </motion.div>
            </div>

            {/* Row 1: social icons */}
            <div className="col-span-12 lg:col-span-2">
              <motion.ul
                variants={paragraphItem}
                initial="hidden"
                whileInView="show"
                viewport={{ amount: 0.1, once: true }}
                className="flex items-center gap-[4px]"
              >
                {socials.map((item) => (
                  <li
                    key={item.alt}
                    className="relative p-[2px] rounded-full bg-[linear-gradient(90deg,#30B6F9,#1E45A2,#30B6F9)] bg-[length:200%_200%] animate-[gradient_3s_linear_infinite] inline-flex items-center justify-center transition-all duration-300 hover:scale-[1.08]"
                  >
                    <LangLink
                      href="#"
                      className="w-[24px] h-[24px] xl:w-[34px] xl:h-[34px] rounded-full bg-[#153071] flex items-center justify-center"
                    >
                      <Image
                        width={17}
                        height={17}
                        src={item.icon}
                        alt={item.alt}
                        className={item.alt === "insta" ? "invert-100 w-[14px] lg:w-[16px]" : "w-[14px] lg:w-[16px]"}
                      />
                    </LangLink>
                  </li>
                ))}
              </motion.ul>
            </div>
        </div>

          {/* Divider */}
          <div className="col-span-12 border-t border-white/30 mb-50px" />

          {/* Row 2: nav columns */}
          {tFooterLinks.map((section) => (
            <motion.div
              key={section.title}
              variants={moveUp(section.delay)}
              initial="hidden"
              whileInView="show"
              viewport={{ amount: 0.1, once: true }}
              className={`col-span-12 xs:col-span-6 mb-50px ${section.span}`}
            >
              <h3 className="text-24 lg:text-29 leading-[1.344827586206897] font-light mb-2 lg:mb-[27px]">
                {section.title}
              </h3>
              <ul>
                {section.links.map((link) => (
                  <li key={link.href} className="opacity-70 hover:opacity-100 transition-all duration-200 text-[16px] xl:text-19 leading-[1.578947368421053] font-light" >
                    <LangLink href={link.href}>{link.label}</LangLink>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Bottom bar */}
          <motion.div
            variants={moveUp(0.7)}
            initial="hidden"
            whileInView="show"
            viewport={{ amount: 0.1, once: true }}
            className="col-span-12 border-t border-white/30 py-1 lg:pt-[12px] lg:pb-[28px]"
          >
            <div className="flex flex-wrap gap-x-2 xl:gap-x-[35px] items-center">
              <div className="">
                <p className="text-14 leading-[2.857142857142857] font-normal opacity-50"> Copyright {new Date().getFullYear()}© SP International All Rights </p>
              </div>
              <div className="">
                <ul className="flex flex-wrap gap-x-2 xl:gap-x-[35px]">
                  <li className="opacity-50 hover:opacity-100 transition-all duration-200 text-[14px] leading-[1.578947368421053] font-light" >
                    <Link href={"/privacy-Policy"}>Privacy Policy</Link>
                  </li>
                  <li className="opacity-50 hover:opacity-100 transition-all duration-200 text-[14px] leading-[1.578947368421053] font-light" >
                    <Link href={"/Cookie Policy"}>Cookie Policy</Link>
                  </li>
                </ul>
              </div>
           </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default FooterTwo;