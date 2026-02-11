import Banner from "./sections/Banner";
import LeadersBox from "./sections/LeadersBox";
// import { leaderData } from "./data";
import CoreLeardershipTeam from "./sections/CoreLeardershipTeam";
import Promoters from "./sections/Promoters";
import ManagementBoard from "./sections/ManagementBoard";
const Leadership = ({ data }) => {
  return (
    <>
      <Banner data={data} />
      <LeadersBox data={[data.firstSection.items[0]]} />
      <Promoters data={data.thirdSection} />
      <ManagementBoard data={data.fourthSection} />
      <LeadersBox data={data.firstSection.items.slice(1,)} />
      <CoreLeardershipTeam data={data.secondSection} />
    </>
  );
}

export default Leadership;