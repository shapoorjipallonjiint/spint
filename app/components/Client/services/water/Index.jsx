import Banner from "@/app/components/common/Banner";
import VdoSection from "@/app/components/common/VdoSection";
import ExpertiseSec from "./sections/ExpertiseSec";
import FeaturedProjectSlider from "@/app/components/common/FeaturedProjectCardSlider";
// import WhyChooseSec from "./sections/WhyChooseSec";
import { wtrData } from "./data";
import DivisionExpertise from "./sections/DivisionExpertise";
import { pickFeaturedProjects, toFeaturedSlides } from "@/lib/serviceRegistry";
const Water = ({ data, projectData, featuredIds }) => {
    // projects picked for this service in admin Services > Main (none picked = section not shown), that have a thumbnail
    const filteredProjects = toFeaturedSlides(pickFeaturedProjects(projectData?.projects, featuredIds));

    return (
        <>
            <Banner title={data.pageTitle} image={data.banner} imageAlt={data.bannerAlt} />
            <VdoSection data={data.firstSection} justify />
            <ExpertiseSec data={data.secondSection} />
            <DivisionExpertise data={data.thirdSection} />
            {/* <FeaturedProjectSlider data={projectData.projects.filter((item)=> item.secondSection.service._id == data._id)} />
             */}
            {filteredProjects.length > 0 && <FeaturedProjectSlider data={filteredProjects} />}
            {/* <WhyChooseSec data={wtrData.WhyChooseData} /> */}
        </>
    );
};

export default Water;
