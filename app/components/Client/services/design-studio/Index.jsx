
// import { designStudioData } from "./data";
import VdoSection from "@/app/components/common/VdoSection";
import Banner from "@/app/components/common/Banner";
import ExpertiseSec from "./sections/ExpertiseSec";
import DesignExcellence from "./sections/DesignExcellence";
import FeaturedProjectSlider from "@/app/components/common/FeaturedProjectSlider";
import LastSection from "./sections/LastSection";
const DesignStudio = ({data,projectData}) => {
  
  return ( 
    <>
    {/* <header>
      <MainNavbar />
    </header> */}
    <main>
        <Banner title={data.pageTitle} image={data.banner} imageAlt={data.bannerAlt} />
        <VdoSection data={data.firstSection} maxW="max-w-[18ch]" maxtextwidth="max-w-[60ch]"/>
        <ExpertiseSec data={data.secondSection} />
        <DesignExcellence data={data.thirdSection} />
        <FeaturedProjectSlider data={projectData.projects.filter((item)=> item.secondSection.service._id == data._id)} />
        <LastSection data={data.fourthSection}/>
    </main>
    {/* <footer>
      <Footer />
    </footer> */}
    </>
   );
}
 
export default DesignStudio;