"use client";
import { Button, Container, Text, VStack, Alert, AlertIcon, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import useCheckAvailability from "../components/hooks/useCheckAvailability";

interface IReservationComponentProps {
	onNext: (date: Date) => void;
}

const ReservationComponent = ({ onNext }: IReservationComponentProps) => {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
	const { checkAvailability, availability, loading, error } = useCheckAvailability();

	const handleDateSelect = (date: Date) => {
		setSelectedDate(date);
	};

	const handleNextClick = async () => {
		if (selectedDate) {
			const timeMin = new Date(selectedDate.setHours(8, 0, 0)).toISOString(); // Start of availability window
			const timeMax = new Date(selectedDate.setHours(9, 0, 0)).toISOString(); // End of availability window

			await checkAvailability(timeMin, timeMax);

			if (availability === "Available") {
				onNext(selectedDate);
			}
		}
	};

	return (
		<Container maxW="md" py={{ base: "12", md: "24" }} mt={80} bgColor="brand.600" borderRadius={20}>
			<VStack spacing={4}>
				<Text fontSize="xl">Select your preferred day</Text>
				<Calendar date={selectedDate} onChange={handleDateSelect} />

				{loading && <Spinner size="lg" color="teal.500" />}
				{error && (
					<Alert status="error">
						<AlertIcon />
						{error}
					</Alert>
				)}
				{availability && (
					<Alert status={availability === "Available" ? "success" : "warning"}>
						<AlertIcon />
						{availability === "Available" ? "The selected date is available!" : "The selected date is busy!"}
					</Alert>
				)}

				<Button colorScheme="teal" isDisabled={!selectedDate || loading} onClick={handleNextClick}>
					Next
				</Button>
			</VStack>
		</Container>
	);
};

export default ReservationComponent;
