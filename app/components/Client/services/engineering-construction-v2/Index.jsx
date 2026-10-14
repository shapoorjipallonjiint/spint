import Banner from "@/app/components/common/Banner";
import VdoSection from "./sections/VdoSection";
import ExpertiseSec from "./sections/ExpertiseSec";
import OurApproach from "./sections/OurApproach";
import FeaturedProjectSlider from "./sections/FeaturedProjectSlider";
// import WhyChooseSec from "./sections/WhyChooseSec";
import { pickFeaturedProjects } from "@/lib/serviceRegistry";

const EngineeringConstruction = ({ data, projectData, featuredIds }) => {
  // projects picked for this service in admin Services > Main (none picked = section not shown), that have a thumbnail
  const featuredProjects = pickFeaturedProjects(projectData?.projects, featuredIds)
    .filter((project) => project?.thumbnail)
    .map((project) => ({
      image: project.thumbnail,
      imageAlt: project.thumbnailAlt,
      imageAlt_ar: project.thumbnailAlt_ar,
      title: project.firstSection?.title,
      title_ar: project.firstSection?.title_ar,
      slug: project.slug,
    }));

  // const filteredProjects = projectData.projects.filter((item) =>
  //     item.secondSection.service?.some((service) =>
  //       typeof service === "string"
  //         ? service === data._id
  //         : service._id === data._id
  //     )
  //   );

  return (
    <>
      <Banner
        title={data.pageTitle}
        image={data.banner}
        imageAlt={data.bannerAlt}
        data={data}
      />
      <VdoSection data={data.firstSection} />
      <ExpertiseSec data={data.secondSection} />
      <OurApproach data={data.thirdSection} />
      {/* <FeaturedProjectSlider data={projectData.projects.filter((item)=> item.secondSection.service._id == data._id)} /> */}
      {featuredProjects.length > 0 && (
        <FeaturedProjectSlider data={featuredProjects} />
      )}
      {/* {filteredProjects.length > 0 && (
                <FeaturedProjectSlider
                    data={filteredProjects}
                />
            )} */}

      {/* <WhyChooseSec data={data.fourthSection} /> */}
    </>
  );
};

export default EngineeringConstruction;
