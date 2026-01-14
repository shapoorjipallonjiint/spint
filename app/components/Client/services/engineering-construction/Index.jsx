import Banner from "@/app/components/common/Banner";
// import MainNavbar from "../../MainLayout/MainNavbar";
// import Footer from "../../MainLayout/Footer";
import VdoSection from "@/app/components/common/VdoSection";
import ExpertiseSec from "./sections/ExpertiseSec";
import OurApproach from "./sections/OurApproach";
import FeaturedProjectSlider from "@/app/components/common/FeaturedProjectSlider";
import WhyChooseSec from "./sections/WhyChooseSec";
import { engineeringData } from "./data";
const EngineeringConstruction = ({ data, projectData }) => {
    return (
        <>
            {/* <header className="">
        <MainNavbar /> 
      </header> */}
            <Banner title={data.pageTitle} image={data.banner} imageAlt={data.bannerAlt} data={data}/>
            <VdoSection data={data.firstSection} />
            <ExpertiseSec data={data.secondSection} />
            <OurApproach data={data.thirdSection} />
            {/* <FeaturedProjectSlider data={projectData.projects.filter((item)=> item.secondSection.service._id == data._id)} /> */}
            {projectData.projects.filter((item) => item.secondSection.service !== null ? item.secondSection.service?._id === data._id : null).length > 0 && (
                <FeaturedProjectSlider
                    data={projectData.projects.filter((item) => item.secondSection.service !== null ? item.secondSection.service?._id === data._id : null)}
                />
            )}

            <WhyChooseSec data={data.fourthSection} />
            {/* <footer>
        <Footer />
      </footer> */}
        </>
    );
};

export default EngineeringConstruction;
