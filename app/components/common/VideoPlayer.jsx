"use client"

import { useRef, useState } from "react";
import { assets } from "../../assets";
import Image from "next/image";

export default function VideoPlayer({ src, vdoAlt, poster, posterAlt }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div
      className="relative w-full xl:w-[1000px] 3xl:xl:w-[1180px] xl:max-w-[1180px] mx-auto cursor-pointer group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={togglePlay}
      aria-label={vdoAlt || "Video player"}
    >
      <video 
        ref={videoRef} 
        src={src} 
        poster={poster} 
        aria-label={vdoAlt}
        className="w-full h-[200px] md:h-[300px] xl:h-[400px] 2xl:h-[450px] 3xl:h-[523px] object-cover" 
      />
      {
        !isPlaying && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/20" aria-hidden="true"></div>
        )
      }
      {/* Play / Pause Overlay Icon */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none
        ${(isHovering || !isPlaying) ? "opacity-100" : "opacity-0"}`}
        aria-hidden="true"
      >
        {!isPlaying ? (
          <Image src={assets.vdoPlayIcon} className="w-10 h-10 xl:w-[75px] xl:h-[75px]" alt={posterAlt || "Play video"} width={75} height={75} />
        ) : (
          <Image src={assets.vdoPauseIcon} className="w-10 h-10 xl:w-[75px] xl:h-[75px]" alt="Pause video" width={75} height={75} />
        )}
      </div>
    </div>
  );
}