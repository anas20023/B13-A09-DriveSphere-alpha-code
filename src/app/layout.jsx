import { Arimo } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const geistSans = Arimo({
  variable: "--font-arimo-sans",
  subsets: ["latin"],
});


export const metadata = {
  title: "DriveSphere | Car Rental Platform",
  description: "DriveSphere is a full-stack car rental platform where users can browse available cars, view detailed vehicle information, book rentals, manage reservations, and maintain personal profiles. The platform features secure JWT authentication, responsive modern UI, booking management, car listing CRUD operations, and scalable NoSQL database architecture using MongoDB.",
  keywords: [
    "Car Rental Platform",
    "Vehicle Booking System",
    "Full Stack Car Rental App",
    "Next.js Car Rental Website",
    "MongoDB Rental Management",
    "JWT Authentication Project",
    "Responsive Car Booking UI",
    "Online Vehicle Rental System",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.className} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <Toaster position="top-right" />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
