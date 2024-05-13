"use client";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { skyTheme } from "../app/theme";
import Layout from "@/app/layout";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider theme={skyTheme}>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</ChakraProvider>
	);
}

export default MyApp;
