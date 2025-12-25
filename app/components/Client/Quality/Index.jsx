import Banner from "../../common/Banner";
import CoreValues from "./sections/CoreValues";
// import { EnsuringSafetyData } from "./data";
import Certifications from "./sections/Certifications";
import SaftySlider from "./sections/SaftySlider";
import ImgPointsComponent from "../../common/ImgPointsComponent";

const QualitySafety = ({data}) => {
  console.log(data, "ds")
    return (
        <>
            <Banner title={data.pageTitle} image={data.banner} imageAlt={data.bannerAlt} />
            <CoreValues data={data.firstSection} />
            <Certifications data={data.secondSection} />
            <SaftySlider data={data.thirdSection} />
            <ImgPointsComponent data={data.fourthSection} bgColor="[#f5f5f5]" sectionSpacing="pt-text90 pb25" />
        </>
    );
};

export default QualitySafety;
