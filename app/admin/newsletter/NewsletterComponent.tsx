"use client";
import "react-quill/dist/quill.snow.css";
import React, { useEffect, useState, useRef } from "react";
import Select from "react-select";
import axios from "axios";
import { Button, Spinner } from "@chakra-ui/react";

interface UserOption {
	value: string;
	label: string;
}

const fonts = [
	{ value: "arial", label: "Arial" },
	{ value: "georgia", label: "Georgia" },
	{ value: "quicksand", label: "Quicksand" },
];

const NewsletterWriter: React.FC = () => {
	const [content, setContent] = useState<string>("");
	const [userOptions, setUserOptions] = useState<UserOption[]>([]);
	const [selectedUsers, setSelectedUsers] = useState<UserOption[]>([]);
	const quillRef = useRef<any>(null);
	const [ReactQuill, setReactQuill] = useState<any>(null);

	// Define modules and formats here
	const [modules, setModules] = useState<any>(null);
	const [formats, setFormats] = useState<string[]>([]);

	useEffect(() => {
		// Fetch users from the API
		const fetchUsers = async () => {
			try {
				const response = await axios.get<UserOption[]>("/api/users");
				const options = response.data.map((user: any) => ({
					value: user.id,
					label: user.email,
				}));
				setUserOptions(options);
			} catch (err) {
				console.error(err);
			}
		};
		fetchUsers();

		// Dynamically import ReactQuill and Quill
		const importEditors = async () => {
			if (typeof window !== "undefined") {
				const { default: RQ } = await import("react-quill");
				const Quill = (await import("quill")).default;

				// Register fonts with Quill
				const Font = Quill.import("formats/font");
				const fontWhitelist = fonts.map((font) => font.value);
				Font.whitelist = fontWhitelist;
				Quill.register(Font, true);

				console.log("Font whitelist:", Font.whitelist);

				// Define the toolbar options
				const toolbarOptions = [
					[{ font: fonts.map((option) => option.value) }],
					[{ header: [1, 2, 3, 4, 5, 6, false] }],
					["bold", "italic", "underline", "strike"],
					[{ color: [] }, { background: [] }],
					[{ align: [] }],
					["blockquote", "code-block"],
					[{ list: "ordered" }, { list: "bullet" }],
					["link", "image"],
					["clean"],
				];

				// Implement the image handler
				const imageHandler = () => {
					const editor = quillRef.current.getEditor();

					const input = document.createElement("input");
					input.setAttribute("type", "file");
					input.setAttribute("accept", "image/*");
					input.click();

					input.onchange = async () => {
						const file = input.files ? input.files[0] : null;
						if (file) {
							const formData = new FormData();
							formData.append("image", file);

							try {
								const response = await axios.post("/api/upload", formData, {
									headers: {
										"Content-Type": "multipart/form-data",
									},
								});
								const imageUrl = response.data.url;
								const range = editor.getSelection();
								editor.insertEmbed(range.index, "image", imageUrl);
							} catch (err) {
								console.error(err);
							}
						}
					};
				};

				// Set the modules and formats
				setModules({
					toolbar: {
						container: toolbarOptions,
						handlers: {
							image: imageHandler,
						},
					},
				});

				setFormats([
					"font",
					"header",
					"bold",
					"italic",
					"underline",
					"strike",
					"blockquote",
					"code-block",
					"color",
					"background",
					"list",
					"bullet",
					"indent",
					"link",
					"image",
					"align",
				]);

				// Set ReactQuill after importing
				setReactQuill(() => RQ);
			}
		};

		importEditors();
	}, []);

	const handleSubmit = async () => {
		// Extract user IDs from selected users
		const userIds = selectedUsers.map((user) => user.value);
		try {
			// Send content and user IDs to the email API route
			await axios.post("/api/sendNewsletter", {
				content,
				userIds,
			});
			alert("Newsletter sent successfully");
		} catch (err) {
			console.error(err);
			alert("Error sending newsletter");
		}
	};

	if (!ReactQuill || !modules || formats.length === 0) {
		// Render a loader or nothing until modules are set
		return <Spinner />;
	}

	return (
		<div>
			<h1>Compose Newsletter</h1>
			<ReactQuill ref={quillRef} value={content} onChange={setContent} modules={modules} formats={formats} />
			<h2>Select Users</h2>
			<Select isMulti options={userOptions} value={selectedUsers} onChange={(value) => setSelectedUsers(value as UserOption[])} />
			<Button onClick={handleSubmit}>Send Newsletter</Button>
		</div>
	);
};

export default NewsletterWriter;
