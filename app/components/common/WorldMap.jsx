"use client";
// Interactive world map - same markup, styles and behaviour as the homepage map (home/SlideScrollThree.jsx, slide 6):
// SP Group / SP International dots, city pill, "Projects" bubble with count-up + pulse ring (desktop),
// bubble row under the map (mobile), click a clickable city -> /projects filtered to that country, click outside -> close.
// Cities come from the home page CMS (sixthSection.cities); projects decide which cities are clickable.
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useInView } from "framer-motion";
import CountUp from "../CountUp.jsx";
import { mapBackendCitiesToMapCities } from "@/lib/mapDataHelper";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { useApplyLang } from "@/lib/applyLang";
import { useToNavigateCountryContext } from "@/contexts/toNavigateCountry";

const WorldMap = ({ cities = [], projectsData }) => {
    const isArabic = useIsPreferredLanguageArabic();
    const tCities = useApplyLang(cities);
    const tProjectsData = useApplyLang(projectsData || {});
    const router = useRouter();
    const { setToNavigateCountry } = useToNavigateCountryContext();

    const [activeDot, setActiveDot] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [adjustY, setAdjustY] = useState(0);

    const bubbleRef = useRef(null);
    const containersRef = useRef(null);
    const outsideRef = useRef(null);
    const sectionRef = useRef(null);
    // homepage triggers the count-up when its map slide is visible; here: when the map is on screen
    const inView = useInView(sectionRef, { amount: 0.2 });

    // cities that have at least one project (same rule as the homepage)
    const projectCities = useMemo(() => {
        if (!tProjectsData?.projects) return new Set();
        return new Set(tProjectsData.projects.map((p) => p?.secondSection?.location?.name).filter(Boolean));
    }, [tProjectsData]);

    const mapCities = useMemo(() => mapBackendCitiesToMapCities(tCities || [], projectCities), [tCities, projectCities]);

    // keep the desktop bubble inside the map area
    useEffect(() => {
        if (window.innerWidth >= 1024) {
            if (!activeDot || !bubbleRef.current || !containersRef.current) return;

            const bubble = bubbleRef.current.getBoundingClientRect();
            const container = containersRef.current.getBoundingClientRect();

            let offsetY = 0;
            if (bubble.top < container.top) {
                offsetY = container.top - bubble.top; // push down
            } else if (bubble.bottom > container.bottom) {
                offsetY = container.bottom - bubble.bottom; // push up
            }
            setAdjustY(offsetY);
        }
    }, [activeDot]);

    // click outside the active bubble closes it
    useEffect(() => {
        function handleClickOutside(event) {
            if (outsideRef.current && !outsideRef.current.contains(event.target)) {
                setActiveDot(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const goToProjects = (city) => {
        if (!city?.isClickable) return;
        router.push(isArabic ? "/ar/projects" : "/projects");
    };

    return (
        <div ref={sectionRef} dir="ltr" className="relative">
            {/* legend */}
            <div className="relative">
                <div className="absolute container right-0 lg:right-10 3xl:right-36 bottom-[-5px] sm:bottom-auto">
                    <div className="flex justify-end items-center">
                        <div className="flex items-center gap-[5px] md:gap-2 me-3">
                            <div className="w-[10px] h-[10px] lg:w-[15px] lg:h-[15px] pointer-events-auto rounded-full transition-all duration-500 itmbsx backdrop-blur-[4px] bg-[#30B6F9] border border-[#97DCFF] scale-85"></div>
                            <p className="text-paragraph font-light text-[11px] lg:text-[16px]">SP Group</p>
                        </div>
                        <div className="flex items-center gap-[5px] md:gap-2">
                            <div className="w-[10px] h-[10px] lg:w-[15px] lg:h-[15px] pointer-events-auto rounded-full transition-all duration-500 itmbsx backdrop-blur-[4px] bg-primary border border-white scale-85"></div>
                            <p className="text-paragraph font-light text-[11px] lg:text-[16px]">SP International</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="[position:initial] lg:relative overflow-x-scroll lg:overflow-x-visible scrollbar-hide responsive-map-position">
                    <div className="relative lg:[position:initial] overflow-hide" ref={containersRef}>
                        <Image
                            src="/assets/images/world_map.png"
                            alt="World map"
                            width={1158}
                            height={679}
                            className="object-cover img-f select-none min-w-[733px] w-[733px] h-[350px] lg:h-full lg:min-w-[1156px] lg:w-[1156px] ml-[20px] lg:ml-0"
                        />
                        <div className="absolute top-[-121px] lg:top-0 left-[-69px] lg:left-0 min-w-[733px] w-[733px] h-[436px] lg:h-full lg:w-[1156px] overflow-hidden lg:overflow-visible">
                            {/* Dots */}
                            {mapCities.map((city) => (
                                <div
                                    key={city.id}
                                    className={`absolute transition-all duration-300 flex items-center justify-center w-[480px] h-[480px] pointer-events-none ${city.hasPoint ? "map-point" : ""} ${activeDot === city.id ? "z-[999]" : "z-[1]"}`}
                                    // picked points: exact spot on the image via .map-point (globals.css); older cities keep their hand-typed left/top
                                    style={
                                        city.hasPoint
                                            ? { "--map-x": city.x, "--map-y": city.y }
                                            : { left: `calc(${city.left} - 4.8%)`, top: city.top }
                                    }
                                >
                                    <div
                                        onClick={() => {
                                            setActiveDot(city.id);
                                            if (city.groupId === "sp-international") {
                                                setSelectedCity({
                                                    id: city.id,
                                                    name: city.name,
                                                    pjtcompleted: city.pjtcompleted,
                                                    dedicatedemployees: city.dedicatedemployees,
                                                    isClickable: city.isClickable,
                                                });
                                            }
                                        }}
                                        className={`w-[8px] h-[8px] lg:w-[15px] lg:h-[15px] group cursor-pointer relative z-20 pointer-events-auto rounded-full transition-all duration-500 itmbsx backdrop-blur-[4px] ${city.groupId === "sp-group"
                                            ? activeDot === city.id
                                                ? "bg-primary/40 shadow-[0_0_35px_rgba(239,68,68,0.9),0_0_50px_rgba(239,68,68,0.6)] border border-[#97DCFF] scale-full"
                                                : "bg-[#30B6F9] border border-[#97DCFF] scale-85"
                                            : activeDot === city.id
                                                ? "bg-primary/40 shadow-[0_0_35px_#30F955,0_0_50px_rgba(0,255,136,0.6)] border border-[#97DCFF] scale-full"
                                                : "bg-primary border border-white scale-85"
                                            }`}
                                    ></div>

                                    <div className="relative">
                                        <div className="absolute -left-8 top-1 flex flex-col items-center gap-[7px] pointer-events-none">
                                            {city.groupId === "sp-group" && activeDot === city.id && (
                                                <span className="text-13 font-semibold uppercase text-primary">SP Group</span>
                                            )}
                                            <span
                                                className={`border border-[#30F95533] min-w-[125px] lg:min-w-[150px] text-center backdrop-blur-[10px] uppercase bg-[#0015FF99] text-white text-[14px] font-bold px-2 py-[2px] rounded-full transition-all duration-500 ${activeDot === city.id ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
                                            >
                                                {city.name}
                                            </span>
                                        </div>
                                    </div>

                                    {city.groupId === "sp-international" && (
                                        <div
                                            className="hidden lg:block translate-x-[60%] -left-1/2 top-0 rounded-full transition-all duration-500 absolute w-full h-full pointer-events-none"
                                            ref={activeDot === city.id ? bubbleRef : undefined}
                                            style={{ transform: `translateY(${adjustY}px)` }}
                                        >
                                            <div ref={activeDot === city.id ? outsideRef : null} className="transition-all duration-500 outside pointer-events-none">
                                                <div>
                                                    <div
                                                        className={`bubble bg-[#02aeddc2] transition-all duration-500 delay-100 border border-[#00C8FF26] backdrop-blur-sm text-white text-center p-3 rounded-full shadow-[0_0_25px_rgba(59,130,246,0.6)] absolute left-[0%] top-[28%] ${city.isClickable ? "cursor-pointer" : "cursor-default"} ${activeDot === city.id ? "opacity-100 scale-full float-bubble1 pointer-events-auto" : "opacity-0 scale-80 pointer-events-none"}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            goToProjects(city);
                                                            setToNavigateCountry(city.name);
                                                        }}
                                                    >
                                                        <p className="text-[24px] font-normal leading-tight">
                                                            <CountUp value={city.pjtcompleted} trigger={inView && activeDot === city.id} delay={200} />
                                                        </p>
                                                        <p className="text-[14px] font-semibold">
                                                            Project{city.pjtcompleted == 1 ? "" : "s"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Ring */}
                                                <div
                                                    className={`absolute -left-[50px] w-full h-full rounded-full z-[-1] scale-pulse ${activeDot === city.id ? "opacity-100 scale-full" : "opacity-0"} transition-all duration-500 delay-300`}
                                                    style={{
                                                        backgroundImage: "url(/assets/images/ring3.svg)",
                                                        backgroundSize: "cover",
                                                        backgroundPosition: "center",
                                                        backgroundRepeat: "no-repeat",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* mobile: bubble row under the map */}
            {selectedCity ? (
                <div className="bubble-margin lg:hidden px-5 top-0 pt-[5px] transition-all duration-500 w-full h-full overflow-x-auto scrollbar-hide">
                    <div className="transition-all duration-500 outside">
                        <div className="flex lg:block justify-center gap-2">
                            <div
                                onTouchEnd={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    goToProjects(selectedCity);
                                    setToNavigateCountry(selectedCity.name);
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToProjects(selectedCity);
                                    setToNavigateCountry(selectedCity.name);
                                }}
                                className={`me-2 bubble cursor-pointer transition-all duration-500 delay-100 backdrop-blur-sm bg-[#02aeddc2] border border-[#00C8FF26] text-white text-center p-3 rounded-full ${activeDot === selectedCity.id ? "opacity-100 scale-100 float-bubble1" : "opacity-0 scale-80"}`}
                            >
                                <p className="text-[22px] font-[200] leading-tight">{selectedCity.pjtcompleted}</p>
                                <p className="text-[14px] font-[200]">Projects</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default WorldMap;
