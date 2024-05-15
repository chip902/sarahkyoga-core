import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { skyTheme } from "../app/theme";
import Layout from "../app/ClientLayout";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
