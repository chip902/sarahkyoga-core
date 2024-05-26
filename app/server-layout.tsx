import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Sarah K Yoga",
	description: "Lifelong student and Instructor of Katonah Yoga",
};

const ServerLayout = ({ children }: { children: React.ReactNode }) => {
	return <>{children}</>;
};

export default ServerLayout;
