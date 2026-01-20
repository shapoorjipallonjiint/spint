import Strength from "./sections/Strength";
import ImageCarousel from "./sections/ImageCarousel";
import ImageAcc from "./sections/ImageAcc";
import Empowerment from "./sections/Empowerment";
import Banner from "../../../components/common/Banner";
import OurValues from "./sections/OurValues";
import PartOfUs from "./sections/PartOfUs";
import JourneySlider from "./sections/JourneySlider";
import DiversitySection from './sections/Diversity'
import { diversityData } from './data'

// import { workplaceData } from "./data";

const Index = ({ data }) => {
  console.log(data, "dsd")
    return (
        <>
            <Banner title={data.pageTitle} image={data.banner} imageAlt={data.bannerAlt} />
            <Strength data={data.firstSection} />
            <ImageCarousel data={data.firstSection} />
            <Empowerment data={data.secondSection} />
            <ImageAcc data={data.thirdSection}  />
            <OurValues data={data.fourthSection} />
            {/* <JourneySlider data={data.fifthSection} /> */}
            <DiversitySection data={diversityData} />
            <PartOfUs data={data.sixthSection} />
        </>
    );
};

export default Index;
