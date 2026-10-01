import localFont from "next/font/local";

// DM Sans variable font (wght 100-1000 + opsz 9-40). With the opsz axis the browser picks the optical size
// from the font size (font-optical-sizing: auto), so large headings get the tighter display letterforms like in Figma.
export const dmSans = localFont({
  src: "../public/fonts/dm-sans.ttf",
  weight: "100 1000",
  style: "normal",
  variable: "--font-dm-sans",
  display: "swap",
});
