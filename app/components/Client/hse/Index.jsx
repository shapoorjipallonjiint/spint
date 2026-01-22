import Banner from "@/app/components/common/Banner";
import CoreValues from "./sections/CoreValues";
// import EnsuringSafety from "./sections/EnsuringSafety";
import Certifications from "./sections/Certifications";
import SaftySlider from "./sections/SaftySlider";
import Philosophy from "./sections/Philosophy";
import Environmental from "./sections/Environmental";
// import ImgPointsComponent from "@/app/components/common/ImgPointsComponent";
// import { environmentalData } from "./sections/data";
const QualitySafety = ({ data }) => {
    console.log(data, "hse");
    return (
        <>
            <Banner title={data.pageTitle} image={data.banner} imageAlt={data.bannerAlt} data={data} />
            <CoreValues data={data.firstSection} />
            <Philosophy data={data.philosophySection} />
            <Environmental data={data.environmentalSection} />
            <Certifications data={data.secondSection} />
            <SaftySlider data={data.thirdSection} />
            {/* <ImgPointsComponent data={data.fourthSection} bgColor="[#f5f5f5]" sectionSpacing="pt-text90 pb25" /> */}
            {/* <EnsuringSafety />   */}
        </>
    );
};

export default QualitySafety;
