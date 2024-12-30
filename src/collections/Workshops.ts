import { CollectionConfig } from "payload/dist/collections/config/types";

interface WorkshopType {
	id: string;
	title: string;
	startDate: string;
	endDate: string;
	_status?: "draft" | "published";
}

export const Workshops: CollectionConfig = {
	slug: "workshops",
	admin: {
		useAsTitle: "title",
		defaultColumns: ["title", "startDate", "endDate", "_status"],
	},
	access: {
		read: () => true,
		update: () => true,
		delete: () => true,
	},
	fields: [
		{
			name: "_status",
			type: "select",
			defaultValue: "draft",
			options: [
				{
					label: "Draft",
					value: "draft",
				},
				{
					label: "Published",
					value: "published",
				},
			],
		},
		{
			name: "title",
			type: "text",
			required: true,
		},
		{
			name: "recurrence",
			type: "select",
			required: true,
			options: [
				{ label: "Single", value: "single" },
				{ label: "Weekly", value: "weekly" },
				{ label: "Range", value: "range" },
			],
		},
		{
			name: "startDate",
			type: "date",
			required: true,
		},
		{
			name: "endDate",
			type: "date",
			required: true,
		},
		{
			name: "dayOfWeek",
			type: "select",
			options: [
				{ label: "Sunday", value: "sunday" },
				{ label: "Monday", value: "monday" },
				{ label: "Tuesday", value: "tuesday" },
				{ label: "Wednesday", value: "wednesday" },
				{ label: "Thursday", value: "thursday" },
				{ label: "Friday", value: "friday" },
				{ label: "Saturday", value: "saturday" },
			],
		},
		{
			name: "timeRange",
			type: "group",
			fields: [
				{
					name: "startTime",
					type: "text",
					required: true,
				},
				{
					name: "endTime",
					type: "text",
					required: true,
				},
			],
		},
		{
			name: "description",
			type: "richText",
		},
		{
			name: "location",
			type: "text",
			required: true,
		},
		{
			name: "price",
			type: "number",
		},
		{
			name: "maxParticipants",
			type: "number",
		},
		{
			name: "isPublished",
			type: "checkbox",
			defaultValue: false,
		},
		{
			name: "slug",
			type: "text",
			required: true,
			admin: {
				position: "sidebar",
			},
		},
	],
	versions: {
		drafts: true,
	},
};

export type { WorkshopType };
