"use client";
import { font } from "./font";
import "@fontsource-variable/quicksand";
import "./globals.css";
import NavBar from "./NavBar";
import { Box } from "@chakra-ui/react";
import { Providers } from "./providers";
import PrivacyBanner from "./PrivacyBanner";
import useResponsive from "./hooks/useResponsive";
import ShoppingCartPopout from "./components/ShoppingCartPopout";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
	const isResponsive = useResponsive();
	return (
		<html lang="en" className={font.quicksand.variable}>
			<body>
				<Providers>
					<NavBar isResponsive={isResponsive} />
					<Box as="main" mt="80px">
						{children}
					</Box>
					<PrivacyBanner />
					{isResponsive && (
						<Box position="fixed" bottom={4} right={4} zIndex={10}>
							<ShoppingCartPopout isResponsive={isResponsive} />
						</Box>
					)}
				</Providers>
			</body>
		</html>
	);
}
