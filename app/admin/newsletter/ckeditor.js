import ClassicEditorBase from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
import Heading from "@ckeditor/ckeditor5-heading/src/heading";
import Link from "@ckeditor/ckeditor5-link/src/link";
import List from "@ckeditor/ckeditor5-list/src/list";
import Image from "@ckeditor/ckeditor5-image/src/image";
import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar";
import ImageCaption from "@ckeditor/ckeditor5-image/src/imagecaption";
import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle";
import ImageResize from "@ckeditor/ckeditor5-image/src/imageresize";
import Table from "@ckeditor/ckeditor5-table/src/table";
import TableToolbar from "@ckeditor/ckeditor5-table/src/tabletoolbar";
import Alignment from "@ckeditor/ckeditor5-alignment/src/alignment";
import CustomLayoutPlugin from "./CustomLayoutPlugin";

export default class ClassicEditor extends ClassicEditorBase {}

ClassicEditor.builtinPlugins = [
	Essentials,
	Paragraph,
	Bold,
	Italic,
	Heading,
	Link,
	List,
	Image,
	ImageToolbar,
	ImageCaption,
	ImageStyle,
	ImageResize,
	Table,
	TableToolbar,
	Alignment,
	CustomLayoutPlugin,
];

ClassicEditor.defaultConfig = {
	toolbar: {
		items: [
			"heading",
			"|",
			"bold",
			"italic",
			"link",
			"bulletedList",
			"numberedList",
			"|",
			"alignment",
			"|",
			"imageUpload",
			"insertTable",
			"|",
			"undo",
			"redo",
			"|",
			"adjustMargin",
			"columnLayout",
		],
	},
	image: {
		toolbar: ["imageStyle:inline", "imageStyle:block", "imageStyle:side", "|", "imageTextAlternative"],
	},
	table: {
		contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
	},
};
