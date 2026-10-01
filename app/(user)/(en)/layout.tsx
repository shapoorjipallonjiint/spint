import type { Metadata } from "next";
import { dmSans } from "@/app/fonts";
import "@/app/globals.css";
import ScrollToTop from "@/app/components/common/ScrollToTop";
import { SearchProvider } from "@/contexts/searchContext";
import { ToNavigateCountryProvider } from "@/contexts/toNavigateCountry";



export const metadata: Metadata = {
  title: "Shapoorji Pallonji",
  description: "",
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {


  return (
    <div>
      <div>
        <div lang="en">
          <div className={`${dmSans.variable} font-sans antialiased`}>
            {/* <SmoothScroll/> */}
            <SearchProvider>
              <ToNavigateCountryProvider>
                <ScrollToTop />
                {children}
              </ToNavigateCountryProvider>
            </SearchProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
