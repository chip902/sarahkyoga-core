import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
import NextLink from "next/link";

const PrivacyPolicy = () => {
	return (
		<Container bgColor="white" maxW="5xl">
			<Box p="4" borderWidth="2xl" borderRadius="2xl" boxShadow="2xl">
				<Heading mt={20} textTransform="uppercase" as="h1" size="lg" mb="6">
					Privacy Policy
				</Heading>
				<Heading textTransform="uppercase" as="h2" size="md" mb="6" mt="4">
					Who we are
				</Heading>
				<VStack>
					<Text>Our website address is: https://sarahkyoga.com</Text>
				</VStack>
				<Heading textTransform="uppercase" as="h2" size="lg" mb="6" mt="4">
					WHAT DATA WE COLLECT AND WHY
				</Heading>
				<Heading textTransform="uppercase" as="h3" size="md" mb="6" mt="4">
					Comments
				</Heading>
				<VStack>
					<Text>
						When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor&apos;s IP address and
						browser user agent string to help spam detection.
					</Text>
					<Text>
						An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are
						using it. The Gravatar service privacy policy is available here:{" "}
						<NextLink href="https://automattic.com/privacy/">https://automattic.com/privacy/</NextLink>. After approval of your comment, your
						profile picture is visible to the public in the context of your comment.
					</Text>
				</VStack>
				<Heading textTransform="uppercase" as="h3" size="md" mb="6" mt="4">
					Media
				</Heading>
				<VStack>
					<Text>
						If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the
						website can download and extract any location data from images on the website.
					</Text>
				</VStack>
				<Heading textTransform="uppercase" as="h3" size="md" mb="6" mt="4">
					Contact Form and Cookies
				</Heading>
				<VStack>
					<Text>
						If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your
						convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.
					</Text>
					<Text>
						If you visit our login page, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no
						personal data and is discarded when you close your browser.
					</Text>
					<Text>
						When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last
						for two days, and screen options cookies last for a year. If you select “Remember Me”, your login will persist for two weeks. If you log
						out of your account, the login cookies will be removed.
					</Text>
					<Text>
						If you edit or publish an article, an additional cookie will be saved in your browser. This cookie includes no personal data and simply
						indicates the post ID of the article you just edited. It expires after 1 day.
					</Text>
				</VStack>
				<Heading textTransform="uppercase" as="h3" size="md" mb="6" mt="4">
					EMBEDDED CONTENT FROM OTHER WEBSITES
				</Heading>
				<VStack>
					<Text>
						Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves
						in the exact same way as if the visitor has visited the other website.
					</Text>
					<Text>
						These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that
						embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that
						website.
					</Text>
				</VStack>
				<Heading textTransform="uppercase" as="h3" size="md" mb="6" mt="4">
					ANALYTICS
				</Heading>
				<VStack>
					<Text>
						We may use third-party analytics services, such as Google Analytics, to collect and analyze data about your use of our Website. These
						services may use cookies and similar technologies to collect and store information about your online activities over time and across
						different websites.
					</Text>
				</VStack>
				<Heading textTransform="uppercase" as="h3" size="md" mb="6" mt="4">
					WHO WE SHARE YOUR DATA WITH AND HOW LONG WE RETAIN YOUR DATA
				</Heading>
				<VStack>
					<Text>
						If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up
						comments automatically instead of holding them in a moderation queue.
					</Text>
					<Text>
						For users that register on our website (if any), we also store the personal information they provide in their user profile. All users
						can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can
						also see and edit that information.
					</Text>
				</VStack>
				<Heading textTransform="uppercase" as="h3" size="md" mb="6" mt="4">
					WHAT RIGHTS YOU HAVE OVER YOUR DATA
				</Heading>
				<VStack>
					<Text>
						If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold
						about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does
						not include any data we are obliged to keep for administrative, legal, or security purposes. Email{" "}
						<NextLink href="mailto:admin@chip-hosting.com">admin@chip-hosting.com</NextLink> with any such requests.
					</Text>
				</VStack>
				<Heading textTransform="uppercase" as="h3" size="md" mb="6" mt="4">
					WHERE WE SEND YOUR DATA
				</Heading>
				<VStack>
					<Text>Visitor comments may be checked through an automated spam detection service. Performance data can be collected</Text>
				</VStack>
			</Box>
		</Container>
	);
};

export default PrivacyPolicy;
