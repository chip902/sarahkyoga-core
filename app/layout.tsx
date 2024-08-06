import { GoogleTagManager } from "@next/third-parties/google";
import ClientLayout from "./ClientLayout";
import ServerLayout from "./server-layout";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<ServerLayout>
			<ClientLayout>
				<GoogleTagManager gtmId="GTM-K3KZJZ9" preview="env-7" />
				{children}
			</ClientLayout>
		</ServerLayout>
	);
}
