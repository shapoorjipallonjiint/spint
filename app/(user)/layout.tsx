import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "../globals.css";
import ScrollToTop from "../components/common/ScrollToTop";
import SmoothScroll from "../components/common/SmoothScroll";


const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});


export const metadata: Metadata = {
  title: "Shapoorji Pallonji",
  description: "",
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {


  return (
    <html lang="en">
     <body className={`${dmSans.variable} font-sans antialiased`}>
      <SmoothScroll/>
     <ScrollToTop />
        {children}
      </body>
    </html>
  );
}
