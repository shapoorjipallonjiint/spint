// The certification badge a project card shows: the shared badge picked from Projects > Certifications
// (certificationBadgeId). No id, or the badge was deleted = no badge.
export type CertificationBadgeLite = {
  _id: unknown;
  name?: string;
  image?: string;
  alt?: string;
  alt_ar?: string;
};

export const resolveCertificationBadge = (
  project: { certificationBadgeId?: string | null },
  badges: Map<string, CertificationBadgeLite>
) => {
  const badge = project?.certificationBadgeId ? badges.get(String(project.certificationBadgeId)) : undefined;
  return {
    certificationBadge: badge?.image || "",
    certificationBadgeAlt: badge?.alt || badge?.name || "",
    certificationBadgeAlt_ar: badge?.alt_ar || "",
  };
};
