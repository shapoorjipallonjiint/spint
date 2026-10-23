import Banner from "./sections/Banner";
import KeyFacts from "./sections/KeyFacts";
import MoreDetrails from "./sections/MoreDetrails";
import ProjectSlider from "./sections/ProjectSlider";
import InquireToday from "./sections/InquireToday";
import NextProject from "./sections/NextProject";
import DetailsTab from "./sections/DetailsTab";
import { hasServiceContent } from "./serviceContent";
// smallerTitle: the /v2/projects/[slug] preview shows the project heading 3px smaller from xl up
const Index = ({ data, nextProject, smallerTitle = false }) => {
    return (
        <>
            {/* <header>
        <MainNavbar />
      </header> */}
            <main>
                <Banner firstSection={data.firstSection} secondSection={data.secondSection} smallerTitle={smallerTitle} />
                {data.thirdSection.items?.length > 0 && <KeyFacts data={data.thirdSection} />}
                {/* show the services section when any service has content (not only a first-section title) */}
                {data?.secondSection?.service?.some(hasServiceContent) && <DetailsTab data={data.secondSection} />}
                {/* <MoreDetrails data={data.fourthSection} /> */}
                {/* {data.images?.length > 0 && <ProjectSlider data={data.images} />} */}
                <InquireToday data={data.sixthSection} />
                <NextProject slug={nextProject?.slug} title={nextProject?.firstSection?.title} thumbnail={nextProject?.thumbnail} />
            </main>
            {/* <footer>
        <Footer />
      </footer> */}
        </>
    );
};

export default Index;
