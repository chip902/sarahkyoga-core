// app/admin/dashboard/workshop/page.tsx
import { initPayload } from "@/lib/payload";
import WorkshopsDashboard from "./WorkshopsDashboard";

export default async function WorkshopsPage() {
	const payload = await initPayload();

	const workshops = await payload.find({
		collection: "workshops",
		limit: 50,
	});

	return <WorkshopsDashboard initialWorkshops={workshops.docs} />;
}
