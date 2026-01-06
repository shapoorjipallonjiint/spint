// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import gsap from "gsap";
// import { ScrollToPlugin } from "gsap/ScrollToPlugin";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useGSAP } from "@gsap/react";
// import NavPage from "../components/common/NavPage";
// import { AnimatePresence, motion } from "framer-motion";
// import Image from "next/image";

// gsap.registerPlugin(ScrollToPlugin);
// gsap.registerPlugin(ScrollTrigger);

// const sections = [
//   { id: "section1", label: "" },
//   { id: "section2", label: "SP GROUP" },
//   { id: "section3", label: "SPINT" },
//   { id: "section4", label: "SERVICES" },
//   { id: "section5", label: "PROJECTS" },
//   { id: "section6", label: "PEOPLE" },
//   { id: "section7", label: "PEOPLE" },
// ];

// const HeaderTw = ({ activeSection, setActiveSection, setIndexToScroll }) => {
//   const headerRef = useRef(null);
//   const navItemsRef = useRef([]);
//   navItemsRef.current = [];

//   const addToNavRefs = (el) => {
//     if (el && !navItemsRef.current.includes(el)) {
//       navItemsRef.current.push(el);
//     }
//   };

//   useGSAP(() => {
//     const tl = gsap.timeline();

//     // .bxone initial animation
//     tl.fromTo(
//       ".bxone",
//       {
//         height: "0%",
//       },
//       {
//         height: "100%",
//         duration: 1,
//         delay: 3.5,
//         ease: "Power3.easeInOut",
//       }
//     );

//     // .bxtwo jump-style animation
//     gsap.set(".bxtwo", {
//       height: "20%",
//       y: "100%",
//     });

//     tl.to(".bxtwo", {
//       y: "-10%",
//       duration: 0.5,
//       ease: "back.out(1.7)",
//     })
//       .to(".bxtwo", {
//         y: "0%",
//         duration: 0.3,
//         ease: "power2.out",
//       })
//       .to(".bxtwo", {
//         height: "100%",
//         duration: 1,
//         ease: "power2.inOut",
//       });

//     // Continue your timeline
//     tl.fromTo(
//       ".logsc",
//       {
//         opacity: 0,
//         y: 10,
//       },
//       {
//         y: 0,
//         opacity: 1,
//         duration: 0.5,
//         ease: "back.inOut(1)",
//       }
//     );

//     tl.fromTo(
//       ".mnsc",
//       {
//         opacity: 0,
//         scale: 1.1,
//       },
//       {
//         scale: 1,
//         opacity: 1,
//         duration: 0.5,
//         delay: "-=0.5", // relative overlap
//         ease: "power3.easeInOut",
//       }
//     );

//     tl.fromTo(
//       ".scrlldwn",
//       {
//         opacity: 0,
//         y: -10,
//       },
//       {
//         y: 0,
//         opacity: 1,
//         duration: 0.5,
//         ease: "power3.easeInOut",
//       }
//     );

//     tl.fromTo(
//       ".arcrcl",
//       {
//         rotate: "180deg",
//       },
//       {
//         rotate: 0,
//         duration: 1,
//         ease: "Power3.easeInOut",
//       }
//     );
//   }, []);

//   const [logostatus, setLogostatus] = useState(false);

//   const length = activeSection.length;
//   console.log(activeSection[length - 1]);

// useEffect(() => {

//   const lastValue = Number(activeSection[activeSection.length - 1]);

//   if (lastValue == 6) {
//     setLogostatus(true);   // set only once
//   }
//   else{
//     setLogostatus(false);
//   }
// }, [activeSection]);

//   console.log(logostatus);
//   const nextSection = sections.find(
//     (section) =>
//       section.id === `section${parseInt(activeSection[length - 1]) + 1}`
//   );
//   const scrollStep = 700;

