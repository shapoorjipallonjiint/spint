import Banner from "@/app/components/common/Banner";
import VdoSection from "@/app/components/common/VdoSection";
import ExpertiseSec from "./sections/ExpertiseSec";
import OurApproach from "./sections/OurApproach";
import FeaturedProjectSlider from "@/app/components/common/FeaturedProjectSlider";
import WhyChooseSec from "./sections/WhyChooseSec";
import { pickFeaturedProjects } from "@/lib/serviceRegistry";

const IntegratedFacilityManagement = ({ data, projectData, featuredIds }) => {
  // projects picked for this service in admin Services > Main (none picked = section not shown)
  const filteredProjects = pickFeaturedProjects(projectData?.projects, featuredIds);

  return (
    <>
      <Banner
        title={data.pageTitle}
        image={data.banner}
        imageAlt={data.bannerAlt}
      />
      <VdoSection data={data.firstSection} justify />
      <ExpertiseSec data={data.secondSection} />
      <OurApproach data={data.thirdSection} />
      {/* <FeaturedProjectSlider data={projectData.projects.filter((item)=> item.secondSection.service._id == data._id)} /> */}
      {filteredProjects.length > 0 && (
        <FeaturedProjectSlider data={filteredProjects} />
      )}

      <WhyChooseSec
        data={data.fourthSection}
        noTopSpacing={filteredProjects.length === 0}
      />
    </>
  );
};

export default IntegratedFacilityManagement;
