import ClientLayout from "./ClientLayout";
import ServerLayout from "./server-layout";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<ServerLayout>
			<ClientLayout>{children}</ClientLayout>
		</ServerLayout>
	);
}
