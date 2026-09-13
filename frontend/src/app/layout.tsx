import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Lather High School | Best School in Karnal, Haryana",
  description: "Lather High School, Karnal - A prestigious HBSE-affiliated educational institution offering education from UKG to Class 10th with a legacy of academic excellence, strong values, and holistic development.",
  keywords: "Lather High School, Karnal School, Best School Karnal, HBSE School Karnal, Top School Haryana, Lather High School Karnal",
  openGraph: {
    title: "Lather High School, Karnal",
    description: "Empowering Minds, Shaping Futures. Join Karnal's leading school with academic and sports excellence.",
    images: [
      {
        url: "/schoollogo.png",
        width: 800,
        height: 600,
      }
    ],
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col font-body bg-white text-text-main">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
