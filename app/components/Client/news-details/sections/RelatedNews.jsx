'use client';
// import { pressReleases } from "../../press-release/data";
import { motion } from "framer-motion";
import { moveUp } from "../../../motionVarients";
import H2Title from "../../../../components/common/H2Title";
import Image from "next/image";
import { useApplyLang } from "@/lib/applyLang";
import useIsPreferredLanguageArabic from "@/lib/getPreferredLanguage";
import LangLink from "@/lib/LangLink";

const RelatedNews = ({ allNewsData, topic, slug }) => {
  const tAllNewsData = useApplyLang(allNewsData);
  const tTopic = useApplyLang(topic);
  const isArabic = useIsPreferredLanguageArabic();

  const filteredNews = tAllNewsData.filter((item) => (
    item.topic._id == tTopic._id
  )).filter((item) => item.slug !== slug)

  return (
    <section>
      <div className="pb30">
        <div className="container relative ">
          <H2Title titleText="Related News" marginClass="mb-4 xl:mb-17" />
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-x-30px gap-y-10 md:gap-y-15 xl:gap-y-30 ">
            {filteredNews.map((item, index) => (
              <LangLink href={`/press-releases/${item.slug}`} key={index}>
                <motion.div variants={moveUp(0.2 * index)} initial="hidden" whileInView="show" viewport={{ amount: 0.2, once: true }} key={item.id}
                  className=" border-b border-black/20 pb-5 lg:border-b-0 lg:pb-0">
                  <Image src={item.thumbnail} alt={item.thumbnailAlt} width={520} height={339} className="w-full h-[200px] md:h-[250px] lg:h-[300px] 2xl:h-[339px] object-cover" />
                  <div className="pt-5">
                    <div
                      className={`flex items-center justify-between pt-3 pb-2 lg:pt-[14px] lg:pb-[13px] bg-f5f5
    ${isArabic
                          ? "pr-3 pl-3 lg:pr-[23.15px] lg:pl-[23.17px]"
                          : "pl-3 pr-3 lg:pl-[23.15px] lg:pr-[23.17px]"
                        }
  `}
                    >

                      <h4 className="text-paragraph text-14 xl:text-16 font-light leading-[1.75] uppercase">{new Date(item.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}</h4>
                      <h4 className="text-paragraph text-14 xl:text-16 font-light leading-[1.75] uppercase">{item.topic.name}</h4>
                    </div>

                    <h3 className="text-20 2xl:text-29 leading-[1.344827586206897] font-light text-5 mt-3 md:mt-4 2xl:mt-30px xl:max-w-[90%]">{item.title}</h3>

                  </div>
                </motion.div>
              </LangLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};


export default RelatedNews;
