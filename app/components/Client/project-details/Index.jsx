import Banner from "./sections/Banner"; 
import KeyFacts from "./sections/KeyFacts";
import MoreDetrails from "./sections/MoreDetrails";
import ProjectSlider from "./sections/ProjectSlider";
import InquireToday from "./sections/InquireToday";
import NextProject from "./sections/NextProject";
const Index = ({data,nextProject}) => {
    console.log(nextProject)
  return (
    <>
      {/* <header>
        <MainNavbar />
      </header> */}
      <main>
        <Banner firstSection={data.firstSection} secondSection={data.secondSection}/>
        <KeyFacts data={data.thirdSection}/>
        <MoreDetrails data={data.fourthSection}/>
        <ProjectSlider data={data.images}/>
        <InquireToday data={data.sixthSection}/>
        <NextProject slug={nextProject.slug} title={nextProject.firstSection.title} thumbnail={nextProject.thumbnail}/>
        
      </main>
      {/* <footer>
        <Footer />
      </footer> */}
    </>
  );
};

export default Index;
