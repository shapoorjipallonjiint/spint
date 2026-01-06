import Banner from "@/app/components/common/Banner";
import CoreValues from "./sections/CoreValues";
// import EnsuringSafety from "./sections/EnsuringSafety";
import Certifications from "./sections/Certifications";
import SaftySlider from "./sections/SaftySlider";
import ImgPointsComponent from "@/app/components/common/ImgPointsComponent";
const QualitySafety = ({ data }) => {
    return (
        <>
            {/* <header className="">
        <MainNavbar /> 
      </header> */}
            <Banner title={data.pageTitle} image={data.banner} imageAlt={data.bannerAlt} />
            <CoreValues data={data.firstSection} />
            <Certifications data={data.secondSection} />
            <SaftySlider data={data.thirdSection} />
            <ImgPointsComponent data={data.fourthSection} bgColor="[#f5f5f5]" sectionSpacing="pt-text90 pb25" />
            {/* <EnsuringSafety />   */}
            {/* <footer>
        <Footer />
      </footer> */}
        </>
    );
};

export default QualitySafety;
