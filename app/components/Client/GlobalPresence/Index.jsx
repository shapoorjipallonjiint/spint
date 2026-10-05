import Banner from "../../common/Banner";
import ExpandingHorizons from "./sections/ExpandingHorizons";
// country cards replaced by the world map (same as the homepage); kept here in case they are needed again
// import Horizons from "./sections/Horizons";
import WorldMap from "../../common/WorldMap";
// import { globalPresenceData } from "./data";

const Index = ({ data, mapCities, projectsData }) => {
    return (
        <>
            <Banner title={data.pageTitle} image={data.banner} imageAlt={data.bannerAlt} />
            <ExpandingHorizons data={data.firstSection} />
            {/* <Horizons data={data.secondSection} /> */}
            <section className="pt-50px pb-80px bg-f5f5 relative overflow-hidden">
                <WorldMap cities={mapCities} projectsData={projectsData} />
            </section>
        </>
    );
};

export default Index;
