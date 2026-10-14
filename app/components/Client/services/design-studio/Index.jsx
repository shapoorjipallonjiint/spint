// import { designStudioData } from "./data";
import VdoSection from "@/app/components/common/VdoSection";
import Banner from "@/app/components/common/Banner";
import ExpertiseSec from "./sections/ExpertiseSec";
import DesignExcellence from "./sections/DesignExcellence";
import FeaturedProjectSlider from "@/app/components/common/FeaturedProjectSlider";
import LastSection from "./sections/LastSection";
import { pickFeaturedProjects } from "@/lib/serviceRegistry";
const DesignStudio = ({ data, projectData, featuredIds }) => {
    // projects picked for this service in admin Services > Main (none picked = section not shown)
    const filteredProjects = pickFeaturedProjects(projectData?.projects, featuredIds);

    return (
        <>
            {/* <header>
      <MainNavbar />
    </header> */}
            <main>
                <Banner title={data.pageTitle} image={data.banner} imageAlt={data.bannerAlt} />
                <VdoSection data={data.firstSection} justify maxW="max-w-[18ch]" maxtextwidth="max-w-[60ch]" />
                <ExpertiseSec data={data.secondSection} />
                <DesignExcellence data={data.thirdSection} />
                {/* <FeaturedProjectSlider data={projectData.projects.filter((item)=> item.secondSection.service._id == data._id)} /> */}
                {/* pulls LastSection up so the two sections don't stack their spacing */}
                <section className="-mt-6 md:-mt-11 lg:-mt-10 3xl:-mt-22"></section>
                <LastSection data={data.fourthSection} />
                {/* Featured Projects stays the last section of the page */}
                {filteredProjects.length > 0 && <FeaturedProjectSlider data={filteredProjects} />}
            </main>
            {/* <footer>
      <Footer />
    </footer> */}
        </>
    );
};

export default DesignStudio;
