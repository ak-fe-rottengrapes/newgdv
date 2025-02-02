'use client'
import { UserLayout } from "../../components/layouts/UserLayout"
import { SessionProvider } from "next-auth/react";
import { ToolProvider } from "../context/ToolContext";

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      <ToolProvider>
        <UserLayout>{children}</UserLayout>
      </ToolProvider>
    </SessionProvider>
  )
} 