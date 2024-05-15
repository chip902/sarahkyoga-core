"use client";
import { font } from "./font";
import "@fontsource-variable/quicksand";
import "./globals.css";
import NavBar from "./NavBar";
import { Box } from "@chakra-ui/react";
import { Providers } from "./providers";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={font.quicksand.variable}>
			<body>
				<Providers>
					<NavBar />
					<Box as="main" mt="80px">
						{children}
					</Box>
				</Providers>
			</body>
		</html>
	);
}
