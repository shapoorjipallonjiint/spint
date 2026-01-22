import Banner from "../../common/Banner";
import CoreValues from "./sections/CoreValues";
// import { EnsuringSafetyData } from "./data";
import Certifications from "./sections/Certifications";
import SaftySlider from "./sections/SaftySlider";

import UnifiedStandard from "./sections/UnifiedStandard";
import Continual from "./sections/Continual";
import QualityPractices from "./sections/QualityPractices";

const Index = ({ data }) => {
    return (
        <>
            <Banner title={data.pageTitle} image={data.banner} imageAlt={data.bannerAlt} data={data} />
            <CoreValues data={data.firstSection} />
            <UnifiedStandard data={data.unifiedStandardSection} />
            <QualityPractices data={data.fourthSection} bgColor="[#f5f5f5]" sectionSpacing="pt-text90 pb25" />
            <Certifications data={data.secondSection} />
            <SaftySlider data={data.thirdSection} />
            <Continual data={data.sixthSection} />
        </>
    );
};

export default Index;
