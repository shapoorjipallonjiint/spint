"use client";

const columns = [
  [
    { value: "56 Years", key: "of Excellence" },
    { value: "1,500+", key: "PMV Assets" },
    { value: "11,000+", key: "Villas" },
    { value: "100+", key: "Iconic Landmarks" },
  ],
  [
    { value: "2,500+", key: "Hospital Beds" },
    { value: "6+ million", key: "sq. ft. of Theme Parks" },
    { value: "20+", key: "Nationalities" },
  ],
  [
    { value: "200+ million", key: "sq. ft. of Structures" },
    { value: "25,000+", key: "Strong Workforce" },
  ],
  [{ value: "150+", key: "Clients" }],
  [{ value: "Presence in", key: "18 Countries" }],
];

// Cube size at 3xl is 122 (front width) x 115 (front height), with a 28px-wide side face and a 37px-tall top face.
// Everything is derived from --w so the whole staircase scales together: it's capped at 122px,
// by the available width (5 fronts + 4 gaps + the last column's side face, so nothing spills into the end padding)
// and by the height left for the staircase (--cubes-h), shared by 4 fronts + 1 top depth (4 x 0.9426 + 0.3 = ~4.12 widths).
// --cubes-h: desktop = 100dvh minus the panel's 20dvh vertical padding and ~180px of title/description/divider.
// On mobile the width alone sets --w (so the text has room) and instead the fronts get shorter when needed:
// --h-max = (height of the cubes area - top face depth) / 4 rows (the area is a size container there, see below).
// --gap: space between neighbouring cubes (up/down and left/right).
// --diag: space along the incline where a column's side face meets the next column's top face.
const sizeVars = {
  "--gap": "1.52px",
  "--diag": "1.92px",
  "--w":
    "min(122px, calc((100cqw - 4 * var(--gap)) / 5.2295), calc(var(--cubes-h) / 4.12))", // 5 fronts + 0.2295 side
  "--h": "min(calc(var(--w) * 0.9426), var(--h-max))", // 115 / 122
  "--dx": "calc(var(--w) * 0.2295)", // side face width / top face lean: 28 / 122
  "--dy": "calc(var(--w) * 0.3)", // top face height / side face rise: 37 / 122
};

// skew angles that make the top face lean --dx over its --dy height, and the side face rise --dy over its --dx width
const topSkew = "skewX(-37.42deg)"; // atan(0.2295 / 0.3)
const sideSkew = "skewY(-52.58deg)"; // atan(0.3 / 0.2295)

const frontBg = "linear-gradient(0deg, #1E45A2 0%, #30B6F9 100%)";
const topBg = "linear-gradient(90deg, #97DCFF 0%, #30B6F9 100%)";
const sideBg = "linear-gradient(180deg, #97DCFF 0%, #30B6F9 100%)";
// Figma "inside" stroke: inset shadow draws within the face and doesn't add to its size
const innerStroke = "inset 0 0 0 0.77px rgba(255, 255, 255, 0.4)";

// The column gap and row gap separate a side face's lower edge from the next column's top face.
// Nudging that top face left by this much makes the perpendicular distance between the two
// parallel inclined edges exactly --diag (solved for the dx:dy = 0.2295:0.3 slope: gap * (1 + dx/dy) - diag * hypot(dx, dy)/dy).
const topFaceShift = "calc(var(--gap) * 1.765 - var(--diag) * 1.2591)";

// Outer div is animated by the slide's entry timeline (targets [data-cube-row]); the inner div
// handles the hover lift, so the two transforms never fight each other.
const Cube = ({ value, label, row, showTop, showSide, meetsSideFace }) => (
  <div
    data-cube-row={row}
    className="relative"
    style={{ width: "var(--w)", height: "var(--h)" }}
  >
    <div className="relative h-full transition-transform duration-300 ease-out hover:-translate-y-1.5">
      {showTop && (
        // top face: skewed so its back edge shifts right by --dx
        <span
          className="absolute bottom-full origin-bottom-left"
          style={{
            height: "var(--dy)",
            transform: topSkew,
            left: meetsSideFace ? `calc(-1 * ${topFaceShift})` : 0,
            width: meetsSideFace ? `calc(100% + ${topFaceShift})` : "100%",
            background: topBg,
            boxShadow: innerStroke,
          }}
        />
      )}
      {showSide && (
        // side face: skewed so its far edge rises by --dy
        <span
          className="absolute top-0 left-full h-full origin-top-left"
          style={{
            width: "var(--dx)",
            transform: sideSkew,
            background: sideBg,
            boxShadow: innerStroke,
          }}
        />
      )}
      <div
        className="relative h-full flex flex-col items-center justify-center text-center text-white px-[3%] lg:px-[6%]"
        style={{ background: frontBg, boxShadow: innerStroke }}
      >
        <p
          className="whitespace-nowrap lg:whitespace-normal font-semibold text-[length:clamp(9px,calc(var(--w)*0.131),16px)] lg:text-16 leading-[1.25] lg:leading-[1.34] mb-px lg:mb-[3px]"
        >
          {value}
        </p>
        <p
          className="font-light text-[length:clamp(7px,calc(var(--w)*0.09),11px)] lg:text-[11px] leading-[1.3] lg:leading-[1.39]"
        >
          {label}
        </p>
      </div>
    </div>
  </div>
);

