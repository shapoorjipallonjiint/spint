import Banner from "../../common/Banner";
import ExpandingHorizons from "./sections/ExpandingHorizons";
import Horizons from "./sections/Horizons";
// import { globalPresenceData } from "./data";

const Index = ({ data }) => {
    return (
        <>
            <Banner title={data.pageTitle} image={data.banner} imageAlt={data.bannerAlt} />
            <ExpandingHorizons data={data.firstSection} />
            <Horizons data={data.secondSection} />
        </>
    );
};

export default Index;
