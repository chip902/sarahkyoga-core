"use client";
import {
	Button,
	Container,
	Text,
	VStack,
	Box,
	Spinner,
	Alert,
	AlertIcon,
	useDisclosure,
	HStack,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Heading,
	SimpleGrid,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Select from "react-select";
import useCheckAvailability from "../components/hooks/useCheckAvailability";

interface IReservationComponentProps {
	onNext: (availableOptions: string[], dateTime: Date) => void;
}

const ReservationComponent = ({ onNext }: IReservationComponentProps) => {
	const [availability, setAvailability] = useState<"Available" | "Busy" | null>(null);
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
	const [selectedTime, setSelectedTime] = useState<string | null>(null);
	const [zoomAvailable, setZoomAvailable] = useState<string | null>();
	const [inPersonAvailable, setInPersonAvailable] = useState<string | null>();
	const { isOpen, onOpen } = useDisclosure();
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
		const now = new Date();
		if (date.getTime() < now.setHours(0, 0, 0, 0)) {
			setDateError("You cannot select a date in the past.");
			return;
		} else {
			setDateError(null);
			setSelectedDate(date);
		}
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

			// Store the availability status for each type separately
			setZoomAvailable(zoomAvailability);
			setInPersonAvailable(inPersonAvailability);

			if (zoomAvailability === "Available" || inPersonAvailability === "Available") {
				setAvailability("Available");
			} else {
				alert("The selected time slot is unavailable for any session.");
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
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
			textAlign="center"
			transition="max-width 0.5s ease-in-out">
			<VStack spacing={4} alignItems="center" width="100%">
				<Text fontSize={{ base: "lg", md: "xl" }}>Select your preferred day</Text>
				<Box width="100%">
					<Calendar
						date={selectedDate}
						onChange={handleDateSelect}
						minDate={new Date()} // Disable past dates
					/>
				</Box>
				{dateError && (
					<Alert status="error" width="100%">
						<AlertIcon />
						{dateError}
					</Alert>
				)}
			</VStack>

			{isOpen && !dateError && (
				<VStack spacing={4} alignItems="center" mt={4} width="100%">
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
							}),
						}}
					/>
					{loading && <Spinner size="lg" color="teal.500" />}
					{error && (
						<Alert status="error" width="100%">
							<AlertIcon />
							{error}
						</Alert>
					)}
					{availability && (
						<VStack>
							<Alert status={availability === "Available" ? "success" : "warning"} width="100%">
								<AlertIcon />
								{availability === "Available" ? "The selected time is available!" : "The selected time is busy!"}
							</Alert>

							{/* Conditionally Render SimpleGrid Based on Availability */}
							{availability === "Available" && (
								<VStack>
									<SimpleGrid spacing={4} templateColumns="repeat(auto-fill, minmax(200px, 1fr))">
										{/* Conditionally Render the Cards Based on Availability */}
										{zoomAvailable && (
											<Card>
												<CardHeader>
													<Heading size="md">60-Min Zoom Session</Heading>
												</CardHeader>
												<CardBody>
													<Text>Get a personalized 60-minute Zoom session for $80.</Text>
												</CardBody>
												<CardFooter>
													<Button>Book Now</Button>
												</CardFooter>
											</Card>
										)}

										{inPersonAvailable && (
											<>
												<Card>
													<CardHeader>
														<Heading size="md">75-Min In-Person (1-2 People)</Heading>
													</CardHeader>
													<CardBody>
														<Text>Enjoy a private 75-minute in-person session for $125.</Text>
													</CardBody>
													<CardFooter>
														<Button>Book Now</Button>
													</CardFooter>
												</Card>
												<Card>
													<CardHeader>
														<Heading size="md">75-Min In-Person (3+ People)</Heading>
													</CardHeader>
													<CardBody>
														<Text>Invite more people for a 75-minute in-person session for $175.</Text>
													</CardBody>
													<CardFooter>
														<Button>Book Now</Button>
													</CardFooter>
												</Card>
											</>
										)}
									</SimpleGrid>
								</VStack>
							)}
						</VStack>
					)}

					<HStack spacing={4} mt={4} alignItems="center">
						<Button colorScheme="teal" isDisabled={!selectedDate || !selectedTime || loading || !!dateError} onClick={handleNextClick}>
							Next
						</Button>
					</HStack>
				</VStack>
			)}
		</Container>
	);
};

export default ReservationComponent;
