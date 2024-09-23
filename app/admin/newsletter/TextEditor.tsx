"use client";
import { ElementType, useState } from "react";
import { Box, Textarea, Button, Select } from "@chakra-ui/react";
import React from "react";

export default function TextEditor() {
	const [text, setText] = useState("");
	const [fontFamily, setFontFamily] = useState("Arial");
	const [fontSize, setFontSize] = useState(16);
	const [headingLevel, setHeadingLevel] = useState<number>(1);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setText(e.target.value);
	};

	return (
		<Box p={5} shadow="md" borderWidth="1px">
			<Select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} mb={4}>
				<option value="Arial">Arial</option>
				<option value="Courier New">Courier New</option>
				<option value="Quicksand">Quicksand</option>
				<option value="Times New Roman">Times New Roman</option>
			</Select>

			<Select value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} mb={4}>
				{[12, 14, 16, 18, 20, 24, 30].map((size) => (
					<option key={size} value={size}>
						{size}
					</option>
				))}
			</Select>

			<Select value={headingLevel} onChange={(e) => setHeadingLevel(Number(e.target.value))} mb={4}>
				<option value="">None</option>
				{[1, 2, 3, 4, 5, 6].map((level) => (
					<option key={level} value={String(level)}>
						Heading {level}
					</option>
				))}
			</Select>

			<Textarea
				value={text}
				onChange={handleChange}
				placeholder="Start typing..."
				size="lg"
				resize="none"
				mb={4}
				fontFamily={fontFamily}
				fontSize={`${fontSize}px`}
			/>

			<Button colorScheme="blue" onClick={() => console.log(text)}>
				Save Text
			</Button>
		</Box>
	);
}
