import Banner from "@/app/components/common/Banner";
import VideoSection from "@/app/components/common/VdoSection";
import SecondSection from "./sections/SecondSection";
import ExpertiseSec from "./sections/ExpertiseSec";
import FeaturedProjectSlider from "@/app/components/common/FeaturedProjectSlider";
import WhyChooseSec from "./sections/WhyChooseSec";
import SectorsSec from "./sections/SectorsSec";
import { pickFeaturedProjects } from "@/lib/serviceRegistry";
const InteriorDesign = ({ data, projectData, featuredIds }) => {
  // projects picked for this service in admin Services > Main (none picked = section not shown)
  const filteredProjects = pickFeaturedProjects(projectData?.projects, featuredIds);

  return (
    <>
      <Banner
        title={data.pageTitle}
        image={data.banner}
        imageAlt={data.bannerAlt}
      />
      <VideoSection data={data.firstSection} justify />
      <SecondSection data={data.secondSection} />
      <ExpertiseSec data={data.thirdSection} />
      <SectorsSec data={data.fourthSection} />
      {/* <FeaturedProjectSlider data={projectData.projects.filter((item)=> item.secondSection.service._id == data._id)} /> */}
      {filteredProjects.length > 0 && (
        <FeaturedProjectSlider data={filteredProjects} />
      )}

      {/* <WhyChooseSec data={data.fifthSection} noTopSpacing={filteredProjects.length === 0} /> */}
    </>
  );
};

export default InteriorDesign;
