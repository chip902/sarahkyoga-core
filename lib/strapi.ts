// lib/strapi.ts
import axios from "axios";

export const fetchAPI = async (path: string) => {
	const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
	const BEARER_TOKEN =
		"9b18c52f33e71cfe24bb5067bd5d7fe0b1b4e799645b04743db1e9ea5cdbd67b7f100eea88e86b6da973ea83fccae35e52c97dd067ee812490715f23c04796caffddcba3d93161dbc7b8d31dc89e4d48afa3a5dc33c19c749d8dab5902a851868231b636a360182c317901fbf9cad638f3bb6abf4d424a4d5937bc6b6df2d8bd";
	console.log("Bearer Token:", BEARER_TOKEN); // Debugging purposes

	try {
		const response = await axios.get(`${API_URL}${path}`, {
			headers: {
				Authorization: `Bearer ${BEARER_TOKEN}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
