import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthSessionProvider from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ui/ModeToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Najarpur — A Village in Chandrapur, Nepal",
  description:
    "Explore Najarpur, a vibrant village in Rautahat, Chandrapur, Nepal. Discover its temple, school, and more.",
  keywords: ["Najarpur", "Nepal", "Chandrapur", "Rautahat", "village", "interactive map"],
  openGraph: {
    title: "Najarpur Village",
    description: "An interactive 3D experience of Najarpur, Chandrapur, Nepal.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthSessionProvider>
            {children}
            <ModeToggle />
          </AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}