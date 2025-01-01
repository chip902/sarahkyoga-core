"use client";
import { Box, Container, HStack, Icon, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { LuCookie } from "react-icons/lu";
import { Button } from "@/src/components/ui/button";
import { useEffect, useState } from "react";
import NextLink from "next/link";

const PrivacyBanner = () => {
	const { open, onToggle } = useDisclosure();
	const [isCookieChecked, setIsCookieChecked] = useState(false);

	useEffect(() => {
		if (!isCookieChecked) {
			if (!document.cookie.includes("_cookiesAccepted")) {
				onToggle();
			}
			setIsCookieChecked(true);
		}
	}, [isCookieChecked, onToggle]);

	const handleAcceptCookies = () => {
		const expires = new Date();
		expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000);
		document.cookie = `_cookiesAccepted=true;expires=${expires.toUTCString()};path=/`;
		onToggle();
	};

	return (
		<Box borderBottomWidth="1px" bg="bg.panel">
			<Container py={{ base: "4", md: "3.5" }}>
				<Stack gap="4" justifyContent={{ base: "start", md: "space-between" }} flexDirection={{ base: "column", md: "row" }}>
					<Stack direction={{ base: "column", md: "row" }} alignItems={{ base: "start", md: "center" }} gap={{ base: "1", md: "2" }}>
						<HStack gap="2">
							<Icon size="md">
								<LuCookie />
							</Icon>
							<Text fontWeight="medium" display={{ md: "none" }}>
								Cookie Consent
							</Text>
						</HStack>
						<Text color="fg.muted">
							We use third-party cookies in order to personalise your experience. Read our{" "}
							<NextLink href="/privacy-policy">Cookie Policy</NextLink>.
						</Text>
					</Stack>
					<HStack gap="3">
						<Button variant="outline" colorPalette="gray">
							Reject
						</Button>
						<Button>Allow</Button>
					</HStack>
				</Stack>
			</Container>
		</Box>
	);
};

export default PrivacyBanner;
