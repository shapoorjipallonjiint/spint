import Banner from "./sections/Banner"; 
import MoreDetrails from "./sections/MoreDetrails"; 
import RelatedNews from "./sections/RelatedNews"; 
const Index = ({newsData,allNewsData}) => {
    console.log(allNewsData)
  return (
    <>
      {/* <header>
        <MainNavbar />
      </header> */}
      <main>
        <Banner newsData={newsData}/> 
        <MoreDetrails data={newsData.content}/> 
        <RelatedNews allNewsData={allNewsData.news} topic={newsData.topic.name} slug={newsData.slug}/> 
      </main>
      {/* <footer>
        <Footer />
      </footer> */}
    </>
  );
};

export default Index;
