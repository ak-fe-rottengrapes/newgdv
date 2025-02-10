'use client'

import MapProvider from "@/app/context/MapContext"
import { SessionProvider } from "next-auth/react"
import UserProvider from "@/app/context/UserContext"

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <MapProvider>
        <UserProvider>
          {children}
        </UserProvider>
      </MapProvider>
    </SessionProvider>
  )
}