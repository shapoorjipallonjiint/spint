
// import MainNavbar from "../../MainLayout/MainNavbar";
// import Footer from "../../MainLayout/Footer";
import { facadeData } from "./data";
import VdoSection from "@/app/components/common/VdoSection";
import Banner from "@/app/components/common/Banner";
import ExpertiseSec from "./sections/ExpertiseSec";
import FeaturedProjectSlider from "@/app/components/common/FeaturedProjectSlider";
import ImgPointsComponent from "@/app/components/common/ImgPointsComponent";
import LastSection from "./sections/LastSection";
const Facade = ({data,projectData}) => {
  
  return ( 
    <>
    {/* <header>
      <MainNavbar />
    </header> */}
    <main>
        <Banner title={data.pageTitle} image={data.banner} imageAlt={data.bannerAlt} />
        <VdoSection data={data.firstSection} />
        <ExpertiseSec data={data.secondSection} />
        <ImgPointsComponent data={data.thirdSection} bgColor="white" sectionSpacing="pt-text30 pb30" />
        <FeaturedProjectSlider data={projectData.projects.filter((item)=> item.secondSection.service._id == data._id)} />
        <LastSection data={data.fourthSection}/>
    </main>
    {/* <footer>
      <Footer />
    </footer> */}
    </>
   );
}
 
export default Facade;