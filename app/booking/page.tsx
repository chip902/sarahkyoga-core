"use client";
import React from "react";
import BookingCalendar from "../components/BookingCalendar";
import { Container } from "@chakra-ui/react";
import TestCalendar from "../components/TestCalendar";
import ReservationComponent from "./ReservationComponent";

const BookingPage = () => {
	const handleNext = (date: Date) => {
		// Handle the logic after selecting the date
		console.log("Selected date:", date);
	};

	return (
		<Container my="20vh">
			<ReservationComponent
				onNext={(availableOptions, dateTime) => {
					console.log("Available options:", availableOptions);
					console.log("Selected Date/Time:", dateTime);
					// Handle navigation or further logic here
				}}
			/>
		</Container>
	);
};

export default BookingPage;
