"use client";
import { Button, Container, Text, VStack, Alert, AlertIcon, Spinner, useDisclosure, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Select from "react-select";
import useCheckAvailability from "../components/hooks/useCheckAvailability";

interface IReservationComponentProps {
	onNext: (date: Date) => void;
}

const ReservationComponent = ({ onNext }: IReservationComponentProps) => {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
	const [selectedTime, setSelectedTime] = useState<string | null>(null);
	const { isOpen, onOpen } = useDisclosure();
	const { checkAvailability, availability, loading, error } = useCheckAvailability();

	// Generate time slots in 30-minute increments
	const timeSlots = Array.from({ length: 48 }, (_, index) => {
		const hour = Math.floor(index / 2);
		const minutes = index % 2 === 0 ? "00" : "30";
		const timeString = `${hour % 12 === 0 ? 12 : hour % 12}:${minutes} ${hour < 12 ? "AM" : "PM"}`;
		return { value: `${hour}:${minutes}`, label: timeString };
	});
	const getDefaultTimeSlot = () => {
		const now = new Date();
		const minutes = now.getMinutes();
		const roundedMinutes = minutes < 30 ? "00" : "30";
		const hour = now.getHours();
		return `${hour}:${roundedMinutes}`;
	};

	useEffect(() => {
		if (selectedDate) {
			const defaultTimeSlot = getDefaultTimeSlot();
			setSelectedTime(defaultTimeSlot);
			onOpen();
		}
	}, [selectedDate]);

	const handleDateSelect = (date: Date) => {
		setSelectedDate(date);
		onOpen();
	};

	const handleNextClick = async () => {
		if (selectedDate && selectedTime) {
			// Combine date and time into a single Date object
			const [hours, minutes] = selectedTime.split(":").map(Number);
			const finalDate = new Date(selectedDate);
			finalDate.setHours(hours);
			finalDate.setMinutes(minutes);

			// Convert finalDate to ISO strings for the API request
			const timeMin = finalDate.toISOString();
			const timeMax = new Date(finalDate.getTime() + 30 * 60 * 1000).toISOString(); // 30 minutes later

			// Check availability using the hook
			await checkAvailability(timeMin, timeMax);

			// If available, proceed to the next step
			if (availability === "Available") {
				onNext(finalDate);
			}
		}
	};

	return (
		<Container
			opacity="0.9"
			maxW={isOpen ? "3xl" : "md"}
			py={{ base: "12", md: "24" }}
			mt={80}
			bgColor="brand.600"
			borderRadius={20}
			transition="max-width 0.5s ease-in-out">
			<Flex direction={isOpen ? "row" : "column"} alignItems="flex">
				<VStack spacing={4} flex={1}>
					<Text fontSize="xl">Select your preferred day</Text>
					<Calendar date={selectedDate} onChange={handleDateSelect} />
				</VStack>

				{isOpen && (
					<VStack spacing={4} flex={1} ml={8} transition="opacity 0.5s ease-in-out" opacity={isOpen ? 1 : 0}>
						<Text fontSize="lg" mt={4}>
							Select Time (in 30-minute increments)
						</Text>
						<Select
							options={timeSlots}
							onChange={(option) => setSelectedTime(option?.value ?? null)}
							isClearable
							placeholder="Select a time"
							value={timeSlots.find((slot) => slot.value === selectedTime)}
						/>
						{loading && <Spinner size="lg" color="grey.500" />}
						{error && (
							<Alert status="error">
								<AlertIcon />
								{error}
							</Alert>
						)}
						{availability && (
							<Alert status={availability === "Available" ? "success" : "warning"}>
								<AlertIcon />
								{availability === "Available" ? "The selected time is available!" : "The selected time is busy!"}
							</Alert>
						)}
					</VStack>
				)}
			</Flex>

			<VStack spacing={4} mt={4} alignItems="center">
				<Button colorScheme="teal" isDisabled={!selectedDate || !selectedTime || loading} onClick={handleNextClick}>
					Next
				</Button>
			</VStack>
		</Container>
	);
};

export default ReservationComponent;
