import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

// Simple handler for NextAuth
const handler = NextAuth(authOptions);

export { 
  handler as GET, 
  handler as POST 
};
