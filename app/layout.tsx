
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/pages/Navbar";
import { Toaster } from "react-hot-toast";
import Snowfall from "react-snowfall";
import SnowEffect from "@/components/SnowEffect";

const defaultUrl = process.env.NEXT_PUBLIC_BASE_URL
  ? `https://${process.env.NEXT_PUBLIC_BASE_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Waste to Wealth",
  description: "Transforming Waste into Resources for a Sustainable Future",
};

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto.className} antialiased bg-eco-background text-eco-primary text-lg`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="min-h-screen flex m-2 gap-3 flex-col">
              <nav>
                <Navbar />
              </nav>
              {children}
              <SnowEffect />
              <Toaster position="top-right" />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
