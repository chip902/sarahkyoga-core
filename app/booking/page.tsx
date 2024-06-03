import React from "react";
import BookingCalendar from "../components/BookingCalendar";
import { Container } from "@chakra-ui/react";
import TestCalendar from "../components/TestCalendar";

const BookingPage = () => {
	return (
		<Container my="50vh">
			<BookingCalendar />
		</Container>
	);
};

export default BookingPage;
