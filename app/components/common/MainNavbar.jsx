"use client"

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const MainNavbar = () => {
    const [isSticky, setIsSticky] = useState(false);
    const [navHeight, setNavHeight] = useState(0);
    const navRef = useRef(null);

    // Measure nav height once (to create spacer and avoid jump)
    useEffect(() => {
        function updateNavHeight() {
            if (navRef.current) {
                setNavHeight(navRef.current.offsetHeight);
            }
        }

        // Run on page load
        updateNavHeight();

        // Run on resize
        window.addEventListener("resize", updateNavHeight);

        // Cleanup when component unmounts
        return () => window.removeEventListener("resize", updateNavHeight);
    }, []);

    // Scroll listener to toggle sticky
    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 100);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState(null);

    const menuItems = [
        { name: "About", submenu: [{name: "Overview", href: "/about-us"}, {name: "Leadership", href: "/leadership"}] },
        {
            name: "Services",
            submenu: [
                { name: "Engineering & Construction", href: "/services/engineering-construction" },
                { name: "MEP", href: "/services/mep" },
                { name: "Design Studio", href: "/services/design-studio" },
                { name: "Interior Fit-out", href: "/services/interior-design" },
                { name: "Facade", href: "/services/facade" },
                { name: "Facilities Management", href: "/services/integrated-facility-management" },
                { name: "Water", href: "/services/water" },
            ],
        },
        { name: "Global Presence", submenu: null, href: "/global-presence" },
        {
            name: "Projects",
            href: "/projects",
            // submenu: ['Residential', 'Commercial', 'Industrial', 'Infrastructure']
        },
        {
            name: "Our Commitments",
            submenu: [
                { name: "Sustainability", href: "/sustainability" },
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
        { name: "Careers", submenu: null, href: "/careers" },
        { name: "Contact", submenu: null, href: "/contact-us" },
    ];

    const toggleSubmenu = (itemName) => {
        setOpenSubmenu(openSubmenu === itemName ? null : itemName);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const menuVariants = {
        closed: {
            x: "100%",
            transition: {
                type: "tween",
                duration: 0.3,
                ease: "easeInOut",
            },
        },
        open: {
            x: 0,
            transition: {
                type: "tween",
                duration: 0.3,
                ease: "easeInOut",
            },
        },
    };

    const overlayVariants = {
        closed: {
            opacity: 0,
            transition: {
                duration: 0.2,
            },
        },
        open: {
            opacity: 1,
            transition: {
                duration: 0.2,
            },
        },
    };

    const itemVariants = {
        closed: { x: 20, opacity: 0 },
        open: (i) => ({
            x: 0,
            opacity: 1,
            transition: {
                delay: 0.1 + i * 0.05,
                duration: 0.3,
            },
        }),
    };

    const submenuItem = {
        hidden: {
            opacity: 0,
            y: 16,
            x: -10,
            filter: "blur(4px)",
        },
        show: {
            opacity: 1,
            y: 0,
            x: 0,
            filter: "blur(0px)",
            transition: {
                duration: 0.4,
                ease: "easeInOut",
            },
        },
    };

    return (
        <>
            <nav
                ref={navRef}
                className={`min-h-[74px] md:min-h-[78.14px] xl:min-h-[91px]
          border-b border-[#f0f0f0]
          bg-white
          z-50 fixed
          transition-all duration-300 w-full
          ${isSticky ? " top-0 left-0 right-0 shadow-md translate-y-0 " : " shadow-none"}
        `}
            >
                <div className="container relative  mx-auto px-4 pt-[8px] pb-[8px] md:pt-[16px] md:pb-[17px]">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-[10px] z-[60]">
                            <Link href="/">
                                {" "}
                                <Image
                               width={0}
                               height={0}
                                    src="/assets/images/main-logo.svg"
                                    alt="logo"
                                    className="w-[101px] lg:w-[80px] xl:w-[101px]"
                                />
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <ul className="hidden lg:flex items-center gap-2 xl:gap-4 2xl:gap-4 3xl:gap-[35px]">
                            {menuItems.map((item, index) => (
                                // <li key={index} className="relative group">
                                <li key={index} className="relative group" onMouseEnter={() => setOpenSubmenu(index)} onMouseLeave={() => setOpenSubmenu(null)}>
                                   
                                    <Link href={item.href || "#"} className="flex items-center gap-1 text-[11px] md:text-11 2xl:text-[12px] 3xl:text-16 leading-[1.75] font-300 uppercase hover:font-bold active:font-bold focus-within:font-bold transition-all duration-300">
                                        <span className="relative inline-block group">
                                            <span className={`font-bold  opacity-0 transition-all duration-300 ${item.submenu != null ? 'mr-[16px]' : ''}`}>
                                                {item.name}
                                            </span>

                                            <span className="absolute  whitespace-nowrap flex items-center inset-0 font-300 transition-opacity duration-200 group-hover:opacity-0">
                                                {item.name}
                                                {item.submenu && (
                                                    <svg
                                                        className="min-w-5 min-h-4 h-3 "
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                )}
                                            </span>

                                            <span className="absolute whitespace-nowrap flex items-center inset-0 group-hover:font-bold opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                                {item.name}
                                                {item.submenu && (
                                                    <svg
                                                        className="min-w-5 min-h-4 h-3 group-hover:font-bold "
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                )}
                                            </span>
                                        </span>
                                    </Link>
                                    {/* {item.submenu && (
                    <div className="absolute top-full left-0 mt-2 w-70 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                       <ul className="py-2">
                          {item.submenu.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <Link
                                to={subItem.href}   
                                className="block px-4 py-2 text-sm font-300 hover:bg-gray-100 hover:font-bold transition-all duration-200"
                              >
                                {subItem.name}      
                              </Link>
                            </li>
                          ))}
                        </ul>
                    </div>
                  )} */}

                                    {item.submenu && (
                                        <AnimatePresence>
                                            {openSubmenu === index && (
                                                <motion.div
                                                    key="submenu"
                                                    initial="hidden"
                                                    animate="show"
                                                    exit="exit"
                                                    variants={{
                                                        hidden: { opacity: 0, height: 0 },
                                                        show: {
                                                            opacity: 1,
                                                            height: "auto",
                                                            transition: {
                                                                duration: 0.35,
                                                                ease: [0.25, 0.1, 0.25, 1],
                                                                staggerChildren: 0.05, // 🔥 submenuItem animations restored
                                                            },
                                                        },
                                                        exit: {
                                                            opacity: 0,
                                                            height: 0,
                                                            transition: { duration: 0.25 },
                                                        },
                                                    }}
                                                    className="absolute left-0 top-full overflow-hidden pt-2 w-70 bg-white shadow-lg rounded-lg z-[999] origin-top"
                                                >
                                                    <motion.ul className="py-2">
                                                        {item.submenu.map((subItem, subIndex) => (
                                                            <motion.li key={subIndex} variants={submenuItem}>
                                                                <Link
                                                                    href={subItem.href}
                                                                    className="block px-4 py-2 text-[12px] xl:text-[14px] 3xl:text-[16px]
                font-300 hover:bg-gray-100 hover:font-bold hover:text-[#1E45A2]
                hover:translate-x-[2px] transition-all duration-200"
                                                                >
                                                                    {subItem.name}
                                                                </Link>
                                                            </motion.li>
                                                        ))}
                                                    </motion.ul>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    )}
                                </li>
                            ))}
                        </ul>

                        <div className="flex items-center gap-3">
                            {/* Desktop Actions */}
                            <div className="hidden md:flex items-center">
                                <button className="bg-gradient-to-r from-[#30B6F9] to-[#1E45A2] text-white text-13 leading-[1.230769230769231] font-300 uppercase rounded-full px-4 2xl:px-[22px] py-[7.5px] cursor-pointer mr-3 hover:scale-[1.03] transition-all duration-300">
                                    العربية
                                </button>
                                <div className="leading-[1] p-[1px] rounded-full bg-gradient-to-r from-[#30B6F9] via-[#1E45A2] to-[#30B6F9] animate-[gradient_3s_linear_infinite] bg-[length:200%_200%] inline-block transition-all duration-300 hover:shadow-[0_0_12px_rgba(48,182,249,0.6)] hover:scale-[1.03] cursor-pointer">
                                    <button className="uppercase text-[10px] xl:text-[12px] 2xl:text-16 leading-[1.75] font-300 px-[10px] 2xl:px-[18px] py-[5px] xl:py-1 2xl:py-[1.5px]  bg-white rounded-full transition-all duration-300 hover:bg-[#f7faff]">
                                        Employee login
                                    </button>
                                </div>
                                <button className="cursor-pointer bg-[#000000CC] rounded-full p-[2px] w-[30px] h-[30px]  2xl:w-[45px] 2xl:h-[45px] flex items-center justify-center ml-3 xl:ml-5 transition-all duration-300 hover:shadow-[0_0_12px_rgba(48,182,249,0.6)] group">
                                    <Image
                                    width={0}
                                    height={0}
                                        src="/assets/images/icons/search-icon.svg"
                                        alt="search"
                                        className="group-hover:scale-[1.1] transition-all duration-300 w-[12px] h-[12px] 2xl:w-[18px] 2xl:h-[18px]"
                                    />
                                </button>
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={toggleMenu}
                                className="lg:hidden z-[60] w-10 h-10 flex items-center justify-center transition-all duration-300 relative"
                                aria-label="Toggle menu"
                            >
                                {isMenuOpen ? (
                                    // Close Icon (X)
                                    <div className="relative w-6 h-6 flex items-center justify-center">
                                        <motion.span
                                            initial={{ rotate: 0, scale: 0 }}
                                            animate={{ rotate: 45, scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                            className="w-6 h-0.5 bg-black block absolute"
                                        />
                                        <motion.span
                                            initial={{ rotate: 0, scale: 0 }}
                                            animate={{ rotate: -45, scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                            className="w-6 h-0.5 bg-black block absolute"
                                        />
                                    </div>
                                ) : (
                                    // Hamburger Icon
                                    <div className="flex flex-col gap-1.5">
                                        <motion.span className="w-6 h-0.5 bg-black block" />
                                        <motion.span className="w-6 h-0.5 bg-black block" />
                                        <motion.span className="w-6 h-0.5 bg-black block" />
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <div style={{ height: isSticky ? navHeight : navHeight }} className="transition-[height] duration-300" />
            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={overlayVariants}
                            onClick={toggleMenu}
                            className="fixed inset-0 bg-black bg-opacity-30 z-50 lg:hidden"
                        />
                        <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={menuVariants}
                            className="fixed top-0 right-0 h-full w-full max-w-[320px] bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
                        >
                            <div className="absolute right-5 top-5">
                                <button
                                    onClick={toggleMenu}
                                    className="lg:hidden z-[60] w-10 h-10 flex items-center justify-center transition-all duration-300 relative"
                                    aria-label="Toggle menu"
                                >
                                    {isMenuOpen ? (
                                        // Close Icon (X)
                                        <div className="relative w-6 h-6 flex items-center justify-center">
                                            <motion.span
                                                initial={{ rotate: 0, scale: 0 }}
                                                animate={{ rotate: 45, scale: 1 }}
                                                transition={{ duration: 0.3 }}
                                                className="w-6 h-0.5 bg-black block absolute"
                                            />
                                            <motion.span
                                                initial={{ rotate: 0, scale: 0 }}
                                                animate={{ rotate: -45, scale: 1 }}
                                                transition={{ duration: 0.3 }}
                                                className="w-6 h-0.5 bg-black block absolute"
                                            />
                                        </div>
                                    ) : (
                                        // Hamburger Icon
                                        <div className="flex flex-col gap-1.5">
                                            <motion.span className="w-6 h-0.5 bg-black block" />
                                            <motion.span className="w-6 h-0.5 bg-black block" />
                                            <motion.span className="w-6 h-0.5 bg-black block" />
                                        </div>
                                    )}
                                </button>
                            </div>
                            <div className="flex items-center p-3 absolute">
                                <img src="./assets/images/main-logo.svg" alt="logo" />
                            </div>
                            <div className="p-8 pt-28 flex flex-col gap-2 justify-between h-full">
                                {/* Mobile Menu Items */}
                                <ul className="space-y-3 ">
                                    {menuItems.map((item, index) => {
                                        const hasSubmenu = Array.isArray(item.submenu) && item.submenu.length > 0;

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
                                                                    // no submenu → navigate + close
                                                                    toggleMenu();
                                                                } else {
                                                                    // has submenu → don't navigate, toggle submenu
                                                                    e.preventDefault();
                                                                    toggleSubmenu(item.name);
                                                                }
                                                            }}
                                                            className="text-16 font-light uppercase hover:font-bold transition-all duration-300 flex-1"
                                                        >
                                                            {item.name}
                                                        </Link>

                                                        {hasSubmenu && (
                                                            <button
                                                                onClick={() => toggleSubmenu(item.name)}
                                                                className="p-2 ml-2"
                                                                type="button"
                                                            >
                                                                <motion.svg
                                                                    animate={{
                                                                        rotate: openSubmenu === item.name ? 180 : 0,
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

                                                    {/* Submenu */}
                                                    <AnimatePresence>
                                                        {hasSubmenu && openSubmenu === item.name && (
                                                            <motion.ul
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                                className="overflow-hidden pl-4 mt-3 space-y-3"
                                                            >
                                                                {item.submenu.map((subItem, subIndex) => (
                                                                    <li key={subIndex}>
                                                                        <Link
                                                                            href={subItem.href} // ✅ use its href
                                                                            onClick={toggleMenu}
                                                                            className="text-base font-light hover:font-bold transition-all duration-300 block"
                                                                        >
                                                                            {subItem.name}
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

                                {/* Mobile Actions */}
                                <motion.div
                                    custom={menuItems.length}
                                    initial="closed"
                                    animate="open"
                                    variants={itemVariants}
                                    className="space-y-4 pt-6 border-t border-gray-200"
                                >
                                    <button className="w-full bg-gradient-to-r from-[#30B6F9] to-[#1E45A2] text-white text-sm leading-tight font-light uppercase rounded-full px-5 py-3 cursor-pointer hover:scale-105 transition-all duration-300">
                                        العربية
                                    </button>
                                    <div className="p-[1px] rounded-full bg-gradient-to-r from-[#30B6F9] via-[#1E45A2] to-[#30B6F9] animate-[gradient_3s_linear_infinite] bg-[length:200%_200%] transition-all duration-300 hover:shadow-[0_0_12px_rgba(48,182,249,0.6)] hover:scale-105">
                                        <button className="w-full uppercase text-base leading-7 font-light px-5 py-2 bg-white rounded-full transition-all duration-300 hover:bg-[#f7faff]">
                                            Employee login
                                        </button>
                                    </div>
                                    <button className="w-full cursor-pointer bg-[#000000CC] rounded-full p-3 flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_0_12px_rgba(48,182,249,0.6)] text-white">
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
        </>
    );
};

export default MainNavbar;
