import React from "react";
import { Container } from "@chakra-ui/react";
import TextEditor from "./TextEditor";

const Newsletter = () => {
	return (
		<Container my="300px" bgColor="white" padding={9}>
			<TextEditor />
		</Container>
	);
};

export default Newsletter;
