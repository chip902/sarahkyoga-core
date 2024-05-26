"use client";
import { useState } from "react";
import { useToast, Box, Button, FormControl, FormLabel, Input, Textarea, VStack } from "@chakra-ui/react";

const ContactForm = () => {
	const toast = useToast();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const res = await fetch("/api/send-email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					to: "marilyn@marilynrifkin.com",
					from: formData.email,
					subject: `Contact Form Submission from ${formData.name}`,
					text: formData.message,
					html: `<p>${formData.message}</p>`,
				}),
			});

			if (!res.ok) {
				toast({
					title: "Message send failed.",
					description: "There was a problem and your message was not set.",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			} else {
				toast({
					title: "Message sent!",
					description: "Thank you for your note!  I'll be in touch shortly...",
					status: "success",
					duration: 5000,
					isClosable: true,
				});
				setFormData({
					name: "",
					email: "",
					message: "",
				});
			}
		} catch (error) {
			toast({
				title: "Message send failed.",
				description: "There was a problem and your message was not set",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
	};

	return (
		<Box p={8} maxW="800px" mx="auto">
			<form onSubmit={handleSubmit}>
				<VStack spacing={4}>
					<FormControl id="name" isRequired>
						<FormLabel>Name</FormLabel>
						<Input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" />
					</FormControl>
					<FormControl id="email" isRequired>
						<FormLabel>Email</FormLabel>
						<Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" />
					</FormControl>
					<FormControl id="message" isRequired>
						<FormLabel>Message</FormLabel>
						<Textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your Message" />
					</FormControl>
					<Button type="submit" variant="inline" size="lg" mt={4}>
						Send Message
					</Button>
				</VStack>
			</form>
		</Box>
	);
};

export default ContactForm;
