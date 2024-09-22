import React from "react";
import { Container } from "@chakra-ui/react";
import NewsletterComponent from "./NewsletterComponent";

const Newsletter = () => {
	return (
		<Container my="300px" bgColor="white" padding="10px">
			<NewsletterComponent />
		</Container>
	);
};

export default Newsletter;
