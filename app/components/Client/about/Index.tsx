import Banner from "../../../components/common/Banner";
import About from "./sections/About";
import VisionMission from "./sections/VisionMission";
import OurValues from "./sections/OurValues";
import Trusted from "./sections/Trusted";
import Legacy from "./sections/Legacy";
// import MainNavbar from "../../MainLayout/MainNavbar";
// import Footer from "../../MainLayout/Footer";
import Impact from './sections/Impact'

const Index = ({data}:{data:any}) => {
  return (
    <>
      {/* <header>
        <MainNavbar />
      </header> */}
      <main>
        <Banner
          title={data.pageTitle}
          image={data.banner}
          imageAlt={data.bannerAlt}
        />
        <About data={data.firstSection}/>
        {/* <VisionMission data={data.secondSection}/> */}
        <Impact CultureData={data.secondSection} />
        <OurValues data={data.thirdSection}/>
        <Legacy data={data.fourthSection}/>
        <Trusted data={data.fifthSection}/>
      </main>
      {/* <footer>
        <Footer />
      </footer> */}
    </>
  );
};

export default Index;
