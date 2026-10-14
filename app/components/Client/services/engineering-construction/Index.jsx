import Banner from "@/app/components/common/Banner";
// import MainNavbar from "../../MainLayout/MainNavbar";
// import Footer from "../../MainLayout/Footer";
import VdoSection from "@/app/components/common/VdoSection";
import ExpertiseSec from "./sections/ExpertiseSec";
import OurApproach from "./sections/OurApproach";
import FeaturedProjectSlider from "@/app/components/common/FeaturedProjectSlider";
import WhyChooseSec from "./sections/WhyChooseSec";
import { engineeringData } from "./data";
import { pickFeaturedProjects } from "@/lib/serviceRegistry";
const EngineeringConstruction = ({ data, projectData, featuredIds }) => {

    // projects picked for this service in admin Services > Main (none picked = section not shown)
    const filteredProjects = pickFeaturedProjects(projectData?.projects, featuredIds);
      

    return (
        <>
            {/* <header className="">
        <MainNavbar /> 
      </header> */}
            <Banner title={data.pageTitle} image={data.banner} imageAlt={data.bannerAlt} data={data}/>
            <VdoSection data={data.firstSection} justify />
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
