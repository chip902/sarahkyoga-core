// app/booking/ReservationComponent.tsx
"use client";
import {
	Button,
	Container,
	Text,
	VStack,
	Box,
	Spinner,
	useDisclosure,
	HStack,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Heading,
	SimpleGrid,
	Stack,
	Flex,
	Collapsible,
	IconButton,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Select from "react-select";
import useCheckAvailability from "../hooks/useCheckAvailability";
import { BookNowButton } from "./BookNow";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import { toaster } from "@/src/components/ui/toaster";
import { Alert } from "@/src/components/ui/alert";

interface IReservationComponentProps {
	onNext: (availableOptions: string[], dateTime: Date) => void;
}

const ReservationComponent = ({ onNext }: IReservationComponentProps) => {
	const [availability, setAvailability] = useState<"Available" | "Busy" | null>(null);
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
	const [selectedTime, setSelectedTime] = useState<string | null>(null);
	const [zoomAvailable, setZoomAvailable] = useState<string | null>();
	const [inPersonAvailable, setInPersonAvailable] = useState<string | null>();
	const { open, onOpen } = useDisclosure();
	const [showZoomClassInfo, setShowZoomClassInfo] = useState(false);
	const { checkAvailability, loading, error } = useCheckAvailability();
	const [dateError, setDateError] = useState<string | null>(null);

	// Define the time slots array
	const timeSlots = Array.from({ length: 10 }, (_, index) => {
		const hour = 9 + index; // Start at 8 AM, adjust as needed
		const timeString = `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour < 12 ? "AM" : "PM"}`;
		return { value: `${hour}:00`, label: timeString };
	});

	useEffect(() => {
		if (selectedDate) {
			const now = new Date();
			if (selectedDate.getTime() < now.setHours(0, 0, 0, 0)) {
				setDateError("You cannot select a date in the past.");
				setSelectedDate(undefined);
				return;
			} else {
				setDateError(null);
			}
			onOpen(); // Trigger the expansion to show time slot picker
		}
	}, [selectedDate]);

	const handleDateSelect = (date: Date) => {
		setShowZoomClassInfo(false);
		if (!date || !(date instanceof Date)) {
			return;
		}

		const now = new Date();
		if (date.getTime() < now.setHours(0, 0, 0, 0)) {
			setDateError("You cannot select a date in the past.");
			return;
		}
		onOpen();
		setAvailability(null);
		setSelectedDate(date);
	};

	const handleNextClick = async () => {
		if (selectedDate && selectedTime) {
			const [hours] = selectedTime.split(":").map(Number);
			const finalDate = new Date(selectedDate);
			finalDate.setHours(hours);
			finalDate.setMinutes(0);

			// Check availability for both session types (60-min Zoom and 75-min in-person)
			const zoomTimeMax = new Date(finalDate.getTime() + 60 * 60 * 1000).toISOString(); // 60 minutes later
			const inPersonTimeMax = new Date(finalDate.getTime() + 75 * 60 * 1000).toISOString(); // 75 minutes later

			const zoomAvailability = await checkAvailability(finalDate.toISOString(), zoomTimeMax);
			const inPersonAvailability = await checkAvailability(finalDate.toISOString(), inPersonTimeMax);

			setZoomAvailable(zoomAvailability);
			setInPersonAvailable(inPersonAvailability);

			if (zoomAvailability === "Available" || inPersonAvailability === "Available") {
				setAvailability("Available");
				// Call the onNext prop with available options and the selected date/time
				onNext([zoomAvailability === "Available" ? "Zoom" : "", inPersonAvailability === "Available" ? "In-Person" : ""].filter(Boolean), finalDate);
			} else {
				toaster.create({
					title: "Availabilty Issue",
					description: "There are no slots available for the selected date and time. Try another selection.",
					type: "error",
					duration: 5000,
				});
			}
		}
	};

	return (
		<Container
			maxW={["90%", "90%", "90%"]}
			py={{ base: "8", md: "12", lg: "24" }}
			mt={{ base: 20, md: 80 }}
			bgColor="brand.600"
			borderRadius="md"
			opacity="0.9"
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
			textAlign="center"
			transition="max-width 0.5s ease-in-out">
			<VStack gap={4} alignItems="center" width="100%">
				<Box as="section" pt={{ base: "4", md: "8" }} pb={{ base: "12", md: "24" }}>
					<Container>
						<Box px="4" py="5" bg="brand.700" opacity="0.8" borderRadius="lg">
							<Flex justifyContent="space-between" alignItems="center">
								<Stack gap="1">
									<Collapsible.Root>
										<Collapsible.Trigger>
											<Text textStyle="lg" fontWeight="medium" color="brand.200">
												Looking for my Sunday Zoom Class?
											</Text>
										</Collapsible.Trigger>
										<Collapsible.Content>
											<Text textStyle="sm" color="brand.400">
												Click below to get on my next Sunday Zoom Class!
											</Text>
											<BookNowButton productId="0" />
										</Collapsible.Content>
									</Collapsible.Root>
								</Stack>
								<Flex padding={5}>
									<IconButton
										size="sm"
										bg="brand.600"
										onClick={() => setShowZoomClassInfo(!showZoomClassInfo)}
										aria-label="Toggle update info">
										{showZoomClassInfo ? <ChevronUpIcon /> : <ChevronDownIcon />}
									</IconButton>
								</Flex>
							</Flex>
						</Box>
					</Container>
				</Box>
				<Heading fontFamily="inherit" fontSize={{ base: "xl", md: "xl" }}>
					Select your preferred day
				</Heading>
				<Box width="100%">
					{/*@ts-ignore*/}
					<Calendar
						date={selectedDate}
						onChange={handleDateSelect}
						minDate={new Date()} // Disable past dates
					/>
				</Box>
				{dateError && <Alert status="error" width="100%" title={dateError} />}
			</VStack>

			{open && !dateError && (
				<VStack gap={4} alignItems="center" mt={4} width="100%">
					<Text fontSize={{ base: "md", lg: "lg" }} mt={4}>
						Select Desired Time
					</Text>
					<Select
						options={timeSlots}
						onChange={(option: { value: string; label: string } | null) => setSelectedTime(option?.value ?? null)}
						isClearable
						placeholder="Select a time"
						value={timeSlots.find((slot: { value: string; label: string }) => slot.value === selectedTime)}
						styles={{
							control: (provided) => ({
								...provided,
								width: "100%",
								color: "black",
							}),
							option: (provided, state) => ({
								...provided,
								color: state.isSelected ? "white" : "black",
							}),
						}}
					/>
					{loading && <Spinner size="lg" color="teal.500" />}
					{error && (
						<Alert status="error" width="100%">
							{error}
						</Alert>
					)}
					{availability && (
						<VStack>
							<Alert status={availability === "Available" ? "success" : "warning"} width="100%">
								{availability === "Available" ? "The selected time is available!" : "The selected time is busy!"}
							</Alert>

							{/* Conditionally Render SimpleGrid Based on Availability */}
							{availability === "Available" && (
								<VStack>
									<SimpleGrid gap={4} templateColumns="repeat(auto-fill, minmax(200px, 1fr))">
										{/* Conditionally Render the Cards Based on Availability */}
										{zoomAvailable && (
											<Card.Root variant="elevated">
												<CardHeader>
													<Heading fontFamily="inherit" size="md">
														60-Min Zoom Session
													</Heading>
												</CardHeader>
												<CardBody>
													<Text color="inherit" fontFamily="inherit">
														Get a personalized 60-minute Zoom session for $80.
													</Text>
												</CardBody>
												<CardFooter>
													<BookNowButton productId="1" />
												</CardFooter>
											</Card.Root>
										)}

										{inPersonAvailable && (
											<>
												<Card.Root variant="elevated">
													<CardHeader>
														<Heading fontFamily="inherit" size="md">
															75-Min In-Person (1-2 People)
														</Heading>
													</CardHeader>
													<CardBody>
														<Text color="inherit" fontFamily="inherit">
															Enjoy a private 75-minute in-person session for $125.
														</Text>
													</CardBody>
													<CardFooter>
														<BookNowButton productId="2" />
													</CardFooter>
												</Card.Root>
												<Card.Root variant="elevated">
													<CardHeader>
														<Heading fontFamily="inherit" size="md">
															75-Min In-Person (3+ People)
														</Heading>
													</CardHeader>
													<CardBody>
														<Text color="inherit" fontFamily="inherit">
															Invite more people for a 75-minute in-person session for $175.
														</Text>
													</CardBody>
													<CardFooter>
														<BookNowButton productId="3" />
													</CardFooter>
												</Card.Root>
											</>
										)}
									</SimpleGrid>
								</VStack>
							)}
						</VStack>
					)}

					<HStack gap={4} mt={4} alignItems="center">
						{!availability && (
							<Button colorScheme="teal" disabled={!selectedDate || !selectedTime || loading || !!dateError} onClick={handleNextClick}>
								Check Time
							</Button>
						)}
					</HStack>
				</VStack>
			)}
		</Container>
	);
};

export default ReservationComponent;
