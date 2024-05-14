import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { skyTheme } from "../app/theme";
import Fonts from "../app/fonts";
import Layout from "../app/layout";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider theme={skyTheme}>
			<Fonts />
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</ChakraProvider>
	);
}

export default MyApp;
