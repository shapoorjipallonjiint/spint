import LeadersBox from "./sections/LeadersBox";
import MembersSlider from "./sections/MembersSlider";
import PageHeader from "./sections/PageHeader";
import { leaderData } from "./data";
const Leadership = ({ data }) => {
  return (
    <>
      <PageHeader text={leaderData.title} />
      <LeadersBox data={leaderData.chairmanData} big={true} />
      <MembersSlider
        title={leaderData.dataPromoters.title}
        items={leaderData.dataPromoters.items}
        btmBorder={true}
      />
      <LeadersBox data={leaderData.chiefExData} big={false} />
      <LeadersBox data={leaderData.seniorViceData} big={false} />
      <MembersSlider
        title={leaderData.coreLeadershipTeam.title}
        items={leaderData.coreLeadershipTeam.items}
      />
      <div className="mb-80px"></div>
    </>
  );
};

export default Leadership;
