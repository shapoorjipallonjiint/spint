import type { Metadata } from "next";
import { dmSans } from "@/app/fonts";
import "@/app/globals.css";
import ScrollToTop from "@/app/components/common/ScrollToTop";
import { SearchProvider } from "@/contexts/searchContext";
import { ServiceVisibilityProvider } from "@/contexts/serviceVisibility";
import { fetchServiceVisibility } from "@/lib/serviceVisibility";
import { HeaderContentProvider } from "@/contexts/headerContent";
import { fetchHeader } from "@/lib/header";
import { ToNavigateCountryProvider } from "@/contexts/toNavigateCountry";



export const metadata: Metadata = {
  title: "Shapoorji Pallonji",
  description: "",
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // services hidden in admin (Services > Main) are removed from menus, footers, project tabs, etc. and the rest follow the admin order
  // header menu and Employee Login button managed in admin (Header)
  const [visibility, header] = await Promise.all([fetchServiceVisibility(), fetchHeader()]);



  return (
    <div>
      <div>
        <div lang="en">
          <div className={`${dmSans.variable} font-sans antialiased`}>
            {/* <SmoothScroll/> */}
            <ServiceVisibilityProvider hiddenSlugs={visibility.hiddenServices} hiddenIds={visibility.hiddenServiceIds} serviceOrder={visibility.serviceOrder} serviceIdSlugs={visibility.serviceIdSlugs}>
            <HeaderContentProvider data={header}>
            <SearchProvider>
              <ToNavigateCountryProvider>
                <ScrollToTop />
                {children}
              </ToNavigateCountryProvider>
            </SearchProvider>
            </HeaderContentProvider>
            </ServiceVisibilityProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
