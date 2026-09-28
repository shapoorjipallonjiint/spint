// import SplitTextAnimation from "@/app/components/Animations/ClientAnimations/SplitTextAnimation"
import SplitTextAnimation from "../../../common/SplitTextAnimation"
const PageHeader = ({ text }) => {
    return (
        <section className="mt-80px">
            <div className="container">
                 <h1 className="text-70 font-light leading-[1.071428571428571] pb-20px border-b border-black/20">
              <SplitTextAnimation children={text} staggerDelay={0.2} animationDuration={0.8} delay={0.2}/>
            </h1>
            </div>
        </section>
    )
}

export default PageHeader   