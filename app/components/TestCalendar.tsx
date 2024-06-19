"use client";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Box } from "@chakra-ui/react";

const TestCalendar: React.FC = () => {
	const [date, setDate] = useState<Date>(new Date());

	return (
		<Box>
			<Calendar onChange={() => setDate} value={date} />
		</Box>
	);
};

export default TestCalendar;
