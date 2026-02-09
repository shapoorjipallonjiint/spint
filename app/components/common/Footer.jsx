"use client";
import { useApplyLang } from "@/lib/applyLang";
import { fadeIn, moveUp, paragraphItem } from "../motionVarients";
import { motion } from "framer-motion";
import Image from "next/image";
import LangLink from "@/lib/LangLink"
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

const Footer = () => {


  const footerLinks = [
    {
      title: "About",
      title_ar: "",
      delay: 0.2,
      links: [
        { label: "Overview", label_ar: "", href: "/about-us" },
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
        { label: "Facade", label_ar: "", href: "/services/facade" },
        { label: "Facilities Management", label_ar: "", href: "/services/integrated-facility-management" },
        { label: "Water", label_ar: "", href: "/services/water" },
        { label: "Design Studio", label_ar: "", href: "/services/design-studio" },
      ],
    },
    {
      title: "Commitments",
      title_ar: "",
      delay: 0.4,
      links: [
        { label: "Accreditations", label_ar: "", href: "/accreditation" },
        { label: "Health safety & environmental", label_ar: "", href: "/hse" },
        { label: "Quality", label_ar: "", href: "/quality" },
        { label: "Sustainability", label_ar: "", href: "/sustainability" },
        { label: "Community Engagement", label_ar: "", href: "/community-engagement" },
      ],
    },
    {
      title: "Media",
      title_ar: "",
      delay: 0.5,
      links: [
        { label: "Press Releases", label_ar: "", href: "/press-releases" },
        { label: "Gallery", label_ar: "", href: "/gallery" },
      ],
    },
    {
      title: "Quick Links",
      title_ar: "",
      delay: 0.6,
      links: [
        { label: "Careers", label_ar: "", href: "/careers" },
        { label: "Projects", label_ar: "", href: "/projects" },
      ],
    },
  ];

  const tFooterLinks = useApplyLang(footerLinks);
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
              src="/assets/images/main-logo.png"
              alt="logo"
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
              Al Hudaiba Mall, Al Mina Street <br />
              P.O. Box No. 118219 Dubai, UAE <br />
              Office 307, 3rd Floor
            </motion.p>

            <motion.div
              variants={moveUp(0.3)}
              initial="hidden"
              whileInView="show"
              viewport={{ amount: 0.1, once: true }}
              className="flex flex-wrap items-center gap-[22px] 2xl:gap-[40px] 3xl:gap-[62px] mb-[35px]"
            >
              <a
                href="tel:+97142156222"
                className="text-19 lg:text-20 xl:text-29 font-light leading-[1.344827586206897]"
              >
                +971 42156222
              </a>
              <a
                href="mailto:info@spinternational.com"
                className="text-19 lg:text-20 xl:text-29 font-light leading-[1.344827586206897]"
              >
                info@spinternational.com
              </a>
            </motion.div>

            <motion.ul
              variants={paragraphItem}
              initial="hidden"
              whileInView="show"
              viewport={{ amount: 0.1, once: true }}
              className="flex items-center gap-[4px]"
            >
              {[
                { icon: "/assets/images/icons/insta.svg", alt: "insta" },
                { icon: "/assets/images/icons/linked-in.svg", alt: "linked-in" },
                { icon: "/assets/images/icons/youtube.svg", alt: "youtube" },
              ].map((item, index) => (
                <li
                  key={index}
                  className="relative p-[2px] rounded-full bg-[linear-gradient(90deg,#30B6F9,#1E45A2,#30B6F9)] bg-[length:200%_200%] animate-[gradient_3s_linear_infinite] inline-flex items-center justify-center transition-all duration-300 hover:scale-[1.08]"
                >
                  <LangLink
                    href="#"
                    className="w-[34px] h-[34px] rounded-full bg-black flex items-center justify-center"
                  >
                    <Image
                      width={17}
                      height={17}
                      src={item.icon}
                      alt={item.alt}
                      className={item.alt === "insta" ? "invert-100 w-[16px]" : ""}
                    />
                  </LangLink>
                </li>
              ))}
            </motion.ul>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid gap-y-6 md:gap-y-8 lg:gap-10 sm:grid-cols-2 lg:grid-cols-[1fr_1.5fr_1.3fr_1fr] 2xl:grid-cols-[auto_250px_280px_auto_auto] 3xl:grid-cols-[260px_373px_350px_1fr_1fr] pt-5 md:pt-8 lg:pt-12 xl:pt-[53px] pb-5 md:pb-8 lg:pb-12 xl:pb-[45px]">
          {tFooterLinks.map((section) => (
            <motion.div
              key={section.title}
              variants={moveUp(section.delay)}
              initial="hidden"
              whileInView="show"
              viewport={{ amount: 0.1, once: true }}
            >
              <h3 className="text-24 lg:text-29 leading-[1.344827586206897] font-light mb-2 lg:mb-[27px]">
                {section.title}
              </h3>
              <ul>
                {section.links.map((link) => (
                  <li
                    key={link.href}
                    className="opacity-70 hover:opacity-100 transition-all duration-200 text-[16px] xl:text-19 leading-[1.578947368421053] font-extralight"
                  >
                    <LangLink href={link.href}>{link.label}</LangLink>
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
          <p className="text-14 leading-[2.857142857142857] font-normal opacity-50">
            © {new Date().getFullYear()} SP International. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Footer;