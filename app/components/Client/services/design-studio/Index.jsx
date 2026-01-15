// import { designStudioData } from "./data";
import VdoSection from "@/app/components/common/VdoSection";
import Banner from "@/app/components/common/Banner";
import ExpertiseSec from "./sections/ExpertiseSec";
import DesignExcellence from "./sections/DesignExcellence";
import FeaturedProjectSlider from "@/app/components/common/FeaturedProjectSlider";
import LastSection from "./sections/LastSection";
const DesignStudio = ({ data, projectData }) => {

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
            <main>
                <Banner title={data.pageTitle} image={data.banner} imageAlt={data.bannerAlt} />
                <VdoSection data={data.firstSection} maxW="max-w-[18ch]" maxtextwidth="max-w-[60ch]" />
                <ExpertiseSec data={data.secondSection} />
                <DesignExcellence data={data.thirdSection} />
                {/* <FeaturedProjectSlider data={projectData.projects.filter((item)=> item.secondSection.service._id == data._id)} /> */}
                {filteredProjects.length > 0 ? (
                    <FeaturedProjectSlider
                        data={filteredProjects}
                    />
                ): (  
                <section className="-mt-6 md:-mt-11 lg:-mt-10 3xl:-mt-22"></section> 
            )}

                <LastSection data={data.fourthSection} />
            </main>
            {/* <footer>
      <Footer />
    </footer> */}
        </>
    );
};

export default DesignStudio;
