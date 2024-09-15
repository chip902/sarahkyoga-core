import React from "react";
import NewsletterWriter from "./NewsletterComponent";
import { Container } from "@chakra-ui/react";

const Newsletter = () => {
	return (
		<Container my="300px" bgColor="white">
			<NewsletterWriter />
		</Container>
	);
};

export default Newsletter;
