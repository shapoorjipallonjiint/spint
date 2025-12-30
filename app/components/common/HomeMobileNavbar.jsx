"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

const HomeMobileNavbar = ({ isOpen, onClose }) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const menuItems = [
    { name: "About", href: "/about-us", submenu: null },
    {
      name: "Services",
      submenu: [
        { name: "Engineering & Construction", href: "/engineering-construction" },
        { name: "MEP", href: "/mep" },
        { name: "Design Studio", href: "/design-studio" },
        { name: "Interior Fit-out", href: "/interior-design" },
        { name: "Facade", href: "/facade" },
        { name: "Facilities Management", href: "/integrated-facility-management" },
        { name: "Water", href: "/water" },
      ],
    },
    { name: "Global Presence", href: "/global-presence", submenu: null },
    { name: "Projects", href: "/projects", submenu: null },
    {
      name: "Our Commitments",
      submenu: [
        { name: "Community Engagement", href: "/community-engagement" },
        { name: "Health safety & environmental", href: "/hse" },
        { name: "Quality", href: "/quality" },
      ],
    },
    {
      name: "Newsroom",
      submenu: [
        { name: "Press Releases", href: "/press-releases" },
        { name: "Gallery", href: "/gallery" },
      ],
    },
    { name: "Careers", href: "/careers", submenu: null },
    { name: "Contact", href: "/contact-us", submenu: null },
  ];

  const toggleSubmenu = (name) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  /* animations — unchanged */
  const menuVariants = {
    closed: {
      x: "100%",
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
    closed: { x: 20, opacity: 0 },
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
            className="fixed inset-0 bg-black bg-opacity-30 z-50 lg:hidden"
          />

          {/* SLIDE PANEL */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed top-0 right-0 h-full w-full max-w-[320px] bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
          >
            {/* CLOSE */}
            <div className="absolute right-5 top-5">
              <button onClick={onClose} className="w-10 h-10 flex items-center justify-center">
                <div className="relative w-6 h-6">
                  <span className="absolute w-6 h-0.5 bg-black rotate-45 top-1/2" />
                  <span className="absolute w-6 h-0.5 bg-black -rotate-45 top-1/2" />
                </div>
              </button>
            </div>

            {/* LOGO */}
            <div className="flex items-center p-3 absolute">
              <img src="./assets/images/main-logo.svg" alt="logo" />
            </div>

            {/* CONTENT */}
            <div className="p-8 pt-28 flex flex-col justify-between h-full">
              {/* MENU */}
              <ul className="space-y-3">
                {menuItems.map((item, index) => {
                  const hasSubmenu = Array.isArray(item.submenu);

                  return (
                    <motion.li
                      key={index}
                      custom={index}
                      initial="closed"
                      animate="open"
                      variants={itemVariants}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <Link
                            href={item.href || "#"}
                            onClick={(e) => {
                              if (!hasSubmenu) {
                                onClose();
                              } else {
                                e.preventDefault();
                                toggleSubmenu(item.name);
                              }
                            }}
                            className="text-16 font-light uppercase flex-1 hover:font-bold transition-all duration-300"
                          >
                            {item.name}
                          </Link>

                          {hasSubmenu && (
                            <button onClick={() => toggleSubmenu(item.name)} className="p-2">
                              <motion.svg
                                animate={{ rotate: openSubmenu === item.name ? 180 : 0 }}
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
                          {hasSubmenu && openSubmenu === item.name && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="pl-4 mt-3 space-y-3"
                            >
                              {item.submenu.map((sub, i) => (
                                <li key={i}>
                                  <Link
                                    href={sub.href}
                                    onClick={onClose}
                                    className="block text-[14px] hover:font-bold transition-all duration-200"
                                  >
                                    {sub.name}
                                  </Link>
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

              {/* ACTIONS (MISSING PART – NOW ADDED) */}
              <motion.div
                custom={menuItems.length}
                initial="closed"
                animate="open"
                variants={itemVariants}
                className="space-y-4 pt-6 border-t border-gray-200"
              >
                {/* Arabic */}
                <button className="w-full bg-gradient-to-r from-[#30B6F9] to-[#1E45A2] text-white text-sm font-light uppercase rounded-full px-5 py-3 hover:scale-105 transition-all duration-300">
                  العربية
                </button>

                {/* Employee Login */}
                <div className="p-[1px] rounded-full bg-gradient-to-r from-[#30B6F9] via-[#1E45A2] to-[#30B6F9] animate-[gradient_3s_linear_infinite] bg-[length:200%_200%]">
                  <button className="w-full uppercase text-base font-light px-5 py-2 bg-white rounded-full hover:bg-[#f7faff] transition-all duration-300">
                    Employee login
                  </button>
                </div>

                {/* Search */}
                <button className="w-full bg-[#000000CC] rounded-full p-3 flex items-center justify-center gap-2 text-white hover:shadow-[0_0_12px_rgba(48,182,249,0.6)] transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span className="text-sm uppercase">Search</span>
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
