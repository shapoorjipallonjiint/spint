"use client";
import Image from "next/image";
import LangLink from "@/lib/LangLink";
import Reveal from "@/app/components/common/Reveal";
import { moveUpV2 } from "../../../motionVarients";
import { UI_LABELS } from "@/app/components/AdminProject/statusData";

// start the reveal as soon as the card's top edge enters the screen (no 25% / -30px wait)
const REVEAL_AT_EDGE = { amount: 0, margin: "0px 0px" };

const ArrowIcon = ({ className = "", size = 35 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} viewBox="0 0 35 35" fill="none">
        <path d="M1.25 1.25H33.2484V33.2411" stroke="#30B6F9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M33.2498 1.25L1.4043 33.2411" stroke="#30B6F9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// One project in the /projects listing. variant "grid" = image card, "list" = row with details.
const ProjectCard = ({ item, variant = "grid", isArabic = false, revealDelay = 0 }) => {
    const title = item?.firstSection?.title;
    const href = `/projects/${item?.slug}`;

    if (variant === "list") {
        // sector is an array of sectors on the project
        const sectors = (item?.secondSection?.sector || []).map((s) => s?.name).filter(Boolean).join(", ");
        const bua = item?.secondSection?.items?.find((i) => i?.key?.includes("BUA"))?.value ?? "";

        return (
            <Reveal variants={moveUpV2} {...REVEAL_AT_EDGE} delay={revealDelay} className="border-b border-black/20 pb-[30px] mb-[30px] group">
                <LangLink href={href}>
                    <div className="flex flex-col lg:grid grid-cols-[240px_244px_448px_0px] xl:grid-cols-[240px_244px_448px_32px] 2xl:grid-cols-[274px_324px_458px_32px] 3xl:grid-cols-[274px_384px_658px_32px] justify-between gap-3 md:gap-8 lg:gap-4 3xl:gap-[69px] ">
                        <div className="w-full xl:w-full">
                            {item?.thumbnail ? (
                                <Image
                                    src={item.thumbnail}
                                    alt={item.thumbnailAlt || title}
                                    width={274}
                                    height={208}
                                    className="w-full h-[250px] md:h-[350px] lg:h-[208px] xl:min-w-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-[250px] md:h-[350px] lg:h-[208px] xl:min-w-full bg-primary flex items-center justify-center">
                                    <span className="text-white text-19 font-medium">Image</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="text20 text-29 leading-[1.344827586206897] font-light">{title}</h3>
                        </div>

                        <div>
                            <div className="bg-f5f5 p-5 xl:py-[18px] xl:px-[30px]">
                                <div className="flex gap-5 3xl:gap-[168px] justify-between border-b border-b-black/20 pb-[11px] mb-[7px] ">
                                    <p className="text-paragraph text-19 font-light leading-[1.4] md:leading-[2] ">
                                        {isArabic ? UI_LABELS.SECTOR.ar : UI_LABELS.SECTOR.en}: <br className="hidden lg:block 2xl:hidden" />
                                        {sectors}
                                    </p>
                                    <p className="text-paragraph text-19 font-light leading-[1.4] md:leading-[2] xl:pe-6">
                                        BUA (Sq.ft): <br className="hidden lg:block 2xl:hidden" />
                                        {bua}
                                    </p>
                                </div>
                                <p className="text-paragraph text-19 font-light leading-[2]">
                                    {isArabic ? UI_LABELS.ProjectCardDetails.Location.ar : UI_LABELS.ProjectCardDetails.Location.en}:{" "}
                                    {item?.secondSection?.location?.name}
                                </p>
                            </div>
                        </div>

                        <div className={`${isArabic ? "-scale-x-100" : ""} opacity-0 group-hover:opacity-100 transition-all duration-300 hidden lg:block`}>
                            <ArrowIcon size={32} />
                        </div>
                    </div>
                </LangLink>
            </Reveal>
        );
    }

    return (
        <Reveal variants={moveUpV2} {...REVEAL_AT_EDGE} delay={revealDelay} className="group">
            <LangLink href={href} className="block">
                <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] xl:aspect-[520/500] overflow-hidden bg-primary">
                    {/* Image: slow zoom on hover */}
                    {item?.thumbnail ? (
                        <Image
                            src={item.thumbnail}
                            alt={item.thumbnailAlt || title}
                            fill
                            sizes="(min-width: 1280px) 520px, (min-width: 768px) 50vw, 100vw"
                            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-primary opacity-90 flex items-center justify-center">
                            <span className="text-white text-29 font-medium">395×250</span>
                        </div>
                    )}

                    {/* DEFAULT overlay: linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.9) 100%) — fades out on hover */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-100
                        bg-[linear-gradient(180deg,rgba(0,0,0,0)_50%,rgba(0,0,0,0.9)_100%)]
                        transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                        group-hover:opacity-0 group-focus-visible:opacity-0"
                    />

                    {/* HOVER overlay: linear-gradient(180deg, rgba(48,182,249,0) 50%, rgba(48,182,249,0.9) 100%) — fades in on hover */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-0 translate-y-4
                        bg-[linear-gradient(180deg,rgba(48,182,249,0)_50%,rgba(48,182,249,0.9)_100%)]
                        transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                        group-hover:opacity-100 group-hover:translate-y-0
                        group-focus-visible:opacity-100 group-focus-visible:translate-y-0"
                    />

                    {/* Arrow badge (top-right, 80x80, 40px inset on desktop) */}
                    <div
                        className={`absolute top-4 end-4 md:top-6 md:end-6 xl:top-10 xl:end-10
                        w-[50px] h-[50px] xl:w-[80px] xl:h-[80px] flex items-center justify-center bg-primary
                        opacity-0 -translate-y-3 [clip-path:inset(0_0_100%_0)]
                        transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                        group-hover:opacity-100 group-hover:translate-y-0 group-hover:[clip-path:inset(0_0_0_0)]
                        group-focus-visible:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:[clip-path:inset(0_0_0_0)]
                        ${isArabic ? "-scale-x-100" : ""}`}
                    >
                        <ArrowIcon className="-translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700 delay-100 ease-[cubic-bezier(0.22,1,0.36,1)] w-6 h-6 3xl:w-[34px] 3xl:h-[34px]" />
                    </div>

                    {/* Title only (bottom-left, 40px inset) */}
                    <h2 className="absolute inset-x-0 bottom-0 p-5 md:p-6 xl:p-10 text-white truncate text-[20px] lg:text-24 2xl:text-29 leading-[1.344827586206897] font-light transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1">
                        {title}
                    </h2>
                </div>
            </LangLink>
        </Reveal>
    );
};

export default ProjectCard;
