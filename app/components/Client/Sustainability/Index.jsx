import Banner from "../../common/Banner";
import VdoSection from "../../common/VdoSection";
import ExpertiseSec from "./sections/ExpertiseSec"; 
// import { sustainabilityData } from "./data";
import OngoingInitiatives from "./sections/OngoingInitiatives";
import Certifications from "./sections/Certifications";
import CounterSection from "./sections/CounterSection";
import RoadMap from "./sections/RoadMap";

const Index = (props) => {
  const data = props.data
  
  return (
    <>
      <Banner title={data.pageTitle} image={data.banner} imageAlt={data.bannerAlt} />
      <VdoSection data={data.firstSection} maxW="max-w-[18ch]" />
      <ExpertiseSec data={data.secondSection} />
      <OngoingInitiatives data={data.thirdSection} /> 
      <Certifications data={data.fourthSection} />
      <CounterSection data={data.fourthSection.itemsTwo} />
      <RoadMap data={data.fifthSection} />
    </>
  );
}

export default Index;