// import { useEffect, useRef, useState } from "react";

// const InsideCounter = ({ value, duration = 2, delay = 0, suffix = "" }) => {
//   const [display, setDisplay] = useState(0);
//   const ref = useRef(null);
//   const hasRun = useRef(false);

//   useEffect(() => {
//     const element = ref.current;
//     if (!element) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && !hasRun.current) {
//           hasRun.current = true;

//           const to = Number(String(value).replace(/[^0-9]/g, ""));
//           const from = 0;
//           const totalFrames = Math.round(duration * 60);
//           let frame = 0;

//           const startAnimation = () => {
//             const animate = () => {
//               frame++;

//               const progress = frame / totalFrames;
//               const eased = 1 - Math.pow(2, -10 * progress);

//               setDisplay(Math.round(from + (to - from) * eased));

//               if (frame < totalFrames) requestAnimationFrame(animate);
//             };

//             requestAnimationFrame(animate);
//           };

//           setTimeout(startAnimation, delay);
//           observer.disconnect();
//         }
//       },
//       { threshold: 0.3 }
//     );

//     observer.observe(element);
//     return () => observer.disconnect();
//   }, [value, duration, delay]);

//   return (
//     <span ref={ref}>
//       {display.toLocaleString()}
//       {suffix}
//     </span>
//   );
// };

// export default InsideCounter;

import { useEffect, useRef, useState } from "react";

const InsideCounter = ({ value, duration = 2, delay = 0, suffix = "" }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasTriggered.current) return;

        hasTriggered.current = true;
        observer.unobserve(element);

        const target = Number(String(value).replace(/[^0-9]/g, ""));
        const totalFrames = Math.round(duration * 60);
        let frame = 0;

        const animate = () => {
          frame++;
          const progress = frame / totalFrames;
          const eased = 1 - Math.pow(2, -10 * progress);
        
          if (frame < totalFrames) {
            setDisplay(Math.round(target * eased));
            requestAnimationFrame(animate);
          } else {
            setDisplay(target); // ✅ force final value
          }
        };
        

        setTimeout(() => requestAnimationFrame(animate), delay);
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [value, duration, delay]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
};

export default InsideCounter;

