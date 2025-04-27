// BookingPage.tsx
"use client";
import { Container, VStack } from "@chakra-ui/react";
import ReservationComponent from "./ReservationComponent";

const BookingPage = () => {
	return (
		<Container maxW="5xl" py={12} mt={8}>
			<VStack spacing={4}>
				<ReservationComponent
					onNext={(availableOptions, dateTime) => {
						console.log("Available options:", availableOptions);
						console.log("Selected Date/Time:", dateTime);
						// Handle navigation or further logic here
					}}
				/>
			</VStack>
		</Container>
	);
};

export default BookingPage;
