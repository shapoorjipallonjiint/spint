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
            <Banner title={data.pageTitle} image={data.banner} imageAlt={data.bannerAlt} data={data}/>
            <VdoSection data={data.firstSection} />
            <ExpertiseSec data={data.secondSection} />
            <OurApproach data={data.thirdSection} />
            {/* <FeaturedProjectSlider data={projectData.projects.filter((item)=> item.secondSection.service._id == data._id)} /> */}
            {filteredProjects.length > 0 && (
                <FeaturedProjectSlider
                    data={filteredProjects}
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