//   const handleScroll = (sectionId) => {
//     console.log("clicked");
//     console.log(sectionId);
//     switch (sectionId) {
//       case "section2":
//         setIndexToScroll(1);
//         break;
//       case "section3":
//         setIndexToScroll(2);
//         break;
//       case "section4":
//         setIndexToScroll(3);
//         break;
//       case "section5":
//         setIndexToScroll(4);
//         break;
//       case "section6":
//         setIndexToScroll(5);
//         break;
//       case "section7":
//         setIndexToScroll(6);
//         break;
//     }

//     const index = sections.findIndex((s) => s.id === sectionId);

//     // if (index !== -1) {
//     //   console.log(index * scrollStep)
//     //   gsap.to(window, {
//     //     scrollTo: {
//     //       y: (index * scrollStep) + 1,
//     //       autoKill: false, // important if using ScrollTrigger-based logic
//     //     },
//     //     duration: 1,
//     //     ease: "power2.inOut",
//     //   });
//     // }
//   };

//   const activeIndex = sections.findIndex((s) => s.id === activeSection);
//     const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <>
//       <div className="fixed top-13 right-0 lg:right-10 3xl:right-38 z-[50] w-full ">
//         <div className="flex gap-8 items-center justify-between lg:justify-end ps-5 lg:ps-0">
//           <div className="flex justify-center items-center lg:hidden">
//             <Image
//               src="/assets/images/main-logo.svg"
//               width={90}
//               height={55}
//               className={`logsc ${logostatus === true ? "block" : "hidden"}`}
//               alt="main-logo"
//             />

//             <Image
//               src="/assets/images/logo.svg"
//               width={90}
//               height={55}
//               className={`logsc ${logostatus === true ? "hidden" : "block"}`}
//             />
//           </div>
//           <div className="flex gap-6 lg:gap-2">
//             <a href="#">
//               <div className="flex items-center justify-center z-[1]  cursor-pointer relative  h-[31px] bg-[#00000040] rounded-[15px]">
//                 <Image
//                   src="../assets/images/grbdr.svg"
//                   alt="Logo"
//                   className="absolute w-full h-full"
//                   width={18}
//                   height={31}
//                 />
//                 <p className="mb-0 text-white font-[300] text-[16px] px-5">
//                   العربية
//                 </p>
//               </div>
//             </a>
//             <div className="flex lg:hidden justify-center items-center ">

// <svg xmlns="http://www.w3.org/2000/svg" width="31" height="24" viewBox="0 0 33 26" fill="none">
// <path d="M32 1L1 0.999997" stroke={logostatus ? "#1E45A2" : "#ffffff"} strokeWidth="2" strokeLinecap="round"/>
// <path d="M32 13L1 13" stroke="#30B6F9" strokeWidth="2" strokeLinecap="round"/>
// <path d="M32 25L1 25" stroke={logostatus ? "#1E45A2" : "#ffffff"} strokeWidth="2" strokeLinecap="round"/>
// </svg>

//             </div>
//             <a href="#">
//               <div className="hidden lg:flex items-center justify-center z-[1]  cursor-pointer relative  h-[31px] bg-[#00000040] rounded-[15px]">
//                 <Image
//                 width={300}
//                 height={300}
//                   src="../assets/images/border-wide.svg"
//                   alt="Logo"
//                   className="absolute w-full h-full"
//                 />
//                 <p className="mb-0 text-white z-1 font-[300] text-[16px] px-4 pt-[1px] uppercase">
//                   Employee Login
//                 </p>
//               </div>
//             </a>
//           </div>
//           <div className="hidden lg:flex items-center justify-center bg-black rounded-full p-2 w-11 h-11">
//             <Image
//               src="../assets/images/search.svg"
//               alt="Logo"
//               width={18}
//               height={18}
//             />
//           </div>
//         </div>
//       </div>

//       {/* <header className="fixed top-0 left-0 z-50 hidden lg:block"> */}
//       <header className="fixed top-0 left-0 z-20 hidden lg:block">

