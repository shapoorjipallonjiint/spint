"use client";

import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import Banner from "./sections/Banner";
import ProjectLists from "./sections/ProjectLists";
const Index = ({ data, sectorData, countryData, serviceData }) => {
    const isArabic = useIsPreferredLanguageArabic();

    return (
        <>
            {/* <header>
        <MainNavbar />
      </header>  */}
            <main>
                <Banner
                    banner={data.banner}
                    bannerAlt={isArabic ? data.bannerAlt_ar : data.bannerAlt}
                    pageTitle={isArabic ? data.pageTitle_ar : data.pageTitle}
                    data={data.firstSection}
                />
                <ProjectLists
                    sectorData={sectorData}
                    countryData={countryData}
                    serviceData={serviceData}
                    data={data.projects}
                />
            </main>
            {/* <footer>
        <Footer />
      </footer> */}
        </>
    );
};

export default Index;
