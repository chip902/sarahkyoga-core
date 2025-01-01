"use client";

import React, { useState } from "react";
import { Box, VStack } from "@chakra-ui/react";
import TextEditor from "../text-editor/TextEditor";
import { TextStyle } from "../text-editor/types";
import { toaster } from "@/src/components/ui/toaster";

interface NewsletterEditorProps {
	onSave: (title: string, content: string, style: TextStyle, isDraft: boolean) => void;
}

const DEFAULT_STYLE: TextStyle = {
	fontFamily: "Quicksand",
	fontSize: 16,
	isBold: false,
	isItalic: false,
	isUnderline: false,
	textAlign: "left",
	textColor: "#000000",
	backgroundColor: "#ffffff",
};

const NewsletterEditor: React.FC<NewsletterEditorProps> = ({ onSave }) => {
	const [style, setStyle] = useState<TextStyle>(DEFAULT_STYLE);

	const handleSave = async (data: { subject: string; content: string; style: TextStyle; isDraft: boolean }) => {
		if (!data.subject.trim()) {
			toaster.create({
				title: "Subject is required",
				type: "error",
				duration: 3000,
			});
			return;
		}
		onSave(data.subject, data.content, data.style, data.isDraft);
	};

	return (
		<VStack gap={4} align="stretch">
			<Box borderWidth={1} borderRadius="md">
				<TextEditor initialStyle={style} onSave={handleSave} />
			</Box>
		</VStack>
	);
};

export default NewsletterEditor;
