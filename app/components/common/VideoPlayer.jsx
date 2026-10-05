import { useRef, useState } from "react";
import { assets } from "../../assets";
import Image from 'next/image'
// fullWidth: fill the parent's width (height follows the original 1234 x 523 shape from xl up)
export default function VideoPlayer({ src, poster, fullWidth = false }) {
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
      className={`relative mx-auto cursor-pointer group ${
        fullWidth
          ? "w-full h-[200px] md:h-[300px] xl:h-auto xl:aspect-[1234/523]"
          : "w-full xl:w-[1000px] 3xl:xl:w-[1234px] xl:max-w-[1238px] h-[200px] md:h-[300px] xl:h-[400px] 2xl:h-[450px] 3xl:h-[523px]"
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={togglePlay}
    >
      <video ref={videoRef} src={src} poster={poster} className={`w-full object-cover ${fullWidth ? "h-full" : "h-[200px] md:h-[300px] xl:h-[400px] 2xl:h-[450px] 3xl:h-[523px]"}`} />
      {
        !isPlaying && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/20"></div>
        )
      }
      {/* Play / Pause Overlay Icon */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none
        ${(isHovering || !isPlaying) ? "opacity-100" : "opacity-0"}`}
      >
        {!isPlaying ? (
          <Image src={assets.vdoPlayIcon} className="w-10 h-10 xl:w-[75px] xl:h-[75px]" alt="" />
        ) : (
          <Image src={assets.vdoPauseIcon} className="w-10 h-10 xl:w-[75px] xl:h-[75px]" alt="" />
        )}
      </div>
    </div>
  );
}
