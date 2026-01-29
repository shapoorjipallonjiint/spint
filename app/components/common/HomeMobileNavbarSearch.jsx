"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { navData } from "../data";
import Image from "next/image";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

const HomeMobileNavbarSearch = ({ isOpen, onClose, navbarClose }) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const isArabic = useIsPreferredLanguageArabic();

  const toggleSubmenu = (title) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

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

  /* animations */
  const menuVariants = {
    closed: {
      x: isArabic ? "-100%" : "100%",
      transition: { type: "tween", duration: 0.3, ease: "easeInOut" },
    },
    open: {
      x: 0,
      transition: { type: "tween", duration: 0.3, ease: "easeInOut" },
    },
  };

  const overlayVariants = {
    closed: { opacity: 0, transition: { duration: 0.2 } },
    open: { opacity: 1, transition: { duration: 0.2 } },
  };

  const itemVariants = {
    closed: { x: isArabic ? "-20" : 20, opacity: 0 },
    open: (i) => ({
      x: 0,
      opacity: 1,
      transition: { delay: 0.1 + i * 0.05, duration: 0.3 },
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* OVERLAY */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-50 lg:hidden"
          />

          {/* SLIDE PANEL */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className={`fixed top-0 ${isArabic ? "left-0" : "right-0"} h-full w-full max-w-[320px] bg-white shadow-2xl z-50 lg:hidden overflow-y-auto`}
          >
            {/* CLOSE */}
            <div className={`absolute ${isArabic ? "left-5" : "right-5"} top-5`}>
              <button
                onClick={() => { onClose(); setResult(null); navbarClose(null) }}
                className="w-10 h-10 flex items-center justify-center"
              >
                <div className="relative w-6 h-6">
                  <span className="absolute w-6 h-0.5 bg-black rotate-45 top-1/2" />
                  <span className="absolute w-6 h-0.5 bg-black -rotate-45 top-1/2" />
                </div>
              </button>
            </div>

            {/* LOGO */}
            <div className="flex items-center p-3 absolute">
              <img src="/assets/images/main-logo.png" alt="logo" className="w-25" />
            </div>

            {/* CONTENT */}
            <div className="p-3 pt-24 flex flex-col justify-between h-full">
              {/* MENU */}
              <div className="h-full w-full ">
                <form onSubmit={handleSearch} className="flex items-center h-[40px] rounded-[20px] border-gradient">
                  <div className="relative w-full h-[31px]">
                    <input
                      name="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      type="text"
                      placeholder="Search Website"
                      className={`w-full h-full ${isArabic ? "pr-4 pl-10" : "pl-4 pr-10"} text-sm
               outline-none rounded-[15px]
               text-black placeholder-black bg-transparent`}
                    />

                    <Image
                      onClick={handleSearch}
                      src="/assets/images/icons/search-icon.svg"
                      alt="search"
                      width={18}
                      height={18}
                      className={`absolute ${isArabic ? "left-4" : "right-4"} top-1/2 -translate-y-1/2
               w-[12px] h-[12px] 2xl:w-[18px] 2xl:h-[18px]
               transition-transform duration-300
               `}
                    />
                  </div>


                </form>

                <div className="mt-5 p-1 flex flex-col gap-5 text-black h-[90%]">
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
                    <div className="overflow-hidden h-full"><ul className="grid grid-cols-1 list-disc gap-5 text-sm px-4 h-full overflow-y-auto custom-scrollbar">
                      {result && result.length > 0 ? result.map((item, index) => {
                        if (item.project) {
                          return <Link href={`/projects/${item.project.slug}`} key={index} className="cursor-pointer" onClick={() => { setSearchActive(false); setResult(null) }}><li>{item.project.firstSection.title}</li></Link>
                        } else if (item.type == "news") {
                          return <Link href={`/press-releases/${item.item.slug}`} key={index} className="cursor-pointer" onClick={() => { setSearchActive(false); setResult(null) }}><li>{item.item.title}</li></Link>
                        } else if (item.type == "service") {
                          return <Link href={`/services/${item.item.link}`} key={index} className="cursor-pointer" onClick={() => { setSearchActive(false); setResult(null) }}><li>{item.item.title}</li></Link>
                        }
                      }) : (result?.length == 0 ? <div>No Results</div> : null)}
                    </ul></div>)}
                </div>

              </div>

              {/* ACTIONS */}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HomeMobileNavbarSearch;
