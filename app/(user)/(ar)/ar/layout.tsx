import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "@/app/globals.css";
import ScrollToTop from "@/app/components/common/ScrollToTop";
import { SearchProvider } from "@/contexts/searchContext";


const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900', '1000'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
})


export const metadata: Metadata = {
  title: "Shapoorji Pallonji",
  description: "",
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {


  return (
    <html lang="ar" dir="rtl">
      <body>
    <div>
     <div className={`${dmSans.variable} font-sans antialiased`}>
      {/* <SmoothScroll/> */}
      <SearchProvider>
     <ScrollToTop />
        {children}
     </SearchProvider>
      </div>
    </div>
    </body>
    </html>
  );
}
