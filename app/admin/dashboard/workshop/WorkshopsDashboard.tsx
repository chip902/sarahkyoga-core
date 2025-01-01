"use client";

import { useState } from "react";
import { Box, Flex, Heading, Table, Button, Container, useDisclosure, Input, VStack, createListCollection } from "@chakra-ui/react";
import { toaster } from "@/src/components/ui/toaster";
import { SelectContent, SelectItem, SelectRoot } from "@/src/components/ui/select";

import { type Workshop } from "@/payload-types";
import { DialogBody, DialogFooter, DialogHeader, DialogRoot } from "@/src/components/ui/dialog";
import { Field } from "@/src/components/ui/field";

// Define props type
type WorkshopsDashboardProps = {
	initialWorkshops: Workshop[];
};

const WorkshopsDashboard = ({ initialWorkshops }: WorkshopsDashboardProps) => {
	const [value, setValue] = useState<string[]>([]);
	const [workshops, setWorkshops] = useState<Workshop[]>(initialWorkshops);
	const [selectedWorkshop, setSelectedWorkshop] = useState<Partial<Workshop> | null>(null);
	const { open, onOpen, onClose } = useDisclosure();
	const frequencyCollection = createListCollection({
		items: [
			{ label: "Single Day", value: "single" },
			{ label: "Weekly", value: "weekly" },
			{ label: "Custom Range", value: "range" },
		],
	});

	// Create a new workshop
	const handleCreateWorkshop = async () => {
		try {
			const response = await fetch("/api/workshops", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(selectedWorkshop),
			});

			if (!response.ok) {
				throw new Error("Failed to create workshop");
			}

			const newWorkshop = await response.json();
			setWorkshops([...workshops, newWorkshop]);

			toaster.create({
				title: "Workshop Created",
				type: "success",
				duration: 3000,
			});

			onClose();
			setSelectedWorkshop(null);
		} catch (error) {
			toaster.create({
				title: "Error",
				description: error instanceof Error ? error.message : "An error occurred",
				type: "error",
				duration: 5000,
			});
		}
	};

	// Update an existing workshop
	const handleUpdateWorkshop = async () => {
		if (!selectedWorkshop?.id) return;

		try {
			const response = await fetch(`/api/workshops/${selectedWorkshop.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(selectedWorkshop),
			});

			if (!response.ok) {
				throw new Error("Failed to update workshop");
			}

			const updatedWorkshop = await response.json();
			setWorkshops(workshops.map((w) => (w.id === updatedWorkshop.id ? updatedWorkshop : w)));

			toaster.create({
				title: "Workshop Updated",
				type: "success",
				duration: 3000,
			});

			onClose();
			setSelectedWorkshop(null);
		} catch (error) {
			toaster.create({
				title: "Error",
				description: error instanceof Error ? error.message : "An error occurred",
				type: "error",
				duration: 5000,
			});
		}
	};

	// Delete a workshop
	const handleDeleteWorkshop = async (id: number) => {
		try {
			const response = await fetch(`/api/workshops/${id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Failed to delete workshop");
			}

			setWorkshops(workshops.filter((w) => w.id !== id));

			toaster.create({
				title: "Workshop Deleted",
				type: "success",
				duration: 3000,
			});
		} catch (error) {
			toaster.create({
				title: "Error",
				description: error instanceof Error ? error.message : "An error occurred",
				type: "error",
				duration: 5000,
			});
		}
	};

	// Open modal for creating a new workshop
	const openCreateModal = () => {
		setSelectedWorkshop({
			title: "",
			recurrence: "single",
			startDate: new Date().toISOString().split("T")[0],
			endDate: new Date().toISOString().split("T")[0],
			timeRange: { startTime: "09:00", endTime: "10:00" },
			location: "",
			description: {
				root: {
					type: "root",
					children: [{ type: "paragraph", children: [{ text: "" }], version: 1 }],
					direction: null,
					format: "",
					indent: 0,
					version: 1,
				},
			},
			_status: "draft" as const,
		});
		onOpen();
	};

	// Open modal for editing an existing workshop
	const openEditModal = (workshop: Workshop) => {
		setSelectedWorkshop({ ...workshop });
		onOpen();
	};

	return (
		<>
			<Container maxW="container.xl" my="300px">
				<Box bg="white" p={6} borderRadius="lg" shadow="sm">
					<Flex alignItems="center" justifyContent="space-between" mb={6}>
						<Heading fontFamily="inherit" as="h2">
							Workshops Management
						</Heading>
						<Button colorScheme="blue" onClick={openCreateModal}>
							Create New Workshop
						</Button>
					</Flex>

					<Table.Root>
						<Table.Header>
							<Table.Header>
								<Table.ColumnHeader>Title</Table.ColumnHeader>
								<Table.ColumnHeader>Recurrence</Table.ColumnHeader>
								<Table.ColumnHeader>Start Date</Table.ColumnHeader>
								<Table.ColumnHeader>Status</Table.ColumnHeader>
								<Table.ColumnHeader>Actions</Table.ColumnHeader>
							</Table.Header>
						</Table.Header>
						<Table.Body>
							{workshops.map((workshop) => (
								<Table.Row key={workshop.id}>
									<Table.Cell>{workshop.title}</Table.Cell>
									<Table.Cell>{workshop.recurrence}</Table.Cell>
									<Table.Cell>{workshop._status || "draft"}</Table.Cell>
									<Table.Cell>
										<Button size="sm" mr={2} onClick={() => openEditModal(workshop)}>
											Edit
										</Button>
										<Button size="sm" colorScheme="red" onClick={() => handleDeleteWorkshop(workshop.id)}>
											Delete
										</Button>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table.Root>
				</Box>
			</Container>

			{/* Workshop Modal */}
			<DialogRoot open={open} closeOnInteractOutside size="xl">
				<DialogBody>
					<DialogHeader>{selectedWorkshop?.id ? "Edit Workshop" : "Create New Workshop"}</DialogHeader>
					<DialogBody>
						<VStack gap={4}>
							<form>
								<Field>Title</Field>
								<Input
									value={selectedWorkshop?.title || ""}
									onChange={(e) =>
										setSelectedWorkshop((prev) => ({
											...(prev || {}),
											title: e.target.value,
										}))
									}
									placeholder="Enter workshop title"
								/>

								<Field>Recurrence</Field>
								<SelectRoot value={value} onValueChange={(e) => setValue(e.value)} collection={frequencyCollection}>
									<SelectContent>
										{frequencyCollection.items.map((movie) => (
											<SelectItem item={movie} key={movie.value}>
												{movie.label}
											</SelectItem>
										))}
									</SelectContent>
								</SelectRoot>

								<Flex width="full" gap={4}>
									<Field>Start Date</Field>
									<Input
										type="date"
										value={selectedWorkshop?.startDate || ""}
										onChange={(e) =>
											setSelectedWorkshop((prev) => ({
												...(prev || {}),
												startDate: e.target.value,
											}))
										}
									/>

									<Field>End Date</Field>
									<Input
										type="date"
										value={selectedWorkshop?.endDate || ""}
										onChange={(e) =>
											setSelectedWorkshop((prev) => ({
												...(prev || {}),
												endDate: e.target.value,
											}))
										}
									/>
								</Flex>

								<Flex width="full" gap={4}>
									<Field>Start Time</Field>
									<Input
										type="time"
										value={selectedWorkshop?.timeRange?.startTime || ""}
										onChange={(e) =>
											setSelectedWorkshop((prev) => ({
												...(prev || {}),
												timeRange: {
													...(prev as Workshop)?.timeRange,
													startTime: e.target.value,
												},
											}))
										}
									/>

									<Field>End Time</Field>
									<Input
										type="time"
										value={selectedWorkshop?.timeRange?.endTime || ""}
										onChange={(e) =>
											setSelectedWorkshop((prev) => ({
												...(prev || {}),
												timeRange: {
													...(prev as Workshop)?.timeRange,
													endTime: e.target.value,
												},
											}))
										}
									/>
								</Flex>

								<Field>Location</Field>
								<Input
									value={selectedWorkshop?.location || ""}
									onChange={(e) =>
										setSelectedWorkshop((prev) => ({
											...(prev || {}),
											location: e.target.value,
										}))
									}
									placeholder="Enter workshop location"
								/>
							</form>
						</VStack>
					</DialogBody>
					<DialogFooter>
						<Button colorScheme="blue" mr={3} onClick={selectedWorkshop?.id ? handleUpdateWorkshop : handleCreateWorkshop}>
							{selectedWorkshop?.id ? "Update" : "Create"}
						</Button>
						<Button variant="ghost" onClick={onClose}>
							Cancel
						</Button>
					</DialogFooter>
				</DialogBody>
			</DialogRoot>
		</>
	);
};

export default WorkshopsDashboard;
