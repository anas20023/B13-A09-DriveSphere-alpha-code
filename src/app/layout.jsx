import { Arimo } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import SocialLoginToast from "@/components/SocialLoginToast";
import { ThemeProvider } from "@/providers/ThemeProvider";
import SmoothScroll from "@/components/SmoothScroll";

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
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <ThemeProvider>
          <SmoothScroll />
          <Toaster position="top-right" />
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
          <SocialLoginToast />
        </ThemeProvider>
      </body>
    </html>
  );
}

