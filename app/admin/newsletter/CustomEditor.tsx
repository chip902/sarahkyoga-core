"use client"; // only in App Router

import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Bold, Essentials, Italic, Mention, Paragraph, Undo } from "ckeditor5";
import ClassicEditor from "./ckeditor";
import "./editor.css";
import "./ckeditor";

function CustomEditor() {
	return (
		<CKEditor
			editor={ClassicEditor}
			
			}}
		/>
	);
}

export default CustomEditor;
