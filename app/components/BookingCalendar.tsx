"use client";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { Box, Input, Button, VStack, FormControl, FormLabel, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

interface BookingCalendarProps {}

type CalendarValue = Date | Date[] | null;

const BookingCalendar: React.FC<BookingCalendarProps> = () => {
	const [date, setDate] = useState<Date>(new Date());
	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [availability, setAvailability] = useState<any[]>([]);
	const { data: session } = useSession();

	useEffect(() => {
		if (session?.accessToken) {
			fetch("/api/availability", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ accessToken: session.accessToken }),
			})
				.then((response) => response.json())
				.then((data) => setAvailability(data))
				.catch((error) => console.error("Error fetching availability:", error));
		}
	}, [session]);

	const handleDateChange = (value: CalendarValue) => {
		if (value instanceof Date) {
			setDate(value);
		} else if (Array.isArray(value) && value.length > 0) {
			setDate(value[0]);
		}
	};

	const handleSubmit = () => {
		fetch("/api/book", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ date, name, email, accessToken: session?.accessToken }),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.message) {
					alert("Booking successful!");
				} else {
					alert("Booking failed.");
				}
			})
			.catch((error) => console.error("Error booking appointment:", error));
	};

	return (
		<Box>
			<Calendar onChange={() => handleDateChange} value={date} />
			<VStack spacing={4} mt={4}>
				<FormControl id="name">
					<FormLabel>Name</FormLabel>
					<Input value={name} onChange={(e) => setName(e.target.value)} />
				</FormControl>
				<FormControl id="email">
					<FormLabel>Email</FormLabel>
					<Input value={email} onChange={(e) => setEmail(e.target.value)} />
				</FormControl>
				<Button onClick={handleSubmit}>Book</Button>
			</VStack>
			<Box mt={4}>
				<Text>Availability:</Text>
				{availability.map((event) => (
					<Text key={event.id}>
						{event.start.dateTime} - {event.end.dateTime}
					</Text>
				))}
			</Box>
		</Box>
	);
};

export default BookingCalendar;
