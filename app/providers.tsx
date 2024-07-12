import { ChakraProvider } from "@chakra-ui/react";
import { skyTheme } from "../app/theme";
import { SessionProvider } from "next-auth/react";

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<ChakraProvider theme={skyTheme}>
			<SessionProvider>{children}</SessionProvider>
		</ChakraProvider>
	);
};
