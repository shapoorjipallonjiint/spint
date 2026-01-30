"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { navData } from "../data";
import { moveRight, moveUp } from "../motionVarients";
import Image from 'next/image'
import LangLink from "@/lib/LangLink"
import { useSearchContext } from "@/contexts/searchContext";
import {  AnimatePresence } from "framer-motion";
import { useDebounce } from '@/hooks/useDebounce'
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

const NavPageSearch = ({ isOpen, searchActive }) => {
    const isArabic = useIsPreferredLanguageArabic();
    const [activeMenu, setActiveMenu] = useState(2);

    const lastMenuRef = useRef(null);
    const submenuRef = useRef(null);

    const [submenuTop, setSubmenuTop] = useState(0);
    const [animKey, setAnimKey] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const { setSearchActive: globalSetSearchActive } = useSearchContext();
    const debouncedSearchQuery = useDebounce(searchQuery, 2000)

    useEffect(() => {
        if (!debouncedSearchQuery.trim()) {
            setResult(null)
            return;
        }

        const fetchSearch = async (e) => {
            if (loading) return; 
            try {
                setLoading(true);
                const res = await fetch("/api/search", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ searchQuery: debouncedSearchQuery }),
                });

                const data = await res.json();

                if (data.success) {
                    setResult(data.data);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSearch()

    }, [debouncedSearchQuery])

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await fetch("/api/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ searchQuery }),
            });

            const data = await res.json();

            if (data.success) {
                console.log(data)
                setResult(data.data);

                setSearchQuery("")
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchActive) {
            const scrollY = window.scrollY;
            document.body.dataset.scrollY = String(scrollY);
            // document.body.style.position = 'fixed';
            document.body.style.overflow = 'hidden';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            globalSetSearchActive(true);
            setResult(null)
        } else {
            const scrollY = document.body.dataset.scrollY;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, scrollY ? parseInt(scrollY) : 0);
            globalSetSearchActive(false);
        }
    }, [searchActive]);

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

    const activeMenuItem = navData.mainMenu.find((m) => m.id === activeMenu);
    const hasSubmenu = Array.isArray(activeMenuItem?.submenu) && activeMenuItem.submenu.length > 0;

    return (
        <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: isOpen ? 0 : "-100%" }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className={`fixed top-0 ${isArabic ? "right-0" : "left-0"} w-full h-full bg-[#1E45A2] z-10 flex`}
        >
            <div className={`${isArabic ? "right-spacing" : "left-spacing"} w-full flex relative`}>
                {/* LEFT = 45% */}
                <div className="absolute inset-0 bg-black/20 w-full" />
                <div className={`w-[45%] h-full ${isArabic ? "pr-[16%] 3xl:pr-[15%] border-l" : "pl-[16%] 3xl:pl-[15%] border-r"} border-white/30 text-white flex items-center relative`}>


                    <div className="w-[90%] h-[calc(100vh-100px)] mt-[90px]">
                        <form onSubmit={handleSearch} className="hidden lg:flex items-center h-[40px] rounded-[20px] border-gradient ">
                            <div className="relative w-full h-[31px]">
                                <input
                                    name="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    type="text"
                                    placeholder={isArabic ? "ابحث في الموقع" : "Search Website"}
                                    className={`w-full h-full ${isArabic ? "pr-4 pl-10" : "pl-4 pr-10"} text-sm
               outline-none rounded-[15px]
               text-white placeholder-white bg-transparent`}
                                />

                                <Image
                                    src="/assets/images/icons/search-icon.svg"
                                    alt="search"
                                    width={18}
                                    height={18}
                                    className={`absolute ${isArabic ? "left-4" : "right-4"} top-1/2 -translate-y-1/2
               w-[12px] h-[12px] 2xl:w-[18px] 2xl:h-[18px]
               transition-transform duration-300
               pointer-events-none`}
                                />
                            </div>


                        </form>




                        <div className="mt-5 px-4 flex flex-col gap-5 text-white h-[80%]">
                            {result && result.length > 0 ? <div className="text-md font-semibold">Results</div> : null}
                            {loading ? (<div className="flex justify-center items-center h-full"><div className="loader">
                                <div className="bar1"></div>
                                <div className="bar2"></div>
                                <div className="bar3"></div>
                                <div className="bar4"></div>
                                <div className="bar5"></div>
                                <div className="bar6"></div>
                                <div className="bar7"></div>
                                <div className="bar8"></div>
                                <div className="bar9"></div>
                                <div className="bar10"></div>
                                <div className="bar11"></div>
                                <div className="bar12"></div>
                            </div></div>) : (
                                <div className="overflow-hidden h-fit"><ul className="grid grid-cols-1 list-disc gap-5 text-sm px-4 h-full overflow-y-auto custom-scrollbar">
                                    {result && result.length > 0 ? result.map((item, index) => {
                                        if (item.project) {
                                            return <LangLink href={`/projects/${item.project.slug}`} key={index} className="cursor-pointer" onClick={() => { setSearchActive(false); setResult(null) }}><li>{item.project.firstSection.title}</li></LangLink>
                                        } else if (item.type == "news") {
                                            return <LangLink href={`/press-releases/${item.item.slug}`} key={index} className="cursor-pointer" onClick={() => { setSearchActive(false); setResult(null) }}><li>{item.item.title}</li></LangLink>
                                        } else if (item.type == "service") {
                                            return <LangLink href={`/services/${item.item.link}`} key={index} className="cursor-pointer" onClick={() => { setSearchActive(false); setResult(null) }}><li>{item.item.title}</li></LangLink>
                                        }
                                    }) : (result?.length == 0 ? <div>No Results</div> : null)}
                                </ul></div>)}
                        </div>
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

                    

<AnimatePresence>
  {searchActive && (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="absolute top-0 right-0"
    >
      <img
        src="/assets/images/navpage/nav-right-svg.svg"
        alt="nav-right"
      />
    </motion.div>
  )}
</AnimatePresence>


                    {/* Submenu aligned by baseline */}
                    <div ref={submenuRef} className={`absolute ${isArabic ? "pr-[74px]" : "pl-[74px]"} z-10`} style={{ top: submenuTop }}>
                        {/* Animate EVERY hover (uses animKey) */}
                        <motion.div key={`${activeMenu}-${animKey}-${isOpen}`} initial="hidden" animate="show">
                            {!searchActive && hasSubmenu &&
                                activeMenuItem.submenu.map((sub, i) => (
                                    <motion.div
                                        key={`${i}-submenu`}
                                        variants={moveRight(i * 0.14)}
                                        className="mb-5 last:mb-0"
                                    >
                                        <a href={sub.href}>
                                            <p className={`text-29 font-light hover:font-semibold transition-all duration-300 ${isArabic ? "hover:-translate-x-1" : "hover:translate-x-1"}`}>
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
                        className={`absolute bottom-[95px] ${isArabic ? "left-0 lg:left-10 3xl:left-38" : "right-0 lg:right-10 3xl:right-38"} flex items-center gap-4 z-10`}
                    >
                        <div className="flex flex-col items-center gap-3">
                            <p className="text-13 uppercase font-light">{isArabic ? "Stay Connected" : "Stay Connected"}</p>
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

export default NavPageSearch;
