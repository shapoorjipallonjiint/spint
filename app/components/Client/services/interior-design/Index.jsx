import Banner from "@/app/components/common/Banner";
// import MainNavbar from "../../MainLayout/MainNavbar";
// import Footer from "../../MainLayout/Footer";
import VdoSection from "@/app/components/common/VdoSection";
import SecondSection from "./sections/SecondSection";
import ExpertiseSec from "./sections/ExpertiseSec";
import FeaturedProjectSlider from "@/app/components/common/FeaturedProjectSlider";
import WhyChooseSec from "./sections/WhyChooseSec";
import { interiorData } from "./data";
import SectorsSec from "./sections/SectorsSec";
const InteriorDesign = ({data,projectData}) => {
  return (
    <>
      {/* <header>
        <MainNavbar /> 
      </header> */}
      <Banner title={data.pageTitle} image={data.banner} imageAlt={data.bannerAlt} />
      <VdoSection data={data.firstSection} />
      <SecondSection data={data.secondSection}/>
      <ExpertiseSec data={data.thirdSection}/>
      <SectorsSec data={data.fourthSection}/>
      <FeaturedProjectSlider data={projectData.projects.filter((item)=> item.secondSection.service._id == data._id)} />
      <WhyChooseSec data={data.fifthSection} />
      {/* <footer>
        <Footer />
      </footer> */}
    </>
  );
}

export default InteriorDesign;