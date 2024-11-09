import { ChakraProvider } from "@chakra-ui/react";
import { skyTheme } from "./theme";
import { SessionProvider } from "next-auth/react";
import QueryClientProvider from "./QueryClientProvider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<ChakraProvider theme={skyTheme}>
			<QueryClientProvider>
				<SessionProvider>{children}</SessionProvider>
			</QueryClientProvider>
		</ChakraProvider>
	);
};
