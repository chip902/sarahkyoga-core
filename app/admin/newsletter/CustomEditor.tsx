import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditorBase from "@ckeditor/ckeditor5-build-classic";

// Extend the classic editor with additional features if needed
class CustomClassicEditor extends ClassicEditorBase {}

const CustomEditor: React.FC = () => {
	return (
		<CKEditor
			editor={CustomClassicEditor}
			data="<p>Hello from CKEditor 5!</p>"
			onReady={(editor: any) => {
				// You can store the "editor" and use when it is needed.
				console.log("Editor is ready to use!", editor);
			}}
			onChange={(event: any, editor: { getData: () => any }) => {
				const data = editor.getData();
				console.log({ event, editor, data });
			}}
		/>
	);
};

export default CustomEditor;
