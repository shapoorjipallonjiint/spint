"use client";
import Image from "next/image";
import H2Title from "../../../../../components/common/H2Title";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import { ourClients } from "./data";

const OurClients = () => {
  const isArabic = useIsPreferredLanguageArabic();
  const title = isArabic && ourClients.title_ar ? ourClients.title_ar : ourClients.title;

  // one half of the track = the logos repeated twice, so a half is always wider than the screen;
  // the track holds two identical halves and slides left by exactly one half (carouselLoop: 0 -> -50%) for a seamless loop
  const half = [...ourClients.logos, ...ourClients.logos];
  const track = [...half, ...half];

  return (
    <section className="section-spacing bg-white relative overflow-hidden">
      <div className="">
        <div className="container">
          <H2Title titleText={title} titleColor="black" marginClass="mb-50px" />
        </div>

        {/* ltr on purpose: the loop math assumes the track grows to the right, in Arabic too */}
        <div className="relative overflow-hidden" dir="ltr">
          {/* white fades over both ends of the slider (right one as in the design, left one mirrored) */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[60px] md:w-[150px] xl:w-[240px] 3xl:w-[302px] bg-[linear-gradient(270deg,rgba(255,255,255,0)_0%,#FFFFFF_59.49%)]" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-[60px] md:w-[150px] xl:w-[240px] 3xl:w-[302px] bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,#FFFFFF_59.49%)]" />
          <div className="flex w-max animate-[carouselLoop_60s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:animate-none">
            {track.map((client, i) => (
              <div
                key={`${client.name}-${i}`}
                // margin instead of gap so both halves are exactly the same width
                className="mr-[15px] shrink-0 w-[180px] md:w-[220px] 3xl:w-[273.85px] aspect-[273.85/142.26] border border-black/20 flex items-center justify-center"
                aria-hidden={i >= ourClients.logos.length ? true : undefined}
              >
                <Image
                  src={client.logo}
                  alt={i < ourClients.logos.length ? client.name : ""}
                  width={274}
                  height={60}
                  className="h-auto 3xl:h-[117px] w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurClients;
