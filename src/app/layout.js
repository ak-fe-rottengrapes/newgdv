
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MapProvider from './context/MapContext';
import { Toaster } from "@/components/ui/toaster"

export const metadata = {
  title: "Geodatavault",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={``}
      >
          <MapProvider>
            {children}
            <Toaster />
          </MapProvider>
      </body>
    </html>
  );
}
