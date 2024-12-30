import payloadConfig from "@/payload.config";
import payload from "payload";

let cached = (global as any).payloadClient || null;

export const getPayloadClient = async () => {
	if (!process.env.PAYLOAD_SECRET) {
		throw new Error("PAYLOAD_SECRET environment variable is required");
	}

	if (cached) {
		return cached;
	}

	try {
		cached = await payload.init({
			onInit: async (cms) => {
				cms.logger.info(`Admin URL: ${cms.getAdminURL()}`);
			},
			config: payloadConfig,
		});
		(global as any).payloadClient = cached;
		return cached;
	} catch (error: unknown) {
		console.error("Error initializing Payload:", error);
		throw error;
	}
};

// For the route.ts file
export { getPayloadClient as initPayload };