const CredentialsPanel = ({ cubesRef }) => (
  <div className="relative h-full flex flex-col bg-f5f5 pt-[92px] pb-5 px-5 lg:pt-[12dvh] lg:pb-[8dvh] 3xl:pb-[87px] lg:ps-[calc(4vw+125px+32px)] xl:ps-[calc(5vw+125px+40px)] 2xl:ps-[calc(5vw+125px+50px)] 3xl:ps-[calc(7.814vw+133px+50px)] lg:pe-8 xl:pe-10 2xl:pe-[50px]">
    <h2 data-cred-intro className="text-primary font-light leading-[1.0833333] text-[26px] lg:text-34 xl:text-48 3xl:text-60 mb-2 lg:mb-3 xl:mb-4">
      Our Credentials
    </h2>
    <p data-cred-intro className="font-light text-[13px] lg:text-16 xl:text-18 3xl:text-19 leading-[1.5]">
      300 million sq. ft. delivered with proven expertise, quality, and safety.
    </p>
    <hr data-cred-intro className="border-black/20 mt-3 lg:mt-5 xl:mt-8 3xl:mt-[30px]" />

    {/* background shape behind the cubes: 1021x228 at 3xl (full column width), top edge starts 34.4% in */}
    {/* data-cred-glow = resting opacity; the slide's entry timeline fades both glows in after the first cube row */}
    <span
      data-cred-glow="0.4"
      className="absolute bottom-0 end-0 w-full aspect-[1021/228] opacity-40 pointer-events-none rtl:-scale-x-100"
      style={{
        background:
          "linear-gradient(180deg, rgba(48, 182, 249, 0) 0%, #30B6F9 100%)",
        clipPath: "polygon(34.4% 0, 100% 0, 100% 100%, 0 100%)",
      }}
    />

    {/* container so the cube size can follow the available width (cqw). On mobile it fills the space left under the
        text and is a size container, so the staircase also fits its height (cqh); on desktop it keeps the dvh formula */}
    <div
      className="@container mt-4 lg:mt-auto relative flex-1 min-h-0 flex flex-col justify-end lg:flex-none lg:block [container-type:size] lg:[container-type:inline-size] [--cubes-h:9999px] lg:[--cubes-h:calc(80dvh-180px)] [--h-max:calc((100cqh-var(--w)*0.3)/4-var(--gap))] lg:[--h-max:9999px]"
      style={sizeVars}
    >
      {/* blurred shadow under the cubes: 763x39 at 3xl (74.7% of the column), pinned to the column's
                end edge (pulled out through the panel's end padding) and overlapping the cube bottoms by 10px */}
      {/* blur sits on the wrapper: clip-path is applied after filter, so on one element it would cut the blur off */}
      <span
        data-cred-glow="1"
        className="absolute top-[calc(100%-10px)] -end-5 lg:-end-8 xl:-end-10 2xl:-end-[50px] w-[83%] lg:w-[374px] xl:w-[448px] 2xl:w-[calc((5vw+754px)*0.747)] 3xl:w-[calc((7.814vw+877px)*0.747)] min-[1900px]:w-[calc((100vw-900px)*0.747)] aspect-[763/39] pointer-events-none rtl:-scale-x-100"
        style={{ filter: "blur(30px)" }} // Figma layer blur 60.1
      >
        <span
          className="absolute inset-0"
          style={{
            background: "#2259B2",
            clipPath: "polygon(9.4% 0, 100% 0, 100% 100%, 0 100%)",
          }}
        />
      </span>
      {/* the size formula reserves room for the last column's side face (--dx), so the end padding stays clear */}
      <div
        ref={cubesRef}
        dir="ltr"
        className="relative flex items-end"
        style={{ gap: "var(--gap)" }}
      >
        {columns.map((cubes, colIndex) => {
          const nextHeight = columns[colIndex + 1]?.length ?? 0;
          return (
            <div
              key={colIndex}
              className="flex flex-col"
              style={{ gap: "var(--gap)" }}
            >
              {cubes.map((cube, i) => {
                const rowFromBottom = cubes.length - 1 - i;
                return (
                  <Cube
                    key={cube.value}
                    value={cube.value}
                    label={cube.key}
                    row={rowFromBottom}
                    showTop={i === 0}
                    // only draw side faces that stick out above the next column,
                    // so the gaps between cubes stay clean (panel background)
                    showSide={rowFromBottom >= nextHeight}
                    meetsSideFace={
                      (columns[colIndex - 1]?.length ?? 0) > cubes.length
                    }
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export default CredentialsPanel;
