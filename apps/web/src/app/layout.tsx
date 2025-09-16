import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout/Layout";
import { ContactModalProvider } from "./contexts/ContactModalContext";
import ContactModal from "@/components/ui/ContactModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "M. Collations - Machines distributrices à Québec et Lévis",
  description: "Service de machines distributrices clé en main avec collations fraîches pour entreprises, écoles et arénas à Québec et Lévis. Installation rapide et service fiable.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ContactModalProvider>
          <Layout>
            {children}
            <ContactModal />
          </Layout>
        </ContactModalProvider>
      </body>
    </html>
  );
}
