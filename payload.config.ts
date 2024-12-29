// storage-adapter-import-placeholder
import { vercelPostgresAdapter } from "@payloadcms/db-vercel-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Workshops } from "./collections/Workshops";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
	admin: {
		user: Users.slug,
		importMap: {
			baseDir: path.resolve(dirname),
		},
	},
	collections: [Users, Media, Workshops],
	cors: ["https://sarahkyoga.com", "https://www.sarahkyoga.com", "http://localhost:3000", "http://localhost:3001"],
	editor: lexicalEditor({}),
	secret: process.env.PAYLOAD_SECRET || "",
	typescript: {
		outputFile: path.resolve(dirname, "payload-types.ts"),
	},
	db: vercelPostgresAdapter({
		pool: {
			connectionString: process.env.POSTGRES_URL,
			ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
			max: 10,
		},
		schemaName: "payload",
	}),
	sharp,
	plugins: [
		// storage-adapter-placeholder
	],
});
