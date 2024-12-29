// collections/Workshops.ts
import type { CollectionConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import {
	HeadingFeature,
	LinkFeature,
	ParagraphFeature,
	BoldFeature,
	ItalicFeature,
	UnderlineFeature,
	InlineToolbarFeature,
} from "@payloadcms/richtext-lexical";

export const Workshops: CollectionConfig = {
	slug: "workshops",
	access: {
		read: () => true,
		create: ({ req }) => {
			// Type assertion to bypass TypeScript checking
			const userRole = (req.user as any)?.role;
			return userRole === "admin";
		},
		update: ({ req }) => {
			const userRole = (req.user as any)?.role;
			return userRole === "admin";
		},
		delete: ({ req }) => {
			const userRole = (req.user as any)?.role;
			return userRole === "admin";
		},
	},
	admin: {
		useAsTitle: "title",
		defaultColumns: ["title", "date", "location"],
	},
	fields: [
		{
			name: "title",
			type: "text",
			required: true,
		},
		{
			name: "recurrence",
			type: "select",
			options: [
				{ label: "Single Day", value: "single" },
				{ label: "Weekly", value: "weekly" },
				{ label: "Custom Range", value: "range" },
			],
			defaultValue: "single",
			required: true,
		},
		{
			name: "startDate",
			type: "date",
			required: true,
			admin: {
				date: {
					pickerAppearance: "dayAndTime",
					displayFormat: "MMM d, yyyy h:mm a",
				},
			},
		},
		{
			name: "endDate",
			type: "date",
			required: true,
			admin: {
				date: {
					pickerAppearance: "dayAndTime",
					displayFormat: "MMM d, yyyy h:mm a",
				},
			},
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
			admin: {
				condition: (data) => data.recurrence === "weekly",
			},
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
			required: true,
			editor: lexicalEditor({
				features: ({ defaultFeatures }) => [
					...defaultFeatures,
					HeadingFeature(),
					LinkFeature(),
					ParagraphFeature(),
					BoldFeature(),
					ItalicFeature(),
					UnderlineFeature(),
					InlineToolbarFeature(),
				],
			}),
		},
		{
			name: "location",
			type: "text",
			required: true,
		},
		{
			name: "price",
			type: "number",
			defaultValue: 0,
			required: false,
		},
		{
			name: "maxParticipants",
			type: "number",
			required: false,
		},
		{
			name: "isPublished",
			type: "checkbox",
			defaultValue: false,
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "slug",
			type: "text",
			required: true,
			unique: true,
			admin: {
				position: "sidebar",
			},
		},
	],
	versions: {
		drafts: true,
	},
};