//         <div className="flex">
//           <div className="flex w-[150px] h-screen">
//             {activeSection !== "section1" && (
//               <nav className="flex flex-col justify-center gap-4 opacity-0">
//                 {sections.map((section, index) => {
//                   const activeIndex = sections.findIndex(
//                     (s) => s.id === activeSection
//                   );
//                   const distance = Math.abs(index - activeIndex);
//                   const opacity = Math.max(1 - distance * 0.3, 0.1);

//                   const isActive = activeSection === section.id;
//                   const isBlackTheme = ["section3", "section4"].includes(
//                     activeSection
//                   );

//                   const baseColor = isBlackTheme
//                     ? "text-black hover:text-red"
//                     : "text-white hover:text-white";

//                   return (
//                     <a
//                       key={section.id}
//                       href={`#${section.id}`}
//                       onClick={(e) => {
//                         e.preventDefault();
//                         console.log("click is happening");
//                         handleScroll(section.id);
//                       }}
//                       style={{ opacity }}
//                       className={`transition-all duration-300 font-[300] hover:font-[700] text-12 z-1000
//   ${
//     isActive ? `font-[700] activebfr ${baseColor}` : `nonactivebfr ${baseColor}`
//   }`}
//                     >
//                       {section.label}
//                     </a>
//                   );
//                 })}
//               </nav>
//             )}
//           </div>
//           <div className="left-spacing fixed ">
// <div
//   ref={headerRef}
//   className={`shadow ml-0 my-12 w-[125px] 3xl:w-[133px] h-[calc(100vh-100px)] relative
//       transition-all duration-300
//       ${menuOpen ? "bg-white" : ""}
//   `}
// >

//               <div className="bg-transparent  w-full absolute z-[-2] bxone"></div>
//               <div className="bg-primary h-[20%] w-full absolute z-[-1] bottom-0 bxtwo"></div>
//               <div className="flex flex-col justify-between h-full pt-10 pb-6 z-10 w-full">
//                 <div className="flex justify-center items-center">
//                   {
//                     !menuOpen ?
//                   <Image
//                     className="logsc"
//                     src="/assets/images/icons/logo-white.svg"
//                     alt="Logo"
//                     width={90}
//                     height={55}
//                   />
//                   :
//                                     <Image
//                     className="logsc"
//                     src="/assets/images/main-logo.svg"
//                     alt="Logo"
//                     width={90}
//                     height={55}
//                   />
// }
//                 </div>
//                 <div className="flex justify-center items-center">
//                   {/* <Image
//                     src="/assets/images/menu-crbs.svg"
//                     className="mnsc cursor-pointer"
//                     alt="Menu"
//                     width={31}
//                     height={24}
//                   /> */}
// {!menuOpen ? (
//   // DESKTOP HAMBURGER
//   <Image
//     src="/assets/images/menu-crbs.svg"
//     className="mnsc cursor-pointer"
//     alt="Menu"
//     width={31}
//     height={24}
//     onClick={() => setMenuOpen(true)}
//   />
// ) : (
//   // DESKTOP CLOSE ICON
//   <Image
//     src="/assets/images/icons/close.svg"
//     className="cursor-pointer"
//     alt="Menu"
//     width={22}
//     height={22}
//     onClick={() => setMenuOpen(false)}
//   />
// )}

//                 </div>
//                 <div
//                   className={`flex flex-col gap-3 justify-center items-center border-t ${menuOpen ? "border-[#626262]" : "border-white/25"} cursor-pointer scrlldwn`}
//                   onClick={() => handleScroll(nextSection.id)}
//                 >
// <AnimatePresence mode="wait">
//   <motion.p
//     key={activeSection === "section7" ? "up" : "down"}
//     initial={{ opacity: 0, y: 10 }}
//     animate={{ opacity: 1, y: 0 }}
//     exit={{ opacity: 0, y: -10 }}
//     transition={{ duration: 0.35 }}
//     className={`${menuOpen ? "text-[#626262]" : "text-white"} font-[300] text-[13px] leading-[25px] pt-3 uppercase`}
//   >
//     {activeSection === "section7" ? "scroll up" : "scroll down"}
//   </motion.p>
// </AnimatePresence>

