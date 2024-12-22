// /Users/andrew/code/sarahkyoga-core/app/hooks/useFetchData.tsx

import { useState, useEffect } from "react";
import { fetchAPI } from "../../lib/strapi";

export default function useFetchData<T>(url: string) {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetchAPI(url);
				if (!response || !response.data) throw new Error("No data fetched");
				setData(response.data as T);
			} catch (err: any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [url]);

	return { data, loading, error };
}
