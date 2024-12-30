import { initPayload } from "@/lib/payload"; // Adjust path as needed
import WorkshopsDashboard from "./WorkshopsDashboard";

export default async function WorkshopsPage() {
	const payload = await initPayload();

	const workshops = await payload.find({
		collection: "workshops",
		limit: 50,
	});

	return <WorkshopsDashboard initialWorkshops={workshops.docs} />;
}
