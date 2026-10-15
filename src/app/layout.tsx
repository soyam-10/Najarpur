import type { Metadata } from "next";
import "./globals.css";
import AuthSessionProvider from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { village } from "@/config/village";

export const metadata: Metadata = {
  title: `${village.name} — ${village.location}`,
  description: `Explore ${village.name}, ${village.location}. An interactive 3D map of the village's landmarks, stories, and community life.`,
  keywords: [village.name, "Nepal", ...village.location.split(" · "), "village", "interactive map"],
  openGraph: {
    title: `${village.name} Village`,
    description: `An interactive 3D experience of ${village.name}, ${village.location}.`,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ne-Latn" suppressHydrationWarning>
      <head>
        {/* Playfair Display + DM Sans from Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
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
