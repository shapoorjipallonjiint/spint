import Banner from "../../../components/common/Banner";
import About from "./sections/About";
// import VisionMission from "./sections/VisionMission";
import ValuesCta from "./sections/ValuesCta";
import Legacy from "./sections/Legacy";
import OurClients from "./sections/OurClients";
import Impact from "./sections/Impact";

const Index = ({ data }: { data: any }) => {
  return (
    <>
      <main>
        <Banner
          title={data.pageTitle}
          image={data.banner}
          imageAlt={data.bannerAlt}
          data={data}
        />
        <About data={data.firstSection} />
        <Legacy data={data.fourthSection} />
        <OurClients data={data.clientsSection} />
        {/* <VisionMission data={data.secondSection}/> */}
        <Impact CultureData={data.secondSection} />
        <ValuesCta valuesData={data.thirdSection} ctaData={data.fifthSection} />
      </main>
    </>
  );
};

export default Index;