//                   {/* <Image src="/assets/images/round-arrow-down-menu.svg" alt="Arrow" width={87} height={87} /> */}
//                   <div className={`flex items-center relative group ${menuOpen ? "border rounded-full border-[#626262]" : ""}`}>
//                     <Image
//                       src="/assets/images/round-circle.svg"
//                       alt="Arrow"
//                       width={87}
//                       height={87}
//                     />
//                     <Image
//                       src="/assets/images/arrow-down.svg"
//                       alt="Arrow"
//                       width={35}
//                       height={35}
//                       className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0
//                group-hover:scale-110 transition-transform duration-300 ease-in-out
//                animate-[scaleFade_0.8s_ease-out_forwards] [animation-delay:1.5s] ${activeSection === "section7" ? "rotate-180 duration-500" : ""} `}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>
//       <div
//         className="block lg:hidden absolute bottom-0 z-20 right-1/2 translate-x-1/2 "
//         onClick={() => handleScroll(nextSection.id)}
//       >
//         <div className="w-[35px] h-[35px] bg-primary flex items-center justify-center  mx-auto mb-7">
//           <div className={`${menuOpen ? "border-[#626262]" : "border-white"} w-[22px] h-[22px] border rounded-full flex items-center justify-center `}>
//             <Image src="../assets/images/home/downarrow.svg" width={22} height={22} alt="downarrow"/>
//           </div>
//         </div>
//       </div>
//       <NavPage isOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />

//     </>
//   );
// };

// export default HeaderTw;

"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import NavPage from "../components/common/NavPage";
import NavPageSearch from "../components/common/NavPageSearch";
import { AnimatePresence, motion } from "framer-motion";
import HomeMobileNavbar from "../components/common/HomeMobileNavbar";
import HomeMobileNavbarSearch from "../components/common/HomeMobileNavbarSearch";
import Image from "next/image";

gsap.registerPlugin(ScrollToPlugin);
gsap.registerPlugin(ScrollTrigger);

const sections = [
    { id: "section1", label: "" },
    { id: "section2", label: "SP GROUP" },
    { id: "section3", label: "SPINT" },
    { id: "section4", label: "SERVICES" },
    { id: "section5", label: "PROJECTS" },
    { id: "section6", label: "PEOPLE" },
    { id: "section7", label: "PEOPLE" },
];

