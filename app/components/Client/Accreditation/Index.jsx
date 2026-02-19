import Banner from "./sections/Banner";
import Certificates from "./sections/Certificates";


const Accreditation = ({ data }) => {
  return (
    <>
      <Banner data={data} />
      <Certificates data={data.categories} />
    </>
  );
}

export default Accreditation;