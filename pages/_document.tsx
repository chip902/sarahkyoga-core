import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document";

class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps };
	}

	render() {
		return (
			<Html lang="en">
				<Head>
					<link rel="icon" href="/favicon.ico" type="image/ico" sizes="32x32" />
					<link rel="icon" href="/favicon.ico" type="image/ico" sizes="16x16" />
					<link rel="icon" href="/favicon.ico" type="image/ico" sizes="any" />
					<meta name="msapplication-TileColor" content="#da532c" />
					<meta name="theme-color" content="#ffffff" />
					<meta property="og:title" content="Sarah K. Yoga" />
					<meta property="og:description" content="Student and Teacher of Katonah Yoga" />
					<meta property="og:image" content="/sky_banner.webp" />
					<meta property="og:url" content="https://sarahkyoga.com" />
					<meta name="twitter:card" content="summary_large_image" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
