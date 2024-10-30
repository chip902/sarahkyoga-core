"use client";

import React, { useRef, useState, useEffect } from "react";
import ContentEditable from "react-contenteditable";
import { Box, Button, Input, HStack, useToast } from "@chakra-ui/react";
import TextEditorToolbar from "./TextEditorToolbar";
import { TextStyle, TextHistory } from "./types";
import { convert } from "html-to-text";
import PublishConfirmDialog from "../newsletter/PublishConfirmDialoge";

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

const DEFAULT_CONTENT = `

<style>
  .container {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    text-align: center;
  }
</style>
  <div class="container">
    <img alt="Logo" src="http://sarahkyoga.com/sky_banner.webp" style="max-width: 100%; height: auto; display: block; margin: auto;">
    <div><br></div>
  </div>
`;

const MAX_HISTORY = 100;

interface TextEditorProps {
	initialContent?: string;
	initialStyle?: TextStyle;
	initialSubject?: string;
	newsletterId?: string;
	onSave?: (data: { subject: string; content: string; style: TextStyle; isDraft: boolean }) => Promise<void>;
}

export default function TextEditor({
	initialContent = DEFAULT_CONTENT,
	initialStyle = DEFAULT_STYLE,
	initialSubject = "",
	newsletterId,
	onSave,
}: TextEditorProps) {
	const textEditorRef = useRef<HTMLDivElement>(null);
	const [subject, setSubject] = useState(initialSubject);
	const [content, setContent] = useState(initialContent);
	const [style, setStyle] = useState<TextStyle>(initialStyle);
	const [history, setHistory] = useState<TextHistory[]>([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const [isSaving, setIsSaving] = useState(false);
	const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
	const toast = useToast();

	useEffect(() => {
		setContent(initialContent);
		setSubject(initialSubject);
		if (textEditorRef.current) {
			textEditorRef.current.innerHTML = initialContent;
		}
		// Reset history when editing a new newsletter
		setHistory([{ content: initialContent, timestamp: new Date() }]);
		setHistoryIndex(0);
	}, [initialContent, initialSubject]);

	useEffect(() => {
		if (history.length === 0) {
			setHistory([{ content: initialContent, timestamp: new Date() }]);
			setHistoryIndex(0);
		}
	}, [initialContent]);

	useEffect(() => {
		// Add paste event listener to handle image centering
		const handlePaste = (e: ClipboardEvent) => {
			if (!textEditorRef.current) return;

			const items = e.clipboardData?.items;
			if (!items) return;

			for (let i = 0; i < items.length; i++) {
				if (items[i].type.indexOf("image") !== -1) {
					e.preventDefault();
					const file = items[i].getAsFile();
					if (!file) continue;

					const reader = new FileReader();
					reader.onload = (event) => {
						const img = document.createElement("img");
						img.src = event.target?.result as string;
						img.style.display = "block";
						img.style.margin = "0 auto";
						img.style.maxWidth = "100%";

						// Insert the centered image at cursor position
						const selection = window.getSelection();
						if (selection && selection.rangeCount > 0) {
							const range = selection.getRangeAt(0);
							range.deleteContents();
							range.insertNode(img);
							// Move cursor after image
							range.setStartAfter(img);
							range.setEndAfter(img);
							selection.removeAllRanges();
							selection.addRange(range);
						} else {
							textEditorRef.current?.appendChild(img);
						}

						updateHistory();
					};
					reader.readAsDataURL(file);
				}
			}
		};

		const editor = textEditorRef.current;
		if (editor) {
			editor.addEventListener("paste", handlePaste);
		}

		return () => {
			if (editor) {
				editor.removeEventListener("paste", handlePaste);
			}
		};
	}, []);

	const updateHistory = () => {
		if (!textEditorRef.current) return;

		const newContent = textEditorRef.current.innerHTML;
		setHistory((prev) => {
			const newHistory = [...prev.slice(0, historyIndex + 1), { content: newContent, timestamp: new Date() }].slice(-MAX_HISTORY);
			setHistoryIndex(newHistory.length - 1);
			return newHistory;
		});
	};

	const handleChange = (evt: React.FormEvent<HTMLDivElement>) => {
		setContent(evt.currentTarget.innerHTML);
		updateHistory();
	};

	const handleStyleChange = (newStyle: Partial<TextStyle>) => {
		if (!textEditorRef.current) return;
		textEditorRef.current.focus();

		const updatedStyle = { ...style, ...newStyle };
		setStyle(updatedStyle);

		if ("textAlign" in newStyle) {
			document.execCommand("justifyLeft", false, undefined);
			if (newStyle.textAlign === "center") {
				document.execCommand("justifyCenter", false, undefined);
			} else if (newStyle.textAlign === "right") {
				document.execCommand("justifyRight", false, undefined);
			}
		}

		if ("isBold" in newStyle) {
			document.execCommand("bold", false, undefined);
		}

		if ("isItalic" in newStyle) {
			document.execCommand("italic", false, undefined);
		}

		if ("isUnderline" in newStyle) {
			document.execCommand("underline", false, undefined);
		}

		if ("fontFamily" in newStyle && newStyle.fontFamily) {
			document.execCommand("fontName", false, newStyle.fontFamily);
		}

		if ("fontSize" in newStyle && newStyle.fontSize) {
			document.execCommand("fontSize", false, String(newStyle.fontSize));
		}

		if ("textColor" in newStyle && newStyle.textColor) {
			document.execCommand("foreColor", false, newStyle.textColor);
		}

		if ("backgroundColor" in newStyle && newStyle.backgroundColor) {
			document.execCommand("backColor", false, newStyle.backgroundColor);
		}

		updateHistory();
	};

	const handleUndo = () => {
		if (historyIndex > 0) {
			const newIndex = historyIndex - 1;
			setHistoryIndex(newIndex);
			setContent(history[newIndex].content);
			if (textEditorRef.current) {
				textEditorRef.current.innerHTML = history[newIndex].content;
			}
		}
	};

	const handleRedo = () => {
		if (historyIndex < history.length - 1) {
			const newIndex = historyIndex + 1;
			setHistoryIndex(newIndex);
			setContent(history[newIndex].content);
			if (textEditorRef.current) {
				textEditorRef.current.innerHTML = history[newIndex].content;
			}
		}
	};

	const handleCopy = () => {
		const text = convert(content, { wordwrap: 130 });
		navigator.clipboard.writeText(text).then(() => {
			toast({
				title: "Copied to clipboard",
				status: "success",
				duration: 2000,
				isClosable: true,
			});
		});
	};

	const handleClear = () => {
		if (textEditorRef.current) {
			textEditorRef.current.innerHTML = "";
			setContent("");
			setStyle(DEFAULT_STYLE);
			updateHistory();
		}
	};

	const handleSave = async (isDraft: boolean) => {
		if (!subject.trim()) {
			toast({
				title: "Subject is required",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			return;
		}
		if (!isDraft) {
			setIsSaving(true);
			setIsPublishDialogOpen(true);
			return;
		}
		setIsSaving(true);
		try {
			if (onSave) {
				await onSave({
					subject,
					content,
					style,
					isDraft,
				});
			} else {
				const endpoint = newsletterId ? `/api/newsletter/${newsletterId}` : "/api/newsletter";

				const method = newsletterId ? "PUT" : "POST";

				const response = await fetch(endpoint, {
					method,
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						subject,
						content,
						style,
						isDraft,
					}),
				});

				if (!response.ok) {
					throw new Error("Failed to save newsletter");
				}

				toast({
					title: `Newsletter ${isDraft ? "saved as draft" : "published"}`,
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			}
		} catch (error) {
			toast({
				title: "Error saving newsletter",
				description: error instanceof Error ? error.message : "Unknown error occurred",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Box className="text-editor">
			<Input
				placeholder="Newsletter Subject"
				value={subject}
				onChange={(e) => setSubject(e.target.value)}
				mb={4}
				size="lg"
				fontWeight="bold"
				bg="white"
				color="gray.800"
				_placeholder={{ color: "gray.400" }}
			/>

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

			<Box mt={4}>
				<ContentEditable
					innerRef={textEditorRef}
					html={content}
					onChange={handleChange}
					className="text-editor-content"
					style={{
						fontFamily: style.fontFamily,
						fontSize: `${style.fontSize}px`,
						fontWeight: style.isBold ? "bold" : "normal",
						fontStyle: style.isItalic ? "italic" : "normal",
						textDecoration: style.isUnderline ? "underline" : "none",
						textAlign: style.textAlign,
						color: style.textColor,
						backgroundColor: style.backgroundColor,
					}}
				/>
			</Box>

			<HStack mt={4} spacing={4}>
				<Button colorScheme="blue" onClick={() => handleSave(true)} isLoading={isSaving}>
					Save as Draft
				</Button>
				<Button colorScheme="green" onClick={() => handleSave(false)} isLoading={isSaving}>
					Publish
				</Button>
			</HStack>

			<Box mt={4} className="preview-content">
				<h3>Preview:</h3>
				<div
					dangerouslySetInnerHTML={{ __html: content }}
					style={{
						fontFamily: style.fontFamily,
						fontSize: `${style.fontSize}px`,
						color: style.textColor,
						backgroundColor: style.backgroundColor,
					}}
				/>
			</Box>
			<PublishConfirmDialog
				isOpen={isPublishDialogOpen}
				onClose={() => setIsPublishDialogOpen(false)}
				newsletter={{
					id: newsletterId || "",
					title: subject,
				}}
				onConfirm={() => handleSave(false)}
			/>
		</Box>
	);
}
