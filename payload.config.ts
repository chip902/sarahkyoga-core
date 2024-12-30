import { buildConfig } from "payload";
import type { Config } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelPostgresAdapter } from "@payloadcms/db-vercel-postgres";
import path from "path";
import { fileURLToPath } from "url";

import { Users } from "./src/collections/Users";
import { Media } from "./src/collections/Media";
import { Workshops } from "./src/collections/Workshops";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: Config = {
	serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
	secret: process.env.PAYLOAD_SECRET || "YOUR-SECRET-KEY",
	admin: {
		user: "users",
	},
	collections: [Users, Media, Workshops],
	cors: ["https://sarahkyoga.com", "https://www.sarahkyoga.com", "http://localhost:3000", "http://localhost:3001"],
	csrf: ["https://sarahkyoga.com", "https://www.sarahkyoga.com", "http://localhost:3000", "http://localhost:3001"],
	editor: lexicalEditor({}),
	db: vercelPostgresAdapter({
		pool: {
			connectionString: process.env.POSTGRES_URL || "",
			ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
			max: 10,
		},
		schemaName: "payload",
	}),
	typescript: {
		outputFile: path.resolve(__dirname, "payload-types.ts"),
	},
	graphQL: {
		schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
	},
	debug: process.env.NODE_ENV === "development",
};

export default buildConfig(config);
