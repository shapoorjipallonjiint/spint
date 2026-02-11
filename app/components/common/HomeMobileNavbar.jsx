"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import LangLink from "@/lib/LangLink"
import { navData } from "../data";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";

const HomeMobileNavbar = ({ isOpen, onClose,setMobileMenuOpenSearch }) => {
  const isArabic = useIsPreferredLanguageArabic();
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const toggleSubmenu = (title) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
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
    closed: { x: isArabic ? "-20" : "20", opacity: 0 },
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
            className={`fixed top-0 ${isArabic ? "left-0" : "right-0"} h-full w-full max-w-[320px] md:max-w-[450px] bg-white shadow-2xl z-50 lg:hidden overflow-y-auto`}
          >
            {/* CLOSE */}
            <div className={`absolute ${isArabic ? "left-5" : "right-5"} top-5`}>
              <button
                onClick={onClose}
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
              <img src="./assets/images/main-logo.png" alt="logo" className="w-25" />
            </div>

            {/* CONTENT */}
            <div className="p-8 pt-28 flex flex-col justify-between h-full">
              {/* MENU */}
              <ul className="space-y-3">
                {navData.mainMenu.map((item, index) => {
                  const hasSubmenu =
                    Array.isArray(item.submenu) &&
                    item.submenu.length > 0;

                  return (
                    <motion.li
                      key={item.id}
                      custom={index}
                      initial="closed"
                      animate="open"
                      variants={itemVariants}
                    >
                      <div>
                        <div className="flex items-center justify-between"
                        onClick={(e) => {
                              if (!hasSubmenu) {
                                onClose();
                              } else {
                                e.preventDefault();
                                toggleSubmenu(item.title);
                              }
                            }}>
                          <LangLink
                            href={item.href || "#"}
                            
                            className="text-16 font-light uppercase flex-1 hover:font-bold transition-all duration-300"
                          >
                            {item.title}
                          </LangLink>

                          {hasSubmenu && (
                            <button 
                              className="p-2"
                            >
                              <motion.svg
                                animate={{
                                  rotate:
                                    openSubmenu === item.title ? 180 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </motion.svg>
                            </button>
                          )}
                        </div>

                        {/* SUBMENU */}
                        <AnimatePresence>
                          {hasSubmenu && openSubmenu === item.title && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className={`${isArabic ? "pr-4" : "pl-4"} mt-3 space-y-[10px]`}
                            >
                              {item.submenu.map((sub, i) => (
                                <li key={i}>
                                  <LangLink
                                    href={sub.href}
                                    onClick={onClose} 
                                    className="text-base font-light hover:font-bold transition-all duration-300 block"
                                  >
                                    {sub.label}
                                  </LangLink>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>

              {/* ACTIONS */}
              <motion.div
                custom={navData.mainMenu.length}
                initial="closed"
                animate="open"
                variants={itemVariants}
                className="space-y-4 pt-6 border-t border-gray-200"
              >
                <button className="w-full bg-gradient-to-r from-[#30B6F9] to-[#1E45A2] text-white text-sm uppercase rounded-full px-5 py-3">
                  {isArabic ? "English" : "العربية"}
                </button>

                <div className="p-[1px] rounded-full bg-gradient-to-r from-[#30B6F9] via-[#1E45A2] to-[#30B6F9]">
                  <LangLink href="https://portal.zinghr.ae/2015/pages/authentication/zing.aspx?ccode=shapoorji" target="_blank" ><button className="w-full uppercase px-5 py-2 bg-white rounded-full">
                    {isArabic ? "Employee login" : "Employee login"}
                  </button></LangLink>
                </div>

                <button className="w-full bg-black/80 rounded-full p-3 flex items-center justify-center gap-2 text-white" onClick={()=>setMobileMenuOpenSearch(true)}>
                  <span className="text-sm uppercase">{isArabic ? "Search" : "Search"}</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HomeMobileNavbar;
