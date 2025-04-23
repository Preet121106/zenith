import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ClerkLoaded, ClerkProvider, GoogleOneTap } from "@clerk/nextjs";

const inter = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zenith",
  description:
    "Zenith is a platform that allows users to easily create and generate educational courses using artificial intelligence. By simply entering course details like name, duration, number of chapters, and specifying if videos are included, AI generates the entire course structure along with relevant YouTube videos for each chapter.",
  keywords: [
    "AI Course Generator",
    "AI Course Creation",
    "AI Education",
    "AI Learning",
    "AI Course Builder",
    "Zenith AI",
    "Zenith",
    "Course Creation",
    "Educational Technology",
    "Online Learning",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ClerkProvider>
          <GoogleOneTap />
          <ClerkLoaded>{children}</ClerkLoaded>
        </ClerkProvider>
      </body>
    </html>
  );
}
