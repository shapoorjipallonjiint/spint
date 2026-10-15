"use client";
import { useApplyLang } from "@/lib/applyLang";
import { fadeIn, moveUp, paragraphItem } from "../motionVarients";
import { motion } from "framer-motion";
import Image from "next/image";
import LangLink from "@/lib/LangLink";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useState } from "react";

import { useServiceVisibility } from "@/contexts/serviceVisibility";
import { DEFAULT_FOOTER, isExternalHref, phoneHref } from "@/lib/footer";
const MotionImage = motion.create(Image);

// internal links get the language prefix, full URLs / mailto / tel are used as they are
const FooterLink = ({ href, children, ...props }) =>
  isExternalHref(href) ? (
    <a href={href} target={/^https?:/i.test(href) ? "_blank" : undefined} rel="noopener noreferrer" {...props}>
      {children}
    </a>
  ) : (
    <LangLink href={href} {...props}>
      {children}
    </LangLink>
  );

// content comes from admin (Footer), passed in by the layout
const FooterTwo = ({ data = DEFAULT_FOOTER }) => {
  const footer = useApplyLang(data);
  // services hidden in admin (Services > Main) are left out of the footer, the rest follow the admin order
  const { isHiddenHref, sortByHref } = useServiceVisibility();
  const visibleFooterLinks = footer.columns.map((section, index) => ({
    ...section,
    links: sortByHref(
      section.links.filter((link) => !isHiddenHref(link.href)),
      (link) => link.href,
    ),
    delay: 0.2 + index * 0.1,
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
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed ${isArabic ? "left-4 lg:left-15" : "right-4 lg:right-15"} bottom-4 flex flex-col gap-1 items-center bg-white/70 rounded-sm cursor-pointer px-2 pt-2 pb-2 lg:pb-0 z-[999]`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="23"
            className="w-[15px] h-[15px] lg:w-[23px] lg:h-[23px]"
            viewBox="0 0 23 23"
            fill="none"
          >
            <path
              d="M21.3187 11.286L11.2832 1.25052L1.25 11.2837M11.2804 1.25L11.2347 21.2708"
              stroke="#30B6F9"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="hidden lg:block font-size[13px] font-light leading-[1.6] text-paragraph">
            {" "}
            TOP{" "}
          </p>
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
                src={footer.logo}
                alt={footer.logoAlt || "logo"}
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
                {footer.address.split("\n").map((line, index) => (
                  <span key={index}>
                    {index > 0 && <br />}
                    {line}
                  </span>
                ))}
              </motion.p>

              <motion.div
                variants={moveUp(0.3)}
                initial="hidden"
                whileInView="show"
                viewport={{ amount: 0.1, once: true }}
                className="flex flex-wrap items-center gap-[22px] 2xl:gap-[40px] 3xl:gap-[62px]"
              >
                {footer.phone && (
                  <a
                    href={phoneHref(footer.phone)}
                    className="text-19 lg:text-20 xl:text-29 font-light leading-[1.344827586206897]"
                  >
                    {footer.phone}
                  </a>
                )}
                {footer.email && (
                  <a
                    href={`mailto:${footer.email}`}
                    className="text-19 lg:text-20 xl:text-29 font-light leading-[1.344827586206897]"
                  >
                    {footer.email}
                  </a>
                )}
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
                {footer.socials.filter((item) => !item.hidden).map((item, index) => (
                  <li
                    key={index}
                    className="relative p-[2px] rounded-full bg-[linear-gradient(90deg,#30B6F9,#1E45A2,#30B6F9)] bg-[length:200%_200%] animate-[gradient_3s_linear_infinite] inline-flex items-center justify-center transition-all duration-300 hover:scale-[1.08]"
                  >
                    <FooterLink
                      href={item.href}
                      aria-label={item.name}
                      className="w-[24px] h-[24px] md:w-[34px] md:h-[34px] rounded-full bg-[#153071] flex items-center justify-center"
                    >
                      <Image
                        width={17}
                        height={17}
                        src={item.icon}
                        alt={item.name}
                        className="w-[14px] lg:w-[16px]"
                      />
                    </FooterLink>
                  </li>
                ))}
              </motion.ul>
            </div>
          </div>

          {/* Divider */}
          <div className="col-span-full border-t border-white/30 mb-50px" />

          {/* Row 2: nav columns, 1 of 5 each */}
          {visibleFooterLinks.map((section, index) => {
            const isOpen = openSection === index;
            const panelId = `footer-panel-${index}`;

            return (
              <motion.div
                key={index}
                variants={moveUp(section.delay)}
                initial="hidden"
                whileInView="show"
                viewport={{ amount: 0.1, once: true }}
                className="mb-2 md:mb-40px"
              >
                <h3 className="text-18 2xl:text-29 leading-[1.344827586206897] font-light mb-2 lg:mb-[27px]">
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-center justify-between text-left md:pointer-events-none md:cursor-default"
                  >
                    <span>{section.title}</span>
                    <span
                      aria-hidden="true"
                      className={`md:hidden text-2xl leading-none transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out md:grid-rows-[1fr] ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <ul className="overflow-hidden">
                    {section.links.map((link, linkIndex) => (
                      <li
                        key={linkIndex}
                        className="opacity-70 hover:opacity-100 transition-all duration-200 text-[14px] max-lg:mb-[2px] md:text-[16px] xl:text-19 leading-[1.578947368421053] font-light"
                      >
                        <FooterLink href={link.href}>{link.label}</FooterLink>
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
      {/* <div className="w-full h-px bg-white/30"></div> */}
      <div className="container">
        <motion.div
          variants={moveUp(0.7)}
          initial="hidden"
          whileInView="show"
          viewport={{ amount: 0.1, once: true }}
          className="col-span-5 pb-5"
        >
          <div className="flex flex-wrap gap-y-1.5 xl:gap-x-[45px] 3xl:gap-x-[56px] items-center">
            <div className="">
              <p className="text-14 leading-[1.578947368421053] font-normal opacity-50">
                {footer.copyright.replace(/\{year\}/g, new Date().getFullYear())}
              </p>
            </div>
            <div className="">
              <ul className="flex flex-wrap gap-x-2 xl:gap-x-[45px] 3xl:gap-x-[56px]">
                {footer.bottomLinks.map((link, index) => (
                  <li
                    key={index}
                    className="opacity-50 hover:opacity-100 transition-all duration-200 text-[14px] leading-[1.578947368421053] font-light"
                  >
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterTwo;
