declare module "@ckeditor/ckeditor5-react" {
	export interface CKEditorProps<T> {} // add typing here as required by your use case for example: extends ... etc.
	export class CKEditor extends React.Component<CKEditorProps<any>> {}
}
