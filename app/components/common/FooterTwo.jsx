"use client";
import { useApplyLang } from "@/lib/applyLang";
import { fadeIn, moveUp, paragraphItem } from "../motionVarients";
import { motion } from "framer-motion";
import Image from "next/image";
import LangLink from "@/lib/LangLink";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import Link from "next/link";
import { useState } from "react";

import { useServiceVisibility } from "@/contexts/serviceVisibility";
const MotionImage = motion.create(Image);

// links without a page yet point to "#" (Legacy, Media Coverage, Thought Leadership, Privacy/Cookie Policy)
const footerLinks = [
  {
    title: "About",
    title_ar: "",
    delay: 0.2,
    links: [
      { label: "Overview", label_ar: "", href: "/about-us" },
      { label: "Legacy", label_ar: "", href: "#" },
      { label: "Leadership", label_ar: "", href: "/leadership" },
    ],
  },
  {
    title: "Services",
    title_ar: "",
    delay: 0.3,
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
    links: [
      { label: "Press Releases", label_ar: "", href: "/press-releases" },
      { label: "Media Coverage", label_ar: "", href: "#" },
      { label: "Thought Leadership", label_ar: "", href: "#" },
    ],
  },
  {
    title: "Quick Links",
    title_ar: "",
    delay: 0.6,
    links: [
      { label: "Careers", label_ar: "", href: "/careers" },
      { label: "Projects", label_ar: "", href: "/projects" },
      { label: "Terms and Conditions", label_ar: "", href: "/terms-and-conditions" },
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
  // services hidden in admin (Services > Main) are left out of the footer
  const { isHiddenHref } = useServiceVisibility();
  const visibleFooterLinks = tFooterLinks.map((section) => ({
    ...section,
    links: section.links.filter((link) => !isHiddenHref(link.href)),
  }));
  const isArabic = useIsPreferredLanguageArabic();

  // inside your component
  const [openSection, setOpenSection] = useState(null); // only one open at a time

  const toggle = (title) =>
    setOpenSection((prev) => (prev === title ? null : title));

  return (
    <footer className="bg-primary pt-6 md:pt-8 lg:pt-9 xl:pt-10 2xl:pt-12 3xl:pt-[75.26px] text-white">
      <div className="container">
        {/* Scroll To Top */}
        <div onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed ${isArabic ? "left-4 lg:left-15" : "right-4 lg:right-15"} bottom-4 flex flex-col gap-1 items-center bg-white/70 rounded-sm cursor-pointer px-2 pt-2 pb-2 lg:pb-0 z-[999]`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" className="w-[15px] h-[15px] lg:w-[23px] lg:h-[23px]" viewBox="0 0 23 23" fill="none" >
            <path d="M21.3187 11.286L11.2832 1.25052L1.25 11.2837M11.2804 1.25L11.2347 21.2708" stroke="#30B6F9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="hidden lg:block font-size[13px] font-light leading-[1.6] text-paragraph"> TOP </p>
        </div>

        {/* ONE GRID FOR THE WHOLE FOOTER: 5 columns from lg (row 1: 2-2-1, divider: 5, nav: 1 each) */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-x-6 xl:gap-x-0">

          <div className="col-span-full grid grid-cols-1 lg:grid-cols-5 gap-x-6 xl:gap-x-0 gap-y-4 mb-60px">
            {/* Row 1: logo (2 of 5) */}
            <div className="lg:col-span-2">
              <MotionImage
                width={0}
                height={0}
                variants={fadeIn(0.5)}
                initial="hidden"
                whileInView="show"
                viewport={{ amount: 0.1, once: true }}
                src="/assets/images/sp-logo.png"
                alt="logo"
                className="w-[100px] lg:w-[169px] h-auto brightness-0 invert"
              />
            </div>

            {/* Row 1: address, phone, email (2 of 5) */}
            <div className="lg:col-span-2">
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

            {/* Row 1: social icons (1 of 5) */}
            <div className="lg:col-span-1">
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
                      className="w-[24px] h-[24px] md:w-[34px] md:h-[34px] rounded-full bg-[#153071] flex items-center justify-center"
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
          <div className="col-span-full border-t border-white/30 mb-50px" />

          {/* Row 2: nav columns, 1 of 5 each */}
          {visibleFooterLinks.map((section) => {
            const isOpen = openSection === section.title;
            const panelId = `footer-panel-${section.title.replace(/\s+/g, "-")}`;

            return (
              <motion.div
                key={section.title}
                variants={moveUp(section.delay)}
                initial="hidden"
                whileInView="show"
                viewport={{ amount: 0.1, once: true }}
                className="mb-50px"
              >
                <h3 className="text-18 2xl:text-29 leading-[1.344827586206897] font-light mb-2 lg:mb-[27px]">
                  <button
                    type="button"
                    onClick={() => toggle(section.title)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-center justify-between text-left md:pointer-events-none md:cursor-default"
                  >
                    <span>{section.title}</span>
                    <span
                      aria-hidden="true"
                      className={`md:hidden text-2xl leading-none transition-transform duration-300 ${isOpen ? "rotate-45" : ""
                        }`}
                    >
                      +
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out md:grid-rows-[1fr] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                >
                  <ul className="overflow-hidden">
                    {section.links.map((link) => (
                      <li
                        key={link.label}
                        className="opacity-70 hover:opacity-100 transition-all duration-200 text-[16px] xl:text-19 leading-[1.578947368421053] font-light"
                      >
                        <LangLink href={link.href}>{link.label}</LangLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}

        </div>
      </div>
          {/* Bottom bar */}
          <div className="w-full h-px bg-white/30"></div>
          <div className="container">
        <motion.div
          variants={moveUp(0.7)}
          initial="hidden"
          whileInView="show"
          viewport={{ amount: 0.1, once: true }}
          className="col-span-12 py-1 lg:pt-[12px] lg:pb-[28px]"
        >
          <div className="flex flex-wrap gap-x-[35px] items-center">
            <div className="">
              <p className="text-14 leading-[2.857142857142857] font-normal opacity-50"> Copyright ©{new Date().getFullYear()} All Rights Reserved</p>
            </div>
            <div className="">
              <ul className="flex flex-wrap gap-x-2 xl:gap-x-[35px]">
                <li className="opacity-50 hover:opacity-100 transition-all duration-200 text-[14px] leading-[1.578947368421053] font-light" >
                  <Link href="#">Privacy Policy</Link>
                </li>
                <li className="opacity-50 hover:opacity-100 transition-all duration-200 text-[14px] leading-[1.578947368421053] font-light" >
                  <Link href="#">Cookie Policy</Link>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
          </div>
    </footer>
  );
};

export default FooterTwo;