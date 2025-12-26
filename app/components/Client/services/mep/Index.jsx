import Banner from "@/app/components/common/Banner";
// import MainNavbar from "../../MainLayout/MainNavbar";
// import Footer from "../../MainLayout/Footer";
import VdoSection from "@/app/components/common/VdoSection";
import ExpertiseSec from "./sections/ExpertiseSec";
// import OurApproach from "./sections/OurApproach";
import FeaturedProjectSlider from "@/app/components/common/FeaturedProjectSlider";
import WhyChooseSec from "@/app/components/common/ImgPointsComponent";
import InnovationSustainability from "./sections/InnovationSustainability";
import { mepData } from "./data";
const MEP = () => {
  return (
    <>
      {/* <header className="">
        <MainNavbar /> 
      </header> */}
      <Banner title="Mechanical, Electrical & Plumbing (MEP)" image="./assets/images/mep/banner.jpg" />
      <VdoSection data={mepData.mainSection} maxW="max-w-[18ch]" />
      <ExpertiseSec data={mepData.expertiseData} />
      <WhyChooseSec data={mepData.whyChooseData} bgColor="white" sectionSpacing="pt-text30 pb30" />
      <FeaturedProjectSlider data={mepData.featuredProjectsData} />
      <InnovationSustainability data={mepData.innovationSustainabilityData} />
      {/* <OurApproach data={mepData.approachesData}/> */}
      {/* <footer>
        <Footer />
      </footer> */}
    </>
  );
}

export default MEP;