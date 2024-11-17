"use client";
import { useEffect, useState } from "react";

const useResponsive = () => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 968);
		};
		handleResize();

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [setIsMobile]);

	return isMobile;
};

export default useResponsive;