const HeaderTw = ({ activeSection, setActiveSection, setIndexToScroll }) => {
    const headerRef = useRef(null);
    const navItemsRef = useRef([]);
    navItemsRef.current = [];
    const [searchActive, setSearchActive] = useState(false);

    const addToNavRefs = (el) => {
        if (el && !navItemsRef.current.includes(el)) {
            navItemsRef.current.push(el);
        }
    };

    useGSAP(() => {
        const tl = gsap.timeline();

        // .bxone initial animation
        tl.fromTo(
            ".bxone",
            {
                height: "0%",
            },
            {
                height: "100%",
                duration: 1,
                delay: 3.5,
                ease: "Power3.easeInOut",
            }
        );

        // .bxtwo jump-style animation
        gsap.set(".bxtwo", {
            height: "20%",
            y: "100%",
        });

        tl.to(".bxtwo", {
            y: "-10%",
            duration: 0.5,
            ease: "back.out(1.7)",
        })
            .to(".bxtwo", {
                y: "0%",
                duration: 0.3,
                ease: "power2.out",
            })
            .to(".bxtwo", {
                height: "100%",
                duration: 1,
                ease: "power2.inOut",
            });

        // Continue your timeline
        tl.fromTo(
            ".logsc",
            {
                autoAlpha: 0,
                y: 10,
            },
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.4,
                ease: "back.out(1)",
            }
        );

        tl.fromTo(
            ".logsc-btn",
            {
                autoAlpha: 0,
                yPercent: 20,
            },
            {
                autoAlpha: 1,
                yPercent: 0,
                duration: 0.45,
                ease: "power3.out",
            },
            "+=0.2"
        );

        tl.fromTo(
            ".mnsc",
            {
                opacity: 0,
                scale: 1.1,
            },
            {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                delay: "-=0.5", // relative overlap
                ease: "power3.easeInOut",
            }
        );

        tl.fromTo(
            ".scrlldwn",
            {
                opacity: 0,
                y: -10,
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.5,
                ease: "power3.easeInOut",
            }
        );

        tl.fromTo(
            ".arcrcl",
            {
                rotate: "180deg",
            },
            {
                rotate: 0,
                duration: 1,
                ease: "Power3.easeInOut",
            }
        );
    }, []);

    const [logostatus, setLogostatus] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileMenuOpenSearch,setMobileMenuOpenSearch] = useState(false)

    const length = activeSection.length;
    console.log(activeSection[length - 1]);

    useEffect(() => {
        const lastValue = Number(activeSection[activeSection.length - 1]);

        if (lastValue == 6) {
            setLogostatus(true); // set only once
        } else {
            setLogostatus(false);
        }
    }, [activeSection]);

    console.log(logostatus);
    const nextSection = sections.find((section) => section.id === `section${parseInt(activeSection[length - 1]) + 1}`);
    const scrollStep = 700;
    const scrollLock = useRef(false);

    const handleScroll = (sectionId) => {
        if (scrollLock.current) return;

        scrollLock.current = true;
        setTimeout(() => {
            scrollLock.current = false;
        }, 1800);

        console.log("clicked", sectionId);

        switch (sectionId) {
            case "section2":
                setIndexToScroll(1);
                break;
            case "section3":
                setIndexToScroll(2);
                break;
            case "section4":
                setIndexToScroll(3);
                break;
            case "section5":
                setIndexToScroll(4);
                break;
            case "section6":
                setIndexToScroll(5);
                break;
            case "section7":
                setIndexToScroll(6);
                break;
        }
    };

    const activeIndex = sections.findIndex((s) => s.id === activeSection);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <div className="fixed top-7 lg:top-13 right-0 lg:right-10 3xl:right-38 z-50 w-full">
                <div className="flex gap-8 items-center justify-between lg:justify-end ps-5 lg:ps-0">
                    <div className="flex justify-center items-center lg:hidden">
                        <Image
                            src="/assets/images/main-logo.svg"
                            width={90}
                            height={55}
                            className={`logsc ${logostatus === true ? "block" : "hidden"}`}
                            alt="main-logo"
                        />

                        <Image
                            src="/assets/images/logo.svg"
                            width={90}
                            height={55}
                            className={`logsc ${logostatus === true ? "hidden" : "block"}`}
                            alt="logo"
                        />
                    </div>
                    <div className="flex gap-6 lg:gap-2">
                        <a href="#">
                            <div className="flex items-center justify-center z-[1]  cursor-pointer relative  h-[31px] bg-[#00000040] rounded-[15px]">
                                <Image
                                    src="../assets/images/grbdr.svg"
                                    alt="Logo"
                                    className="absolute w-full h-full"
                                    width={18}
                                    height={31}
                                />
                                <p className="mb-0 text-white font-[300] text-[16px] px-5">العربية</p>
                            </div>
                        </a>
                        <div
                            className="flex lg:hidden justify-center items-center "
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="31" height="24" viewBox="0 0 33 26" fill="none">
                                <path
                                    d="M32 1L1 0.999997"
                                    stroke={logostatus ? "#1E45A2" : "#ffffff"}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                <path d="M32 13L1 13" stroke="#30B6F9" strokeWidth="2" strokeLinecap="round" />
                                <path
                                    d="M32 25L1 25"
                                    stroke={logostatus ? "#1E45A2" : "#ffffff"}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                        <a href="#">
                            <div className="hidden lg:flex items-center justify-center z-[1]  cursor-pointer relative  h-[31px] bg-[#00000040] rounded-[15px]">
                                <img src="../assets/images/border-wide.svg" alt="Logo" className="absolute w-full h-full" />
                                <p className="mb-0 text-white z-1 font-[300] text-[16px] px-4 pt-[1px] uppercase">
                                    Employee Login
                                </p>
                            </div>
                        </a>
                    </div>
                    <div className="hidden lg:flex items-center justify-center bg-black rounded-full p-2 w-11 h-11" onClick={()=>{setSearchActive(!searchActive);setMenuOpen(false)}}>
                        {!searchActive ? (<Image src="../assets/images/search.svg" alt="Logo" width={18} height={18} />) : 
                        (<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="#30b6f9"
>
  <path d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7a1 1 0 1 0-1.4 1.4L10.6 12l-4.9 4.9a1 1 0 1 0 1.4 1.4L12 13.4l4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4Z" />
</svg>)}


                    </div>
                </div>
            </div>

            {/* <header className="fixed top-0 left-0 z-50 hidden lg:block"> */}
            <header className="fixed top-0 left-0 z-20 hidden lg:block">
                <div className="flex">
                    <div className="flex w-[150px] h-screen">
                        {activeSection !== "section1" && (
                            <nav className="flex flex-col justify-center gap-4 opacity-0">
                                {sections.map((section, index) => {
                                    const activeIndex = sections.findIndex((s) => s.id === activeSection);
                                    const distance = Math.abs(index - activeIndex);
                                    const opacity = Math.max(1 - distance * 0.3, 0.1);

                                    const isActive = activeSection === section.id;
                                    const isBlackTheme = ["section3", "section4"].includes(activeSection);

                                    const baseColor = isBlackTheme
                                        ? "text-black hover:text-red"
                                        : "text-white hover:text-white";

                                    return (
                                        <a
                                            key={section.id}
                                            href={`#${section.id}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                console.log("click is happening");
                                                handleScroll(section.id);
                                            }}
                                            style={{ opacity }}
                                            className={`transition-all duration-300 font-[300] hover:font-[700] text-12 z-1000
  ${isActive ? `font-[700] activebfr ${baseColor}` : `nonactivebfr ${baseColor}`}`}
                                        >
                                            {section.label}
                                        </a>
                                    );
                                })}
                            </nav>
                        )}
                    </div>
                    <div className="left-spacing fixed ">
                        <div
                            ref={headerRef}
                            className={`shadow ml-0 my-12 w-[125px] 3xl:w-[133px] h-[calc(100vh-100px)] relative
      transition-all duration-300
      ${menuOpen ? "bg-white" : "bg-primary"}
  `}
                        >
                            <div className="bg-transparent  w-full absolute z-[-2] bxone"></div>
                            <div className="bg-primary h-[20%] w-full absolute z-[-1] bottom-0 bxtwo"></div>
                            <div className="flex flex-col justify-between h-full pt-10 pb-6 z-10 w-full">
                                <div className="flex justify-center items-center">
                                    {!menuOpen ? (
                                        <Image
                                            className="logsc"
                                            src="/assets/images/icons/logo-white.svg"
                                            alt="Logo"
                                            width={90}
                                            height={55}
                                        />
                                    ) : (
                                        <Image
                                            className="logsc"
                                            src="/assets/images/main-logo.svg"
                                            alt="Logo"
                                            width={90}
                                            height={55}
                                        />
                                    )}
                                </div>
                                <div className="flex justify-center items-center">
                                    {/* <img
                    src="/assets/images/menu-crbs.svg"
                    className="mnsc cursor-pointer"
                    alt="Menu"
                    width={31}
                    height={24}
                  /> */}
                                    {/* {!menuOpen ? (
  // DESKTOP HAMBURGER
  <img
    src="/assets/images/menu-crbs.svg"
    className="mnsc cursor-pointer"
    alt="Menu"
    width={31}
    height={24}
    onClick={() => setMenuOpen(true)}
  />
) : (
  // DESKTOP CLOSE ICON
  <img
    src="/assets/images/icons/close.svg"
    className="cursor-pointer"
    alt="Menu"
    width={22}
    height={22}
    onClick={() => setMenuOpen(false)}
  />
)} */}

                                    <button
                                        onClick={() => {setSearchActive(false);setMenuOpen((prev) => !prev)}}
                                        className="relative w-[31px] h-[28px] flex items-center justify-center cursor-pointer"
                                        aria-label="Menu Toggle"
                                    >
                                        <svg
                                            width="31"
                                            height="28"
                                            viewBox="0 0 31 28"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`menu-icon ${menuOpen ? "open" : ""} logsc-btn`}
                                        >
                                            <line x1="0" y1="2" x2="31" y2="2" className="line line1" />
                                            <line x1="0" y1="14" x2="31" y2="14" className="line line2" />
                                            <line x1="0" y1="26" x2="31" y2="26" className="line line3" />
                                        </svg>
                                    </button>
                                </div>
                                <div
                                    className={`flex flex-col gap-3 justify-center items-center border-t ${
                                        menuOpen ? "border-[#626262]" : "border-white/25"
                                    } cursor-pointer scrlldwn`}
                                    // onClick={() => handleScroll(nextSection.id)}
                                    onClick={() => {
                                        if (!nextSection) {
                                            handleScroll("section6");
                                            return;
                                        }

                                        handleScroll(nextSection.id);
                                    }}
                                >
                                    <AnimatePresence mode="wait">
                                        <motion.p
                                            key={activeSection === "section7" ? "up" : "down"}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.35 }}
                                            className={`${
                                                menuOpen ? "text-[#626262]" : "text-white"
                                            } font-[300] text-[13px] leading-[25px] pt-3 uppercase`}
                                        >
                                            {activeSection === "section7" ? "scroll up" : "scroll down"}
                                        </motion.p>
                                    </AnimatePresence>

                                    {/* <img src="/assets/images/round-arrow-down-menu.svg" alt="Arrow" width={87} height={87} /> */}
                                    <div
                                        className={`flex items-center relative group ${
                                            menuOpen ? "border rounded-full border-[#626262]" : ""
                                        }`}
                                    >
                                        <Image src="/assets/images/round-circle.svg" alt="Arrow" width={87} height={87} />
                                        <Image
                                            src="/assets/images/arrow-down.svg"
                                            alt="Arrow"
                                            width={35}
                                            height={35}
                                            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0
               group-hover:scale-110 transition-transform duration-300 ease-in-out
               animate-[scaleFade_0.8s_ease-out_forwards] [animation-delay:1.5s] ${
                   activeSection === "section7" ? "rotate-180 duration-500" : ""
               } `}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div
                className="block lg:hidden absolute bottom-0 z-20 right-1/2 translate-x-1/2"
                // onClick={() => handleScroll(nextSection.id)}
                onClick={() => {
                    if (!nextSection) {
                        handleScroll("section6");
                        return;
                    }

                    handleScroll(nextSection.id);
                }}
            >
                <div className="w-[35px] h-[35px] bg-primary flex items-center justify-center  mx-auto mb-7">
                    <div
                        className={`${
                            menuOpen ? "border-[#626262]" : "border-white"
                        } w-[22px] h-[22px] border rounded-full flex items-center justify-center `}
                    >
                        <img
                            src="../assets/images/home/downarrow.svg"
                            className={`${activeSection === "section7" ? "rotate-180 duration-500" : " duration-500"}`}
                        />
                    </div>
                </div>
            </div>
            <NavPageSearch isOpen={searchActive} closeMenu={() => setMenuOpen(false)} searchActive={searchActive}/>
            <NavPage isOpen={menuOpen} closeMenu={() => setMenuOpen(false)}/>
            <HomeMobileNavbar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} setMobileMenuOpenSearch={setMobileMenuOpenSearch}/>
            <HomeMobileNavbarSearch isOpen={mobileMenuOpenSearch} onClose={() => setMobileMenuOpenSearch(false)} />
        </>
    );
};

export default HeaderTw;
