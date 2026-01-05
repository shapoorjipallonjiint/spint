import Banner from "@/app/components/common/Banner";
// import MainNavbar from "../../MainLayout/MainNavbar";
// import Footer from "../../MainLayout/Footer";
import VdoSection from "@/app/components/common/VdoSection";
import ExpertiseSec from "./sections/ExpertiseSec";
// import OurApproach from "./sections/OurApproach";
import FeaturedProjectSlider from "@/app/components/common/FeaturedProjectSlider";
import WhyChooseSec from "@/app/components/common/ImgPointsComponent";
import InnovationSustainability from "./sections/InnovationSustainability";
// import { mepData } from "./data";
const MEP = ({ data, projectData }) => {
    return (
        <>
            {/* <header className="">
        <MainNavbar /> 
      </header> */}
            <Banner title={data.pageTitle} image={data.banner} imageAlt={data.bannerAlt} />
            <VdoSection data={data.firstSection} maxW="max-w-[18ch]" />
            <ExpertiseSec data={data.secondSection} />
            <WhyChooseSec data={data.thirdSection} bgColor="white" sectionSpacing="pt-text30 pb30" />
            {/* <FeaturedProjectSlider data={projectData.projects.filter((item)=> item.secondSection.service._id == data._id)} /> */}
            {projectData.projects.filter((item) => item.secondSection.service._id === data._id).length > 0 && (
                <FeaturedProjectSlider
                    data={projectData.projects.filter((item) => item.secondSection.service._id === data._id)}
                />
            )}

            <InnovationSustainability data={data.fourthSection} />
            {/* <OurApproach data={mepData.approachesData}/> */}
            {/* <footer>
        <Footer />
      </footer> */}
        </>
    );
};

export default MEP;
