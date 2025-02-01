'use client'
import { UserLayout } from "../../components/layouts/UserLayout"
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }) {
  return <UserLayout><SessionProvider>{children}</SessionProvider></UserLayout>;
} 