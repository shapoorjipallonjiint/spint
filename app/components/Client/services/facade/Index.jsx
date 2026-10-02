// import MainNavbar from "../../MainLayout/MainNavbar";
// import Footer from "../../MainLayout/Footer";
import Banner from "@/app/components/common/Banner";
import VdoSection from "@/app/components/common/VdoSection";
import ExpertiseSec from "./sections/ExpertiseSec";
import FeaturedProjectSlider from "@/app/components/common/FeaturedProjectSlider";
import ImgPointsComponent from "@/app/components/common/ImgPointsComponent";
// import LastSection from "./sections/LastSection";
const Facade = ({ data, projectData }) => {
  const filteredProjects = projectData.projects.filter((item) =>
    item.secondSection.service?.some((service) =>
      typeof service === "string"
        ? service === data._id
        : service._id === data._id,
    ),
  );

  return (
    <>
      <main>
        <Banner
          title={data.pageTitle}
          image={data.banner}
          imageAlt={data.bannerAlt}
        />
        <VdoSection data={data.firstSection} />
        <ExpertiseSec data={data.secondSection} />
        <ImgPointsComponent
          data={data.thirdSection}
          bgColor="white"
          sectionSpacing="section-spacing"
        />
        {/* <FeaturedProjectSlider data={projectData.projects.filter((item)=> item.secondSection.service._id == data._id)} /> */}
        {/* no placeholder with negative margin here: the section above uses section-spacing, which already sets the spacing */}
        {filteredProjects.length > 0 && <FeaturedProjectSlider data={filteredProjects} />}
        {/* <LastSection data={data.fourthSection} /> */}
      </main>
    </>
  );
};

export default Facade;
