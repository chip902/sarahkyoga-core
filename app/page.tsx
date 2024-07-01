"use client";
import { Button, useToast, Wrap } from "@chakra-ui/react";
import NextLink from "next/link";
import { useEffect } from "react";

export default function Home() {
	const toast = useToast();
	useEffect(() => {
		toast({
			title: "Site Under Construction",
			description: (
				<Wrap>
					Hey there! I&apos;m working to make this site even better for you. Thank you for your patience while we wait for the saw dust to clear. If
					you want to reach me for a Private class,
					<NextLink href="/contact" passHref legacyBehavior>
						<Button variant="outline"> contact me here!</Button>
					</NextLink>
				</Wrap>
			),
			position: "top",
			status: "info",
			isClosable: true,
			colorScheme: "orange",
		});
	}, [toast]);

	return <></>;
}
