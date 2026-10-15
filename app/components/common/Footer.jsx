"use client";
import { useApplyLang } from "@/lib/applyLang";
import { fadeIn, moveUp, paragraphItem } from "../motionVarients";
import { motion } from "framer-motion";
import Image from "next/image";
import LangLink from "@/lib/LangLink"
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

import { useServiceVisibility } from "@/contexts/serviceVisibility";
import { DEFAULT_FOOTER, isExternalHref, phoneHref } from "@/lib/footer";

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
const Footer = ({ data = DEFAULT_FOOTER }) => {


  const footer = useApplyLang(data);
  // services hidden in admin (Services > Main) are left out of the footer, the rest follow the admin order
  const { isHiddenHref, sortByHref } = useServiceVisibility();
  const visibleFooterLinks = footer.columns.map((section, index) => ({
    ...section,
    links: sortByHref(section.links.filter((link) => !isHiddenHref(link.href)), (link) => link.href),
    delay: 0.2 + index * 0.1,
  }));
  const isArabic = useIsPreferredLanguageArabic();

  const MotionImage = motion.create(Image)
  return (
    <div className="bg-[#191919] pt-10 md:pt-12 lg:pt-10 xl:pt-15  2xl:pt-20 3xl:pt-[153px] text-white ">
      <div className="container">
        {/* Scroll To Top */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed ${isArabic ? "left-4 lg:left-15" : "right-4 lg:right-15"} bottom-4  flex flex-col gap-1 items-center bg-white/70  rounded-sm cursor-pointer  px-2 pt-2 pb-2 lg:pb-0 z-[999]`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="23"
            className="w-[15px] h-[15px] lg:w-[23px] lg:h-[23px] "
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
            TOP
          </p>
        </div>

        {/* Top Section */}
        <div className="border-b border-white/30 grid gap-6 lg:gap-0 grid-cols-1 lg:grid-cols-[350px_auto] xl:grid-cols-[549px_auto]">
          <div className={`border-white/30 ${isArabic ? "lg:border-l" : "lg:border-r"}`}>
            <MotionImage
              width={0}
              height={0}
              variants={fadeIn(0.5)}
              initial="hidden"
              whileInView="show"
              viewport={{ amount: 0.1, once: true }}
              src={footer.logo}
              alt={footer.logoAlt || "logo"}
              className="w-[169px] h-auto brightness-0 invert"
            />
          </div>

          <div className={`${isArabic ? "lg:pr-20 xl:pr-20 2xl:pr-[107px]" : "lg:pl-20 xl:pl-20 2xl:pl-[107px]"} pb-6 md:pb-9 lg:pb-15 xl:pb-20`}>
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
              className="flex flex-wrap items-center gap-[22px] 2xl:gap-[40px] 3xl:gap-[62px] mb-[35px]"
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
                    className="w-[34px] h-[34px] rounded-full bg-black flex items-center justify-center"
                  >
                    <Image width={17} height={17} src={item.icon} alt={item.name} className="w-[16px]" />
                  </FooterLink>
                </li>
              ))}
            </motion.ul>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid gap-y-6 md:gap-y-8 lg:gap-10 sm:grid-cols-2 lg:grid-cols-[1fr_1.5fr_1.3fr_1fr] 2xl:grid-cols-[auto_250px_280px_auto_auto] 3xl:grid-cols-[260px_373px_350px_1fr_1fr] pt-5 md:pt-8 lg:pt-12 xl:pt-[53px] pb-5 md:pb-8 lg:pb-12 xl:pb-[45px]">
          {visibleFooterLinks.map((section, index) => (
            <motion.div
              key={index}
              variants={moveUp(section.delay)}
              initial="hidden"
              whileInView="show"
              viewport={{ amount: 0.1, once: true }}
            >
              <h3 className="text-24 lg:text-29 leading-[1.344827586206897] font-light mb-2 lg:mb-[27px]">
                {section.title}
              </h3>
              <ul>
                {section.links.map((link, linkIndex) => (
                  <li
                    key={linkIndex}
                    className="opacity-70 hover:opacity-100 transition-all duration-200 text-[16px] xl:text-19 leading-[1.578947368421053] font-extralight"
                  >
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <motion.div
        variants={moveUp(0.7)}
        initial="hidden"
        whileInView="show"
        viewport={{ amount: 0.1, once: true }}
        className="py-1 lg:pt-[26px] lg:pb-[28px] border-t border-white/30"
      >
        <div className="container">
          <div className="flex flex-wrap items-center gap-x-4 xl:gap-x-[45px]">
            <p className="text-14 leading-[2.857142857142857] font-normal opacity-50">
              {footer.copyright.replace(/\{year\}/g, new Date().getFullYear())}
            </p>
            {footer.bottomLinks.map((link, index) => (
              <FooterLink
                key={index}
                href={link.href}
                className="text-14 leading-[2.857142857142857] font-light opacity-50 hover:opacity-100 transition-all duration-200"
              >
                {link.label}
              </FooterLink>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Footer;