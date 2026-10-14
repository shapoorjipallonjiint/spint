import Banner from "@/app/components/common/Banner";
import VideoSection from "@/app/components/common/VdoSection";
import ExpertiseSec from "./sections/ExpertiseSec";
// import OurApproach from "./sections/OurApproach";
import FeaturedProjectSlider from "@/app/components/common/FeaturedProjectSlider";
import WhyChooseSec from "@/app/components/common/ImgPointsComponent";
import InnovationSustainability from "./sections/InnovationSustainability";
import { pickFeaturedProjects } from "@/lib/serviceRegistry";
// import { mepData } from "./data";
const MEP = ({ data, projectData, featuredIds }) => {
  // projects picked for this service in admin Services > Main (none picked = section not shown)
  const filteredProjects = pickFeaturedProjects(projectData?.projects, featuredIds);

  return (
    <>
      <Banner
        title={data.pageTitle}
        image={data.banner}
        imageAlt={data.bannerAlt}
      />
      <VideoSection data={data.firstSection} justify maxW="max-w-[18ch]" />
      <ExpertiseSec data={data.secondSection} />
      {/* <WhyChooseSec
        data={data.thirdSection}
        bgColor="white"
        sectionSpacing="section-spacing"
      /> */}
      {/* <FeaturedProjectSlider data={projectData.projects.filter((item)=> item.secondSection.service._id == data._id)} /> */}
      <InnovationSustainability data={data.fourthSection} />
      {/* <OurApproach data={mepData.approachesData}/> */}
      {/* Featured Projects stays the last section of the page */}
      {filteredProjects.length > 0 && (
        <FeaturedProjectSlider data={filteredProjects} />
      )}
    </>
  );
};

export default MEP;
