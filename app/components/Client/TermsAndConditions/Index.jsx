"use client";
import Banner from "../../common/Banner";
import { useApplyLang } from "@/lib/applyLang";
import TermsContent from "./sections/TermsContent";

// shown until a banner image is uploaded in the admin (Terms and Conditions > Banner)
const FALLBACK_BANNER = "/assets/images/about-us/about-banner.jpg";

const TermsAndConditions = ({ data }) => {
  // picks the _ar fields on the Arabic site, falling back to English when an Arabic field is empty
  const t = useApplyLang(data || {});

  return (
    <>
      <Banner
        title={t.pageTitle || "Terms and Conditions"}
        image={data?.banner || FALLBACK_BANNER}
        imageAlt={t.bannerAlt || t.pageTitle || "Terms and Conditions"}
        data={{ ...data, banner: data?.banner || FALLBACK_BANNER }}
      />

      <TermsContent content={t.content} />
    </>
  );
};

export default TermsAndConditions;
