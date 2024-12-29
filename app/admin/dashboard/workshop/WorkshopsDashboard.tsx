"use client";

import { useState } from "react";
import {
	Box,
	Flex,
	Heading,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Button,
	Container,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	FormControl,
	FormLabel,
	Input,
	Select,
	VStack,
	useToast,
} from "@chakra-ui/react";
import { Workshop } from "@/payload-types";

// Define props type
type WorkshopsDashboardProps = {
	initialWorkshops: Workshop[];
};

const WorkshopsDashboard: React.FC<WorkshopsDashboardProps> = ({ initialWorkshops }) => {
	const [workshops, setWorkshops] = useState<Workshop[]>(initialWorkshops);
	const [selectedWorkshop, setSelectedWorkshop] = useState<Partial<Workshop> | null>(null);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

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

			toast({
				title: "Workshop Created",
				status: "success",
				duration: 3000,
				isClosable: true,
			});

			onClose();
			setSelectedWorkshop(null);
		} catch (error) {
			toast({
				title: "Error",
				description: error instanceof Error ? error.message : "An error occurred",
				status: "error",
				duration: 5000,
				isClosable: true,
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

			toast({
				title: "Workshop Updated",
				status: "success",
				duration: 3000,
				isClosable: true,
			});

			onClose();
			setSelectedWorkshop(null);
		} catch (error) {
			toast({
				title: "Error",
				description: error instanceof Error ? error.message : "An error occurred",
				status: "error",
				duration: 5000,
				isClosable: true,
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

			toast({
				title: "Workshop Deleted",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		} catch (error) {
			toast({
				title: "Error",
				description: error instanceof Error ? error.message : "An error occurred",
				status: "error",
				duration: 5000,
				isClosable: true,
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
			_status: "draft",
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

					<Table variant="simple">
						<Thead>
							<Tr>
								<Th>Title</Th>
								<Th>Recurrence</Th>
								<Th>Start Date</Th>
								<Th>Status</Th>
								<Th>Actions</Th>
							</Tr>
						</Thead>
						<Tbody>
							{workshops.map((workshop) => (
								<Tr key={workshop.id}>
									<Td>{workshop.title}</Td>
									<Td>{workshop.recurrence}</Td>
									<Td>{workshop.startDate}</Td>
									<Td>{workshop._status || "draft"}</Td>
									<Td>
										<Button size="sm" mr={2} onClick={() => openEditModal(workshop)}>
											Edit
										</Button>
										<Button size="sm" colorScheme="red" onClick={() => handleDeleteWorkshop(workshop.id)}>
											Delete
										</Button>
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</Box>
			</Container>

			{/* Workshop Modal */}
			<Modal isOpen={isOpen} onClose={onClose} size="xl">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{selectedWorkshop?.id ? "Edit Workshop" : "Create New Workshop"}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<VStack spacing={4}>
							<FormControl>
								<FormLabel>Title</FormLabel>
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
							</FormControl>

							<FormControl>
								<FormLabel>Recurrence</FormLabel>
								<Select
									value={selectedWorkshop?.recurrence || "single"}
									onChange={(e) =>
										setSelectedWorkshop((prev) => ({
											...(prev || {}),
											recurrence: e.target.value as Workshop["recurrence"],
										}))
									}>
									<option value="single">Single Day</option>
									<option value="weekly">Weekly</option>
									<option value="range">Custom Range</option>
								</Select>
							</FormControl>

							<Flex width="full" gap={4}>
								<FormControl>
									<FormLabel>Start Date</FormLabel>
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
								</FormControl>
								<FormControl>
									<FormLabel>End Date</FormLabel>
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
								</FormControl>
							</Flex>

							<Flex width="full" gap={4}>
								<FormControl>
									<FormLabel>Start Time</FormLabel>
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
								</FormControl>
								<FormControl>
									<FormLabel>End Time</FormLabel>
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
								</FormControl>
							</Flex>

							<FormControl>
								<FormLabel>Location</FormLabel>
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
							</FormControl>
						</VStack>
					</ModalBody>
					<ModalFooter>
						<Button colorScheme="blue" mr={3} onClick={selectedWorkshop?.id ? handleUpdateWorkshop : handleCreateWorkshop}>
							{selectedWorkshop?.id ? "Update" : "Create"}
						</Button>
						<Button variant="ghost" onClick={onClose}>
							Cancel
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default WorkshopsDashboard;
