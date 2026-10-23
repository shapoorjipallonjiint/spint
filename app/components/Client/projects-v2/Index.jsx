"use client";

import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import Banner from "./sections/Banner";
import ProjectLists from "./sections/ProjectLists";
// cardV2: the /v2/projects preview renders the cards with ProjectCardV2
const Index = ({ data, sectorData, countryData, serviceData, visitorCountry, projectOrders, cardV2 = false }) => {
  const isArabic = useIsPreferredLanguageArabic();

  return (
    <>
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
          visitorCountry={visitorCountry}
          projectOrders={projectOrders}
          cardV2={cardV2}
        />
      </main>
    </>
  );
};

export default Index;
