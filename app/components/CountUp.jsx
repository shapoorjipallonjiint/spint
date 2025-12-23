import { useEffect, useState, useRef } from "react";

const CountUp = ({ value, duration = 2, trigger, delay = 1800 }) => {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);
  const started = useRef(false);

  useEffect(() => {
    if (!trigger || started.current) return;

    // 🔥 Clean value: remove +, commas, spaces, currency, anything non-digit
    const cleanedValue = Number(String(value).replace(/[^0-9]/g, ""));

    const timer = setTimeout(() => {
      started.current = true;

      const from = prev.current;
      const to = cleanedValue;
      const totalFrames = Math.round(duration * 60);
      let frame = 0;

      const animate = () => {
        frame++;

        const progress = frame / totalFrames;
        const eased = 1 - Math.pow(2, -10 * progress);

        setDisplay(Math.round(from + (to - from) * eased));

        if (frame < totalFrames) requestAnimationFrame(animate);
        else prev.current = to; // save final value
      };

      requestAnimationFrame(animate);
    }, delay); // 🔥 dynamic delay

    return () => clearTimeout(timer);
  }, [trigger, value, duration, delay]);

  return <span>{display}</span>;
};

export default CountUp;


// import { useEffect, useState, useRef } from "react";

// const CountUp = ({ value, duration = 2, trigger, delay = 1800 }) => {
//   const [display, setDisplay] = useState(0);
//   const runId = useRef(0);

//   useEffect(() => {
//     if (!trigger) return;

//     runId.current += 1;
//     const currentRun = runId.current;

//     // 🔥 Remove any non-digit characters and convert to number
//     const cleanedValue = Number(String(value).replace(/[^0-9]/g, ""));

//     const delayTimer = setTimeout(() => {
//       let frame = 0;
//       const from = 0;
//       const to = cleanedValue;
//       const totalFrames = Math.round(duration * 60);

//       const animate = () => {
//         if (currentRun !== runId.current) return;

//         frame++;

//         const progress = frame / totalFrames;
//         const eased = 1 - Math.pow(2, -10 * progress);

//         setDisplay(Math.round(from + (to - from) * eased));

//         if (frame < totalFrames) requestAnimationFrame(animate);
//       };

//       requestAnimationFrame(animate);
//     }, delay);

//     return () => clearTimeout(delayTimer);
//   }, [trigger, value, duration, delay]);

//   return <span>{display}</span>;
// };

// export default CountUp;
