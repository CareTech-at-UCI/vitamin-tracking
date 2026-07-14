import type { Metadata } from "next";
import { Montserrat_Alternates, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/navbar";
import { ScanChromeProvider } from "@/app/scan/_components/ScanChromeContext";

const montserrat = Montserrat_Alternates({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "600", "700"],
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  weight: ["400", "500", "600"],
});

const montserratAlternates = Montserrat_Alternates({
  variable: "--font-montserrat-alternates",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "VitaMind",
  description: "VitaMind is a comprehensive health and wellness platform that empowers users to take control of their well-being. With personalized insights, expert guidance, and a supportive community, VitaMind helps you achieve your health goals and live your best life.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${instrument.variable} ${montserratAlternates.variable} ${instrumentSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ScanChromeProvider>
          <AppShell>{children}</AppShell>
        </ScanChromeProvider>
      </body>
    </html>
  );
}