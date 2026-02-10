import Banner from "./sections/Banner";
import LeadersBox from "./sections/LeadersBox";
 import { leaderData } from "./data";
import CoreLeardershipTeam from "./sections/CoreLeardershipTeam";
import Promoters from "./sections/Promoters";
const Leadership = ({data}) => {
  return ( 
    <>
      <Banner data={data}/>
      <LeadersBox data={leaderData.leadersDetails} />
      <Promoters data={leaderData.coreLeadershipData}/>
      <LeadersBox data={leaderData.ChairmanDetails} />
      <CoreLeardershipTeam data={data.secondSection}/>

      
    </>
   );
}
 
export default Leadership;