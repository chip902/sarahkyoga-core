// app/booking/checkout/page.tsx
"use client";
import dynamic from "next/dynamic";
const CheckoutPage = dynamic(() => import("@/app/components/CheckoutPage"), { ssr: false });

export default function BookingCheckoutPage() {
	return <CheckoutPage />;
}
