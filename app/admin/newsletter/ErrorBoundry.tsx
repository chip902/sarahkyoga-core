import React, { ErrorInfo, ReactNode } from "react";

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
}

class CKEditorErrorBoundary extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(_: Error): State {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("CKEditor error:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return <h1>Something went wrong with the editor. Please try again.</h1>;
		}

		return this.props.children;
	}
}

export default CKEditorErrorBoundary;
