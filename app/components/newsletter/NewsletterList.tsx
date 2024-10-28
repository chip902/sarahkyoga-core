import React from "react";
import { Box, VStack, Text, Button, Flex } from "@chakra-ui/react";
import { format } from "date-fns";
import { TextStyle } from "../text-editor/types";

interface Newsletter {
	id: string;
	title: string;
	content: string;
	createdAt: Date;
	isDraft: boolean;
	style: TextStyle;
}

interface NewsletterListProps {
	newsletters: Newsletter[];
	onEdit: (newsletter: Newsletter) => void;
}

const NewsletterList: React.FC<NewsletterListProps> = ({ newsletters, onEdit }) => {
	return (
		<VStack spacing={4} align="stretch">
			{newsletters.map((newsletter) => (
				<Box key={newsletter.id} borderWidth={1} borderRadius="md" p={4} bg="white" shadow="sm" _hover={{ shadow: "md" }} transition="box-shadow 0.2s">
					<Flex justify="space-between" align="center">
						<Box flex={1}>
							<Text fontWeight="bold" fontSize="lg" mb={2}>
								{newsletter.title}
							</Text>
							<Text fontSize="sm" color="gray.500" mb={2}>
								{format(new Date(newsletter.createdAt), "PPP")}
							</Text>
							<Text fontSize="sm" color={newsletter.isDraft ? "orange.500" : "green.500"} fontWeight="medium">
								{newsletter.isDraft ? "Draft" : "Published"}
							</Text>
						</Box>
						<Button colorScheme={newsletter.isDraft ? "blue" : "gray"} onClick={() => onEdit(newsletter)} ml={4}>
							{newsletter.isDraft ? "Edit" : "View"}
						</Button>
					</Flex>
				</Box>
			))}
			{newsletters.length === 0 && (
				<Box p={8} textAlign="center" color="gray.500" borderWidth={1} borderRadius="md" borderStyle="dashed">
					No newsletters found
				</Box>
			)}
		</VStack>
	);
};

export default NewsletterList;
