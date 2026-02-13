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
            typeof service === "string" ? service === data._id : service._id === data._id,
        ),
    );

    return (
        <>
            {/* <header>
      <MainNavbar />
    </header> */}
            <main>
                <Banner title={data.pageTitle} image={data.banner} imageAlt={data.bannerAlt} />
                <VdoSection data={data.firstSection} />
                <ExpertiseSec data={data.secondSection} />
                <ImgPointsComponent data={data.thirdSection} bgColor="white" sectionSpacing="pt-text30 pb30" />
                {/* <FeaturedProjectSlider data={projectData.projects.filter((item)=> item.secondSection.service._id == data._id)} /> */}
                {filteredProjects.length > 0 ? (
                    <FeaturedProjectSlider data={filteredProjects} />
                ) : (
                    <section className="-mt-6 md:-mt-11 lg:-mt-12 xl:-mt-16 3xl:-mt-30"></section>
                )}
                {/* <LastSection data={data.fourthSection} /> */}
            </main>
            {/* <footer>
      <Footer />
    </footer> */}
        </>
    );
};

export default Facade;
