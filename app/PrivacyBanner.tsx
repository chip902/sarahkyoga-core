import { useEffect, useState } from "react";
import { Box, Button, Slide, Text, useDisclosure } from "@chakra-ui/react";
import NextLink from "next/link";

const PrivacyBanner = () => {
	const { isOpen, onToggle } = useDisclosure();
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
		<Slide direction="bottom" in={isOpen} style={{ zIndex: 10 }}>
			<Box flexDirection="row" p="40px" color="white" mt="4" bg="brand.800" rounded="md" shadow="md">
				<Text mb={5}>
					This website uses cookies to improve your experience. We will assume you accept this policy as long as you are using this website.
				</Text>
				<Button mx={10} onClick={handleAcceptCookies}>
					Accept Cookies
				</Button>
				<Button as={NextLink} href="/privacy-policy">
					Privacy Policy
				</Button>
			</Box>
		</Slide>
	);
};

export default PrivacyBanner;
