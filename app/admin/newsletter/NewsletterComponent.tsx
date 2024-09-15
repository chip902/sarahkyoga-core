"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import Quill from "quill";
import "quill/dist/quill.bubble.css"; // Use the .snow or .bubble theme depending on your preference
import Select from "react-select";
import axios from "axios";
// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface UserOption {
	value: string;
	label: string;
}

// Define available fonts
const fonts = ["arial", "georgia", "impact", "tahoma", "times-new-roman", "verdana", "quicksand"];

// Register fonts with Quill
if (typeof window !== "undefined") {
	const Font = Quill.import("formats/font");
	Font.whitelist = fonts;
	Quill.register(Font, true);
}

// Define the toolbar options
const toolbarOptions = [
	[{ font: fonts }],
	[{ header: [1, 2, 3, 4, 5, 6, false] }],
	["bold", "italic", "underline", "strike"],
	[{ color: [] }, { background: [] }],
	[{ align: [] }],
	["blockquote", "code-block"],
	[{ list: "ordered" }, { list: "bullet" }],
	["link", "image"],
	["clean"],
];

// Configure the modules for ReactQuill
const modules = {
	toolbar: {
		container: toolbarOptions,
		handlers: {
			image: imageHandler,
		},
	},
};

// Define the formats supported by ReactQuill
const formats = [
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
];

// Implement the image handler
function imageHandler(this: any) {
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
				const range = this.quill.getSelection();
				this.quill.insertEmbed(range.index, "image", imageUrl);
			} catch (err) {
				console.error(err);
			}
		}
	};
}

const NewsletterWriter: React.FC = () => {
	const [content, setContent] = useState<string>(""); // State for newsletter content
	const [userOptions, setUserOptions] = useState<UserOption[]>([]); // Options for user selection
	const [selectedUsers, setSelectedUsers] = useState<UserOption[]>([]); // Selected users

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

	return (
		<div>
			<h1>Compose Newsletter</h1>
			{/* Rich text editor for newsletter content */}
			<ReactQuill value={content} onChange={setContent} modules={modules} formats={formats} />
			<h2>Select Users</h2>
			{/* User selection component */}
			<Select isMulti options={userOptions} value={selectedUsers} onChange={(value) => setSelectedUsers(value as UserOption[])} />
			{/* Submit button */}
			<button onClick={handleSubmit}>Send Newsletter</button>
		</div>
	);
};

export default NewsletterWriter;
