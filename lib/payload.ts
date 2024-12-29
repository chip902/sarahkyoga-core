// lib/payload.ts
import payload from "payload";
import { PayloadClientConfig } from "@payloadcms/next-payload";
import configModule from "../payload.config";

let isInitialized = false;

export async function initPayload() {
	if (!isInitialized) {
		try {
			// Ensure secret is set
			if (!process.env.PAYLOAD_SECRET) {
				throw new Error("PAYLOAD_SECRET is not set");
			}

			await payload.init({
				config: configModule,
				secret: process.env.PAYLOAD_SECRET!,
			} as any);

			isInitialized = true;
		} catch (error) {
			console.error("Failed to initialize Payload:", error);
			throw error;
		}
	}
	return payload;
}

// Optional: if you need to access the config directly
export function getPayloadConfig(): PayloadClientConfig {
	return {
		buildConfig: configModule,
		auth: {
			verify: async (req) => {
				// Implement authentication verification logic if needed
				// This is a placeholder implementation
				return false;
			},
		},
	};
}
