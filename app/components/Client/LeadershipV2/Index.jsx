"use client";

import LeadersBox from "./sections/LeadersBox";
import MembersSlider from "./sections/MembersSlider";
import PageHeader from "./sections/PageHeader";
import { useApplyLang } from "@/lib/applyLang";

// Content from admin: Leadership > leadershipPage (title, leaders, promoters, core team).
// The first leader is shown large above "Promoters", the other leaders after it.
const Leadership = ({ data }) => {
  const page = useApplyLang(data?.leadershipPage || {});
  if (!data?.leadershipPage) return null;

  const [firstLeader, ...otherLeaders] = page.leaders || [];

  return (
    <>
      <PageHeader text={page.title} />
      {firstLeader && <LeadersBox data={firstLeader} big={true} />}
      <MembersSlider
        title={page.promoters?.title}
        items={page.promoters?.items || []}
        btmBorder={true}
      />
      {otherLeaders.map((leader, index) => (
        <LeadersBox key={leader._id || index} data={leader} big={false} />
      ))}
      <MembersSlider
        title={page.coreTeam?.title}
        items={page.coreTeam?.items || []}
      />
      <div className="mb-80px"></div>
    </>
  );
};

export default Leadership;
