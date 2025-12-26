import ContactDetails from "./sections/ContactDetails";
import RegionalOffices from "./sections/RegionalOffices";

const Index = ({data}) => {
    return (
        <>
            <ContactDetails data={data} />
            <RegionalOffices data={data.secondSection}/>
        </>
    );
};

export default Index;
