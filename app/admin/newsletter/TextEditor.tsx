"use client";

import React, { useRef, useState, useEffect } from "react";
import ContentEditable from "react-contenteditable";
import { Box, Button, useToast } from "@chakra-ui/react";
import { convert } from "html-to-text";
import TextEditorToolbar from "./TextEditorToolbar";
import { TextStyle, TextHistory } from "@/types";

const MAX_HISTORY = 100;

export default function TextEditor() {
	const textEditorRef = useRef<HTMLDivElement>(null);
	const [text, setText] = useState("");
	const [style, setStyle] = useState<TextStyle>({
		fontFamily: "Quicksand",
		fontSize: 16,
		isBold: false,
		isItalic: false,
		isUnderline: false,
		textAlign: "left",
		textColor: "#000000",
		backgroundColor: "#ffffff",
	});

	const [history, setHistory] = useState<TextHistory[]>([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const toast = useToast();

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "z") {
				e.preventDefault();
				if (e.shiftKey) {
					handleRedo();
				} else {
					handleUndo();
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [history, historyIndex]);

	const addToHistory = (content: string) => {
		const newHistory = history.slice(0, historyIndex + 1);
		newHistory.push({ content, timestamp: new Date() });

		if (newHistory.length > MAX_HISTORY) {
			newHistory.shift();
		}

		setHistory(newHistory);
		setHistoryIndex(newHistory.length - 1);
	};

	const handleUndo = () => {
		if (historyIndex > 0) {
			const newIndex = historyIndex - 1;
			setText(history[newIndex].content);
			setHistoryIndex(newIndex);
		}
	};

	const handleRedo = () => {
		if (historyIndex < history.length - 1) {
			const newIndex = historyIndex + 1;
			setText(history[newIndex].content);
			setHistoryIndex(newIndex);
		}
	};

	const applyStyleToSelection = (newStyle: Partial<TextStyle>) => {
		if (!textEditorRef.current) return;

		const selection = window.getSelection();
		if (!selection?.rangeCount) return;

		const range = selection.getRangeAt(0);
		if (textEditorRef.current.contains(range.commonAncestorContainer)) {
			const span = document.createElement("span");

			Object.entries(newStyle).forEach(([key, value]) => {
				switch (key) {
					case "fontFamily":
						if (typeof value === "string") {
							span.style.fontFamily = value;
						}
						break;
					case "fontSize":
						if (typeof value === "number") {
							span.style.fontSize = `${value}px`;
						}
						break;
					case "isBold":
						if (typeof value === "boolean") {
							span.style.fontWeight = value ? "bold" : "normal";
						}
						break;
					case "isItalic":
						if (typeof value === "boolean") {
							span.style.fontStyle = value ? "italic" : "normal";
						}
						break;
					case "isUnderline":
						if (typeof value === "boolean") {
							span.style.textDecoration = value ? "underline" : "none";
						}
						break;
					case "textAlign":
						if (typeof value === "string") {
							let node = range.commonAncestorContainer;
							while (node && node !== textEditorRef.current) {
								if (node.nodeType === Node.ELEMENT_NODE) {
									(node as HTMLElement).style.textAlign = value;
								}
								node = node.parentNode as Node;
							}
						}
						break;
					case "textColor":
						if (typeof value === "string") {
							span.style.color = value;
						}
						break;
					case "backgroundColor":
						if (typeof value === "string") {
							span.style.backgroundColor = value;
						}
						break;
				}
			});

			if (range.collapsed) {
				span.appendChild(document.createTextNode("\u200B"));
				range.insertNode(span);
				range.setStartAfter(span);
			} else {
				range.surroundContents(span);
			}

			selection.removeAllRanges();
			selection.addRange(range);

			updateText();
		}
	};

	const updateText = () => {
		if (textEditorRef.current) {
			const newText = textEditorRef.current.innerHTML;
			setText(newText);
			addToHistory(newText);
		}
	};

	const handleStyleChange = (newStyle: Partial<TextStyle>) => {
		setStyle({ ...style, ...newStyle });
		applyStyleToSelection(newStyle);
	};

	const handleChange = (evt: React.FormEvent<HTMLDivElement>) => {
		const newText = evt.currentTarget.innerHTML;
		setText(newText);
		addToHistory(newText);
	};

	const handleCopy = async () => {
		const plainText = convert(text, {
			wordwrap: 130,
			preserveNewlines: true,
		});

		try {
			await navigator.clipboard.writeText(plainText);
			toast({
				title: "Copied to clipboard",
				status: "success",
				duration: 2000,
			});
		} catch (err) {
			toast({
				title: "Failed to copy",
				status: "error",
				duration: 2000,
			});
		}
	};

	const handleClear = () => {
		setText("");
		addToHistory("");
	};

	const handleSave = () => {
		// TODO: Implement save functionality
		console.log(text);
		toast({
			title: "Content saved",
			status: "success",
			duration: 2000,
		});
	};

	return (
		<Box bg="white" p={6} borderRadius="lg" boxShadow="lg">
			<TextEditorToolbar
				style={style}
				onStyleChange={handleStyleChange}
				onUndo={handleUndo}
				onRedo={handleRedo}
				onCopy={handleCopy}
				onClear={handleClear}
				canUndo={historyIndex > 0}
				canRedo={historyIndex < history.length - 1}
			/>

			<Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="md" mt={4}>
				<ContentEditable
					html={text}
					onChange={handleChange}
					tagName="div"
					style={{
						minHeight: "300px",
						padding: "16px",
						outline: "none",
						backgroundColor: "#ffffff",
						color: "#000000",
						fontFamily: style.fontFamily,
						fontSize: `${style.fontSize}px`,
					}}
					innerRef={textEditorRef}
				/>
			</Box>

			<Button mt={4} colorScheme="blue" onClick={handleSave}>
				Save Content
			</Button>

			<Box mt={6} p={4} borderRadius="md" bg="white">
				<h2 className="text-xl font-semibold mb-2 text-gray-900">Preview</h2>
				<div className="prose max-w-none text-gray-900 text-editor-content" dangerouslySetInnerHTML={{ __html: text }} />
			</Box>
		</Box>
	);
}
