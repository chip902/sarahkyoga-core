import { ChakraProvider } from "@chakra-ui/react";
import { skyTheme } from "../app/theme";
import Fonts from "../app/fonts";

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<ChakraProvider theme={skyTheme}>
			<Fonts />
			{children}
		</ChakraProvider>
	);
};
