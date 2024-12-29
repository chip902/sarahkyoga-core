// types/payload-next.d.ts

declare module "@payloadcms/next-payload" {
	import { Config } from "payload/config";
	import { NextRequest } from "next/server";

	interface PayloadClientConfig {
		buildConfig: Config;
		auth?: {
			verify: (req: NextRequest) => Promise<
				| {
						id: string;
						email: string;
						role?: string;
						[key: string]: any;
				  }
				| false
			>;
		};
	}

	interface PayloadRouteHandlers {
		GET: (req: NextRequest) => Promise<Response>;
		POST: (req: NextRequest) => Promise<Response>;
		PATCH: (req: NextRequest) => Promise<Response>;
		PUT: (req: NextRequest) => Promise<Response>;
		DELETE: (req: NextRequest) => Promise<Response>;
	}

	export function createPayloadClient(config: PayloadClientConfig): PayloadRouteHandlers;
}
