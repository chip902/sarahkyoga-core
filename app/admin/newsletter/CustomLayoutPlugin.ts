import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";

export default class CustomLayoutPlugin extends Plugin {
	init() {
		const editor = this.editor;

		this._addAdjustMarginButton(editor);
		this._addColumnLayoutButton(editor);
	}

	private _addAdjustMarginButton(editor: any) {
		editor.ui.componentFactory.add("adjustMargin", (locale: any) => {
			const button = new ButtonView(locale);

			button.set({
				label: "Adjust Margin",
				tooltip: true,
				withText: true,
			});

			button.on("execute", () => {
				const selection = editor.model.document.selection;
				editor.model.change((writer: any) => {
					const range = selection.getFirstRange();
					const element = range.start.parent;
					writer.setAttribute("class", "narrow-margins", element);
				});
			});

			return button;
		});
	}

	private _addColumnLayoutButton(editor: any) {
		editor.ui.componentFactory.add("columnLayout", (locale: any) => {
			const button = new ButtonView(locale);

			button.set({
				label: "Column Layout",
				tooltip: true,
				withText: true,
			});

			button.on("execute", () => {
				const selection = editor.model.document.selection;
				editor.model.change((writer: any) => {
					const range = selection.getFirstRange();
					const element = range.start.parent;
					writer.setAttribute("class", "two-column-layout", element);
				});
			});

			return button;
		});
	}
}
