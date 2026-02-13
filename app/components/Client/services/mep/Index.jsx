import Banner from "@/app/components/common/Banner";
// import MainNavbar from "../../MainLayout/MainNavbar";
// import Footer from "../../MainLayout/Footer";
import MepVIdeoSection from "./sections/MepVideoSection";
import ExpertiseSec from "./sections/ExpertiseSec";
// import OurApproach from "./sections/OurApproach";
import FeaturedProjectSlider from "@/app/components/common/FeaturedProjectSlider";
import WhyChooseSec from "@/app/components/common/ImgPointsComponent";
import InnovationSustainability from "./sections/InnovationSustainability";
// import { mepData } from "./data";
const MEP = ({ data, projectData }) => {

    const filteredProjects = projectData.projects.filter((item) =>
        item.secondSection.service?.some((service) =>
          typeof service === "string"
            ? service === data._id
            : service._id === data._id
        )
      );


    return (
        <>
            {/* <header className="">
        <MainNavbar /> 
      </header> */}
            <Banner title={data.pageTitle} image={data.banner} imageAlt={data.bannerAlt} />
            <MepVIdeoSection data={data.firstSection} maxW="max-w-[18ch]" />
            <ExpertiseSec data={data.secondSection} />
            <WhyChooseSec data={data.thirdSection} bgColor="white" sectionSpacing="pt-text30 pb30" />
            {/* <FeaturedProjectSlider data={projectData.projects.filter((item)=> item.secondSection.service._id == data._id)} /> */}
            {filteredProjects.length > 0 && (
                <FeaturedProjectSlider
                    data={filteredProjects}
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
