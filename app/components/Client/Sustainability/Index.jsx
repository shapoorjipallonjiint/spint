import Banner from "../../common/Banner";
import VdoSection from "../../common/VdoSection";
import ExpertiseSec from "./sections/ExpertiseSec"; 
// import { sustainabilityData } from "./data";
// import OngoingInitiatives from "./sections/OngoingInitiatives";
import Certifications from "./sections/Certifications";
// import CounterSection from "./sections/CounterSection";
import RoadMap from "./sections/RoadMap";

const Index = (props) => {
  const data = props.data
  
  return (
    <>
      <Banner title={data.pageTitle} image={data.banner} imageAlt={data.bannerAlt} />
      {/* poster: admin Sustainability > First Section > Poster Image (stored as videoPosterImage; the shared video
          section reads `poster`), shown while the video loads */}
      <VdoSection
        data={{ ...data.firstSection, poster: data.firstSection?.poster || data.firstSection?.videoPosterImage }}
        maxW="max-w-[18ch]"
      />
      <ExpertiseSec data={data.secondSection} />
      {/* <OngoingInitiatives data={data.thirdSection} />  */}
      <Certifications data={data.fourthSection} />
      {/* <CounterSection data={data.fourthSection.itemsTwo} /> */}
      <RoadMap data={data.fifthSection} />
    </>
  );
}

export default Index;