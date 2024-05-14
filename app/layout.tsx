"use client";
import { font } from "./font";
import "@fontsource-variable/quicksand";
import "./globals.css";
import NavBar from "./NavBar";
import { Box } from "@chakra-ui/react";
import ServerLayout from "./server-layout";
import { Providers } from "./providers";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={font.quicksand.variable}>
			<body>
				<ServerLayout>
					<Providers>
						<NavBar />
						<Box as="main">{children}</Box>
					</Providers>
				</ServerLayout>
			</body>
		</html>
	);
}
