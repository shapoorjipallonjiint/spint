import Banner from "@/app/components/common/Banner";
// import MainNavbar from "../../MainLayout/MainNavbar";
// import Footer from "../../MainLayout/Footer";
import IDVdoSection from "./sections/IDVdoSection";
import SecondSection from "./sections/SecondSection";
import ExpertiseSec from "./sections/ExpertiseSec";
import FeaturedProjectSlider from "@/app/components/common/FeaturedProjectSlider";
import WhyChooseSec from "./sections/WhyChooseSec";
import { interiorData } from "./data";
import SectorsSec from "./sections/SectorsSec";
const InteriorDesign = ({ data, projectData }) => {

    const filteredProjects = projectData.projects.filter((item) =>
        item.secondSection.service?.some((service) =>
          typeof service === "string"
            ? service === data._id
            : service._id === data._id
        )
      );


    return (
        <>
            {/* <header>
        <MainNavbar /> 
      </header> */}
            <Banner title={data.pageTitle} image={data.banner} imageAlt={data.bannerAlt} />
            <IDVdoSection data={data.firstSection} />
            <SecondSection data={data.secondSection} />
            <ExpertiseSec data={data.thirdSection} />
            <SectorsSec data={data.fourthSection} />
            {/* <FeaturedProjectSlider data={projectData.projects.filter((item)=> item.secondSection.service._id == data._id)} /> */}
            {filteredProjects.length > 0 ? (
                <FeaturedProjectSlider
                    data={filteredProjects}
                />
            ): (  
                <section className="-mt-6 md:-mt-11 lg:-mt-12 xl:-mt-16 3xl:-mt-30"></section> 
            )}


            <WhyChooseSec data={data.fifthSection} />
            {/* <footer>
        <Footer />
      </footer> */}
        </>
    );
};

export default InteriorDesign;
