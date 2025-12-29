
import Banner from "./sections/Banner"; 
import ProjectLists from "./sections/ProjectLists";
const Index = ({data,sectorData,countryData,serviceData}) => {
  return (
    <>
      {/* <header>
        <MainNavbar />
      </header>  */}
      <main>
        <Banner banner={data.banner} bannerAlt={data.bannerAlt} pageTitle={data.pageTitle} data={data.firstSection}/> 
        <ProjectLists sectorData={sectorData} countryData={countryData} serviceData={serviceData} data={data.projects}/>
    
      </main>
      {/* <footer>
        <Footer />
      </footer> */}
    </>
  );
}

export default Index;