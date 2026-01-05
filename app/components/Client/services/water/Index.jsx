import Banner from "@/app/components/common/Banner";
import VdoSection from "@/app/components/common/VdoSection";
import ExpertiseSec from "./sections/ExpertiseSec";
import FeaturedProjectSlider from "@/app/components/common/FeaturedProjectSlider";
// import WhyChooseSec from "./sections/WhyChooseSec";
import { wtrData } from "./data";
import DivisionExpertise from "./sections/DivisionExpertise";
const Water = ({ data, projectData }) => {
    return (
        <>
            {/* <header className="">
        <MainNavbar /> 
      </header> */}
            <Banner title={data.pageTitle} image={data.banner} imageAlt={data.bannerAlt} />
            <VdoSection data={data.firstSection} />
            <ExpertiseSec data={data.secondSection} />
            <DivisionExpertise data={data.thirdSection} />
            {/* <FeaturedProjectSlider data={projectData.projects.filter((item)=> item.secondSection.service._id == data._id)} />
             */}
            {projectData.projects.filter((item) => item.secondSection.service._id === data._id).length > 0 && (
                <FeaturedProjectSlider
                    data={projectData.projects.filter((item) => item.secondSection.service._id === data._id)}
                />
            )}
            {/* <WhyChooseSec data={wtrData.WhyChooseData} /> */}
            {/* <footer>
        <Footer />
      </footer> */}
        </>
    );
};

export default Water;
