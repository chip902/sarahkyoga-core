// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Adjust the import path as needed

const handler = NextAuth(authOptions);

// Next.js 14 App Router expects you to explicitly define the HTTP methods
export { handler as GET, handler as POST };
