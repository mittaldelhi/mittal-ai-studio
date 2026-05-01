import type { Metadata, Viewport } from "next";
import { ChatWidget } from "@/components/chatbot/ChatWidget";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mittalai.studio"),
  title: {
    default: "Mittal AI Studio | AI Solutions for Local Businesses",
    template: "%s | Mittal AI Studio",
  },
  description:
    "Mittal AI Studio builds AI-powered websites, chatbots, WhatsApp automations, and Google Business systems for local businesses in Rajasthan.",
  keywords: [
    "AI website development",
    "Google Business optimization",
    "AI chatbot",
    "WhatsApp automation",
    "local SEO Rajasthan",
    "Bhiwadi",
    "Alwar",
    "Jaipur",
  ],
  openGraph: {
    title: "Mittal AI Studio",
    description: "Premium AI agency for local businesses across Bharat.",
    url: "https://mittalai.studio",
    siteName: "Mittal AI Studio",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mittal AI Studio",
    description: "AI-powered websites, automation, and local growth systems.",
  },
};

export const viewport: Viewport = {
  themeColor: "#F7FBFF",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('mittal-theme')==='dark'?'dark':'light';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;}catch(e){}",
          }}
        />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
