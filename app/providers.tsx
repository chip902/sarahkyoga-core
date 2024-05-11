"use client";
import { ChakraProvider } from "@chakra-ui/react";
import { skyTheme } from "./theme";
export function Providers({ children }: { children: React.ReactNode }) {
	return <ChakraProvider theme={skyTheme}>{children}</ChakraProvider>;
}
