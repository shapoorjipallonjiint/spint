import Banner from "./sections/Banner";
import LeadersBox from "./sections/LeadersBox";
// import { leaderData } from "./data";
import CoreLeardershipTeam from "./sections/CoreLeardershipTeam";

const Leadership = ({data}) => {
  return ( 
    <>
      <Banner title={data?.pageTitle} subTitle={data?.pageSubTitle} description={data?.pageDescription} />
      <LeadersBox data={data.firstSection} />
      <CoreLeardershipTeam data={data.secondSection}/>
    </>
   );
}
 
export default Leadership;