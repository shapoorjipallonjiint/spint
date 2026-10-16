import Banner from "@/app/components/common/Banner";
import VdoSection from "@/app/components/common/VdoSection";
import ExpertiseSec from "./sections/ExpertiseSec";
import FeaturedProjectSlider from "@/app/components/common/FeaturedProjectCardSlider";
import ImgPointsComponent from "@/app/components/common/ImgPointsComponent";
import SystemsSec from "./sections/SystemsSec";
import { pickFeaturedProjects, toFeaturedSlides } from "@/lib/serviceRegistry";
// import LastSection from "./sections/LastSection";
const Facade = ({ data, projectData, featuredIds }) => {
  // projects picked for this service in admin Services > Main (none picked = section not shown), that have a thumbnail
  const filteredProjects = toFeaturedSlides(pickFeaturedProjects(projectData?.projects, featuredIds));

  return (
    <>
      <main>
        <Banner
          title={data.pageTitle}
          image={data.banner}
          imageAlt={data.bannerAlt}
        />
        <VdoSection data={data.firstSection} justify />
        <ExpertiseSec data={data.secondSection} />
        {/* "Our Facade, Glazing & Metalwork" accordion - renders only when items are added in the admin */}
        <SystemsSec data={data.systemsSection} />
        <ImgPointsComponent
          data={data.thirdSection}
          bgColor="white"
          sectionSpacing="section-spacing"
        />
        {/* <FeaturedProjectSlider data={projectData.projects.filter((item)=> item.secondSection.service._id == data._id)} /> */}
        {/* no placeholder with negative margin here: the section above uses section-spacing, which already sets the spacing */}
        {filteredProjects.length > 0 && (
          <FeaturedProjectSlider data={filteredProjects} />
        )}
        {/* <LastSection data={data.fourthSection} /> */}
      </main>
    </>
  );
};

export default Facade;
