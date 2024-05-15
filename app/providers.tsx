import { ChakraProvider } from "@chakra-ui/react";
import { skyTheme } from "../app/theme";

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return <ChakraProvider theme={skyTheme}>{children}</ChakraProvider>;
};
