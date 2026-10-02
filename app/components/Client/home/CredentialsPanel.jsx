"use client";

import { toCubeColumns } from "@/lib/credentialsCubes";


const frontBg = "linear-gradient(360deg, #1E45A2 0%, #30B6F9 100%)";
const topBg = "linear-gradient(180deg, #97DCFF 0%, #30B6F9 100%)";
const sideBg = "linear-gradient(180deg, #97DCFF 0%, #30B6F9 100%)";
const innerStroke = "inset 0 0 0 0.77px rgba(255, 255, 255, 0.4)";

const topFaceShift = "var(--top-shift)";

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
            transform: "var(--top-skew)",
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
            transform: "var(--side-skew)",
            background: sideBg,
            boxShadow: innerStroke,
          }}
        />
      )}
      <div
        className="relative h-full flex flex-col items-center justify-center text-center text-white px-[5px] lg:px-[6%] rtl:-scale-x-100"
        style={{ background: frontBg, boxShadow: innerStroke }}
      >
        <p
          className="font-semibold text-[13px] lg:text-16 leading-[12px] lg:leading-[1.34] mb-px lg:mb-[3px]"
        >
          {value}
        </p>
        <p
          className="font-light text-[8px] lg:text-[11px] leading-[9px] lg:leading-[1.39]"
        >
          {label}
        </p>
      </div>
    </div>
  </div>
);

const CredentialsPanel = ({ cubesRef, data }) => {
  const columns = toCubeColumns(data?.cubes);
  return (
  <div className="relative lg:h-full flex flex-col bg-f5f5 pt-[92px] px-4 lg:pt-[12dvh] lg:pb-[8dvh] 3xl:pb-[87px] lg:ps-[calc(4vw+125px+32px)] xl:ps-[calc(5vw+125px+40px)] 2xl:ps-[calc(5vw+125px+50px)] 3xl:ps-[calc(7.814vw+133px+50px)] lg:pe-8 xl:pe-10 2xl:pe-[50px]">
    <h2 data-cred-intro className="text-primary font-light leading-[36px] lg:leading-[1.0833333] text-[26px] lg:text-34 xl:text-48 3xl:text-60 mb-[10px] lg:mb-3 xl:mb-4">
      {data?.title}
    </h2>
    <p data-cred-intro className="font-light text-[13px] lg:text-16 xl:text-18 3xl:text-19 leading-[1.5]">
      {data?.description}
    </p>
    <hr data-cred-intro className="hidden lg:block border-black/20 mt-3 lg:mt-5 xl:mt-8 3xl:mt-[30px]" />

    <span
      data-cred-glow="0.4"
      className="hidden lg:block absolute bottom-0 end-0 w-full aspect-[1021/228] opacity-40 pointer-events-none rtl:-scale-x-100"
      style={{
        background:
          "linear-gradient(180deg, rgba(48, 182, 249, 0) 0%, #30B6F9 100%)",
        clipPath: "polygon(34.4% 0, 100% 0, 100% 100%, 0 100%)",
      }}
    />

    <div
      className="cred-cubes @container mt-[calc(25px_+_min(122px,_(100vw_-_35.2px)_/_5.2401)_*_0.2667)] lg:mt-auto relative [container-type:inline-size] [--cubes-h:9999px] lg:[--cubes-h:calc(80dvh-180px)]"
    >
      {/* desktop only: blurred shadow under the cubes: 763x39 at 3xl (74.7% of the column), pinned to the column's
                end edge (pulled out through the panel's end padding) and overlapping the cube bottoms by 10px */}
      {/* blur sits on the wrapper: clip-path is applied after filter, so on one element it would cut the blur off */}
      <span
        data-cred-glow="1"
        className="hidden lg:block absolute top-[calc(100%-10px)] -end-4 lg:-end-8 xl:-end-10 2xl:-end-[50px] w-[83%] lg:w-[374px] xl:w-[448px] 2xl:w-[calc((5vw+754px)*0.747)] 3xl:w-[calc((7.814vw+877px)*0.747)] min-[1900px]:w-[calc((100vw-900px)*0.747)] aspect-[763/39] pointer-events-none rtl:-scale-x-100"
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
      {/* mobile shadow under the cubes (Figma 358x13 at 390px = full width, half of it overlapping the cube bottoms) */}
      <span
        data-cred-glow="1"
        className="lg:hidden absolute start-0 top-[calc(100%-6.5px)] w-full h-[13px] pointer-events-none"
        style={{ background: "#00000059", backdropFilter: "blur(9.5px)", WebkitBackdropFilter: "blur(9.5px)", filter: "blur(9.5px)" }} // filter softens the edges like the Figma layer blur
      />
      {/* the size formula reserves room for the last column's side face (--dx), so the end padding stays clear */}
      <div
        ref={cubesRef}
        dir="ltr"
        // Arabic: the whole staircase is mirrored (tallest column on the right, faces leaning left); the cube texts are
        // mirrored back below so they stay readable. (The geometry is built left-to-right, hence dir="ltr" + mirror.)
        className="relative flex items-end rtl:-scale-x-100"
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
                    key={i}
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

    {/* mobile: divider under the cubes (desktop keeps it under the description) */}
    <hr data-cred-intro className="lg:hidden relative border-black/20 mt-[35px]" />
  </div>
  );
};

export default CredentialsPanel;