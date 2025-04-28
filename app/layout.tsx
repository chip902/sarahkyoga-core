import { GoogleTagManager } from "@next/third-parties/google";
import ClientLayout from "./ClientLayout";
import ServerLayout from "./server-layout";
import WelcomeToast from "./components/WelcomeToast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<ServerLayout>
			<ClientLayout>
				<GoogleTagManager gtmId="GTM-K3KZJZ9" />
				<WelcomeToast />
				{children}
			</ClientLayout>
		</ServerLayout>
	);
}
