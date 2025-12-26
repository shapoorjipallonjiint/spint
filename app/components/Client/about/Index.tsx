import Banner from "../../../components/common/Banner";
import About from "./sections/About";
import VisionMission from "./sections/VisionMission";
import OurValues from "./sections/OurValues";
import Trusted from "./sections/Trusted";
import Legacy from "./sections/Legacy";
// import MainNavbar from "../../MainLayout/MainNavbar";
// import Footer from "../../MainLayout/Footer";

const Index = () => {
  return (
    <>
      {/* <header>
        <MainNavbar />
      </header> */}
      <main>
        <Banner
          title="About SP International"
          image="/assets/images/about-us/about-banner.jpg"
          imageAlt=""
        />
        <About />
        <VisionMission />
        <OurValues />
        <Legacy />
        <Trusted />
      </main>
      {/* <footer>
        <Footer />
      </footer> */}
    </>
  );
};

export default Index;
