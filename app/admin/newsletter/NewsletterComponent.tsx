//@ts-nocheck
"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { Spinner } from "@chakra-ui/react";

// Dynamically import CKEditor and ClassicEditor
const CKEditor = dynamic(() => import("@ckeditor/ckeditor5-react").then((mod) => mod.CKEditor), {
	ssr: false,
});
const ClassicEditor = dynamic((): any => import("@ckeditor/ckeditor5-build-classic"), {
	ssr: false,
});

const NewsletterComponent: React.FC = () => {
	const [editorLoaded, setEditorLoaded] = useState(false); // Track whether the editor is loaded
	const [error, setError] = useState(null); // Track any loading error

	const editorConfig = {
		toolbar: ["heading", "|", "bold", "italic", "link", "bulletedList", "numberedList", "undo", "redo"],
	};

	useEffect(() => {
		setEditorLoaded(true); // Once the component is mounted, set the editor to loaded
	}, []);

	if (!editorLoaded) {
		return <Spinner size="xl" />; // Show Spinner while the editor is loading
	}

	return (
		<div>
			<h2>Newsletter Composer</h2>

			{error ? (
				<p>Error loading editor: {error}</p>
			) : (
				<CKEditor
					editor={ClassicEditor} // Ensure ClassicEditor is used without additional plugins
					config={editorConfig}
					data="<p>Start composing your newsletter here!</p>"
					onReady={(editor: any) => {
						console.log("Editor is ready to use!", editor);
					}}
					onChange={(event: any, editor: { getData: () => any }) => {
						const data = editor.getData();
						console.log({ event, editor, data });
					}}
					onError={(err: React.SetStateAction<null>) => {
						setError(err);
						console.error("Editor error:", err); // Capture and log errors
					}}
				/>
			)}
		</div>
	);
};

export default NewsletterComponent;
