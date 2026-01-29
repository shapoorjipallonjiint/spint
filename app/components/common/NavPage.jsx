"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { navData } from "../data";
import { moveRight, moveLeft, moveUp } from "../motionVarients";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";

const NavPage = ({ isOpen }) => {
    const isArabic = useIsPreferredLanguageArabic();
    const tNavData = useApplyLang(navData);
    const [activeMenu, setActiveMenu] = useState(2);

    const lastMenuRef = useRef(null);
    const submenuRef = useRef(null);

    const [submenuTop, setSubmenuTop] = useState(0);
    const [animKey, setAnimKey] = useState(0);

    // Align LAST submenu item with LAST main menu item
    useEffect(() => {
        const menuEl = lastMenuRef.current;
        const submenuEl = submenuRef.current;

        if (menuEl && submenuEl) {
            const menuRect = menuEl.getBoundingClientRect();
            const submenuRect = submenuEl.getBoundingClientRect();

            const baseline = menuRect.top + menuRect.height;
            const submenuHeight = submenuRect.height;

            setSubmenuTop(baseline - submenuHeight);
        }
    }, [activeMenu]);

    const activeMenuItem = tNavData.mainMenu.find((m) => m.id === activeMenu);
    const hasSubmenu = Array.isArray(activeMenuItem?.submenu) && activeMenuItem.submenu.length > 0;

    return (
        <motion.div
            initial={{ x: isArabic ? "100%" : "-100%" }}
            animate={{ x: isOpen ? 0 : isArabic ? "100%" : "-100%" }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className={`fixed top-0 ${isArabic ? "right-0" : "left-0"} w-full h-full bg-[#1E45A2] z-10 flex`}
        >
            <div className={`${isArabic ? "right-spacing" : "left-spacing"} w-full flex relative`}>
                {/* LEFT = 45% */}
                <div className="absolute inset-0 bg-black/20 w-full" />
                <div
                    className={`h-full ${
                        isArabic ? "pr-[16%] 3xl:pr-[15%] w-[45%] border-l" : "w-[45%] pl-[16%] 3xl:pl-[15%] border-r"
                    } border-white/30 text-white flex items-center relative`}
                >
                    <div className="flex flex-col gap-6 3xl:gap-8 ">
                        {tNavData.mainMenu.map((item, index) => {
                            const isLast = index === tNavData.mainMenu.length - 1;

                            return (
                                <motion.div
                                    variants={isArabic ? moveLeft(index * 0.12) : moveRight(index * 0.12)}
                                    initial="hidden"
                                    whileInView="show"
                                    key={item.id}
                                    ref={isLast ? lastMenuRef : null}
                                    onMouseEnter={() => {
                                        setActiveMenu(item.id);

                                        if (item.submenu?.length) {
                                            setAnimKey((prev) => prev + 1);
                                        }
                                    }}
                                    className="relative group inline-flex items-center justify-between gap-2 cursor-pointer"
                                >
                                    {/* MAIN TEXT */}
                                    <a href={item.href}>
                                        <span
                                            className={`
            text-24 3xl:text-40 font-light transition-all duration-300
            ${activeMenu === item.id ? "text-white" : "text-white/25 group-hover:text-white"}
        `}
                                        >
                                            {item.title}
                                        </span>
                                    </a>

                                    {/* RIGHT ARROW */}
                                    <span
                                        className={`
  text-white w-[27px] h-[17px] transition-all duration-300
  ${
      activeMenu === item.id
          ? isArabic
              ? "opacity-100 -translate-x-1"
              : "opacity-100 translate-x-1"
          : isArabic
          ? "opacity-0 group-hover:opacity-100 group-hover:-translate-x-1"
          : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
  }
`}
                                    >
                                        <img
                                            src="/assets/images/icons/arrow-right.svg"
                                            alt="arrow"
                                            className={`${isArabic ? "-scale-x-100" : ""}`}
                                        />
                                    </span>

                                    {/* UNDERLINE */}
                                    <span
                                        className={`
        absolute ${isArabic ? "right-0" : "left-0"} -bottom-1 h-[1px] bg-white/30 transition-all duration-400
        ${
            activeMenu === item.id
                ? "w-full" // ALWAYS visible for active
                : "w-0 group-hover:w-full"
        }
    `}
                                    />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT 55% */}
                <div className="w-[55%] h-full relative text-white">
                    {/* Background */}
                    <div className="absolute inset-0">
                        {/* SOLID BLACK OVERLAY */}
                        <div className="absolute inset-0 bg-[rgba(0,0,0,0.77)]" />

                        {/* GRADIENT OVERLAY */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 100%)",
                            }}
                        />

                        {/* IMAGE */}
                        <img src="/assets/images/navpage/nav-page-right.jpg" className="w-full h-full object-cover" />
                    </div>

                    <div
                        className={`absolute top-0 ${
                            isArabic ? (isOpen ? "-left-[1px]" : "left-0") : isOpen ? "-right-[1px]" : "right-0"
                        }`}
                    >
                        <img
                            src="/assets/images/navpage/nav-right-svg.svg"
                            alt="nav-right"
                            className={`${isArabic ? "-scale-x-100" : ""}`}
                        />
                    </div>

                    {/* Submenu aligned by baseline */}
                    <div
                        ref={submenuRef}
                        className={`hidden lg:block absolute ${isArabic ? "pr-[74px]" : "pl-[74px]"} z-10`}
                        style={{ top: submenuTop }}
                    >
                        {/* Animate EVERY hover (uses animKey) */}
                        <motion.div key={`${activeMenu}-${animKey}-${isOpen}`} initial="hidden" animate="show">
                            {hasSubmenu &&
                                activeMenuItem.submenu.map((sub, i) => (
                                    <motion.div
                                        key={`${i}-submenu`}
                                        variants={isArabic ? moveLeft(i * 0.14) : moveRight(i * 0.14)}
                                        className="mb-5 last:mb-0"
                                    >
                                        <a href={sub.href}>
                                            <p
                                                className={`text-29 font-light hover:font-semibold transition-all duration-300 ${
                                                    isArabic ? "hover:-translate-x-1" : "hover:translate-x-1"
                                                }`}
                                            >
                                                {sub.label}
                                            </p>
                                        </a>
                                    </motion.div>
                                ))}
                        </motion.div>
                    </div>

                    {/* ✅ RESTORED — STAY CONNECTED */}
                    <motion.div
                        variants={moveUp(0.2)}
                        initial="hidden"
                        whileInView="show"
                        className={`absolute bottom-[95px] ${
                            isArabic ? "left-0 lg:left-10 3xl:left-38" : "right-0 lg:right-10 3xl:right-38"
                        } flex items-center gap-4 z-10`}
                    >
                        <div className="flex flex-col items-center gap-3">
                            <p className="text-13 uppercase font-light">Stay Connected</p>
                            <div className="flex items-center gap-2">
                                <motion.div
                                    variants={moveUp(0.2)}
                                    initial="hidden"
                                    whileInView="show"
                                    className="flex items-center justify-center border border-[#30B6F9] cursor-pointer w-[34px] h-[34px] bg-[#00000030] rounded-full"
                                >
                                    <img src="../assets/images/ln.svg" alt="LinkedIn" width={15} height={14} />
                                </motion.div>
                                <motion.div
                                    variants={moveUp(0.35)}
                                    initial="hidden"
                                    whileInView="show"
                                    className="flex items-center justify-center border border-[#30B6F9] cursor-pointer w-[34px] h-[34px] bg-[#00000030] rounded-full"
                                >
                                    <img src="../assets/images/fb.svg" alt="Facebook" width={8} height={14} />
                                </motion.div>
                                <motion.div
                                    variants={moveUp(0.5)}
                                    initial="hidden"
                                    whileInView="show"
                                    className="flex items-center justify-center border border-[#30B6F9] cursor-pointer w-[34px] h-[34px] bg-[#00000030] rounded-full"
                                >
                                    <img src="../assets/images/ytube.svg" alt="YouTube" width={16} height={11} />
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                    {/* END STAY CONNECTED */}
                </div>
            </div>
        </motion.div>
    );
};

export default NavPage;
