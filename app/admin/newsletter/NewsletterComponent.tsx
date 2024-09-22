"use client";
import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import "./editor.css";

const NewsletterComponent: React.FC = () => {
	const editorConfig = {
		toolbar: [
			"heading",
			"|",
			"bold",
			"italic",
			"link",
			"bulletedList",
			"numberedList",
			"|",
			"indent",
			"outdent",
			"|",
			"imageUpload",
			"blockQuote",
			"insertTable",
			"mediaEmbed",
			"undo",
			"redo",
		],
		balloonToolbar: ["bold", "italic", "|", "link"],
		blockToolbar: ["bold", "italic", "|", "link", "insertTable", "|", "outdent", "indent"],
		fontFamily: {
			options: ["default", "Arial, Helvetica, sans-serif", "Courier New, Courier, monospace", "Georgia, serif"],
			supportAllValues: true, // Keep support for all custom values
		},
		fontSize: {
			options: [10, 12, 14, "default", 18, 20, 22],
			supportAllValues: true,
		},
	};

	return (
		<div className="newsletter-composer">
			<h2>Newsletter Composer</h2>
			<CKEditor
				editor={ClassicEditor}
				config={editorConfig}
				data="<p>Start composing your newsletter here!</p>"
				onReady={(editor) => {
					console.log("Editor is ready to use!", editor);
				}}
				onChange={(event, editor) => {
					const data = editor.getData();
					console.log({ event, editor, data });
				}}
			/>
		</div>
	);
};

export default NewsletterComponent;
