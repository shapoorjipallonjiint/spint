import { mepData } from "../data";
import H2Title from "../../common/H2Title";
const OurApproach = ({data}) => {
  return (
    <section className="py-20 xl:py-30">
      <div className="container">
        <H2Title titleText="Our Approach" titleColor="black" marginClass="mb-50px" />
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-30px">
          {
            data.items.map((item,index)=>(
                <div key={index}>
                  <div className="border-b border-cmnbdr pb-8">
                    <img src={item.icon} alt="" />
                  </div>
                  <div className="pt-5 xl:pt-8">
                  <h3 className="text-29 leading-[1.344827586206897] font-light mb-2 md:mb-3 xl:mb-[15px]">{item.title}</h3>
                  <p className="text-paragraph text-19 leading-[1.473684210526316] font-light">{item.desc}</p>
                  </div>
                </div>
              ))
          }
        </div>
      </div>
    </section>
  );
}

export default OurApproach;