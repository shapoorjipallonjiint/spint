import Banner from "./sections/Banner";
// import MainNavbar from "../../MainLayout/MainNavbar";
// import Footer from "../../MainLayout/Footer";
import VdoSection from "./sections/VdoSection";
import ExpertiseSec from "./sections/ExpertiseSec";
import OurApproach from "./sections/OurApproach";
import FeaturedProjectSlider from "./sections/FeaturedProjectSlider";
import WhyChooseSec from "./sections/WhyChooseSec";
// how many linked projects the Featured Projects slider shows (in the admin's project order)
const FEATURED_PROJECTS_LIMIT = 10;

const EngineeringConstruction = ({ data, projectData }) => {
  // projects tagged with this service in the admin (secondSection.service[].serviceId), that have a thumbnail
  const featuredProjects = (projectData?.projects || [])
    .filter((project) =>
      (project?.secondSection?.service || []).some(
        (service) =>
          String(service?.serviceId?._id ?? service?.serviceId ?? "") ===
          String(data?._id),
      ),
    )
    .filter((project) => project?.thumbnail)
    .slice(0, FEATURED_PROJECTS_LIMIT)
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
