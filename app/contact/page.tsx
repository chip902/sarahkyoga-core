import { Spacer } from "@chakra-ui/react";
import ContactForm from "./ContactForm";

const Contact = () => {
	return (
		<>
			<Spacer h={{ base: "10vh", lg: "25vh" }} />
			<ContactForm />
		</>
	);
};

export default Contact;
