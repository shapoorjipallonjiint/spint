import Banner from "../../common/Banner";
import EmpoweringCommunities from "./sections/EmpoweringCommunities";
import FocusArea from "./sections/FocusArea";
import HighlightedProgramsSlider from "./sections/HighlightedProgramsSlider";
// import { engineeringData } from "./data";
import EmployeeInvolvementSlider from "./sections/EmployeeInvolvementSlider";

const Index = ({data}) => {
  
    return (
        <>
            <Banner title={data.pageTitle} image={data.banner} imageAlt={data.bannerAlt} />
            <EmpoweringCommunities data={data.firstSection} />
            <FocusArea data={data.secondSection} />
            <HighlightedProgramsSlider data={data.thirdSection} />
            <EmployeeInvolvementSlider data={data.fourthSection} />
        </>
    );
};

export default Index;
