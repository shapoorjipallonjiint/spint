import Banner from "@/app/components/common/Banner";
import VideoSection from "@/app/components/common/VdoSection";
import SecondSection from "./sections/SecondSection";
import ExpertiseSec from "./sections/ExpertiseSec";
import FeaturedProjectSlider from "@/app/components/common/FeaturedProjectSlider";
import WhyChooseSec from "./sections/WhyChooseSec";
import SectorsSec from "./sections/SectorsSec";
const InteriorDesign = ({ data, projectData }) => {
  const filteredProjects = projectData.projects.filter((item) =>
    item.secondSection.service?.some((service) =>
      typeof service === "string"
        ? service === data._id
        : service._id === data._id,
    ),
  );

  return (
    <>
      <Banner
        title={data.pageTitle}
        image={data.banner}
        imageAlt={data.bannerAlt}
      />
      <VideoSection data={data.firstSection} />
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
