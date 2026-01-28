import Banner from "./sections/Banner";
import KeyFacts from "./sections/KeyFacts";
import MoreDetrails from "./sections/MoreDetrails";
import ProjectSlider from "./sections/ProjectSlider";
import InquireToday from "./sections/InquireToday";
import NextProject from "./sections/NextProject";
const Index = ({ data, nextProject }) => {
    return (
        <>
            {/* <header>
        <MainNavbar />
      </header> */}
            <main>
                <Banner firstSection={data.firstSection} secondSection={data.secondSection} />
                {data.thirdSection.items?.length > 0 && <KeyFacts data={data.thirdSection} />}
                <MoreDetrails data={data.fourthSection} />
                {data.images?.length > 0 && <ProjectSlider data={data.images} />}
                <InquireToday data={data.sixthSection} />
                <NextProject
                    slug={nextProject?.slug}
                    title={nextProject?.firstSection?.title}
                    thumbnail={nextProject?.thumbnail}
                />
            </main>
            {/* <footer>
        <Footer />
      </footer> */}
        </>
    );
};

export default Index;
