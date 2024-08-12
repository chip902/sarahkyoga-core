import { Button, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface IReservationComponentProps {
	onNext: (date: Date) => void;
}

const ReservationComponent = ({ onNext }: IReservationComponentProps) => {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

	const handleDateSelect = (date: Date) => {
		setSelectedDate(date);
	};

	return (
		<VStack spacing={4}>
			<Text fontSize="xl">Select your preferred day</Text>
			<Calendar date={selectedDate} onChange={handleDateSelect} />
			<Button colorScheme="teal" isDisabled={!selectedDate} onClick={() => selectedDate && onNext(selectedDate)}>
				Next
			</Button>
		</VStack>
	);
};

export default ReservationComponent;
