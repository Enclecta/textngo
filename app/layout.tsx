import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://textngo.in"), // change to your real domain

  title: {
    default: "TextnGo – AI Text Formatter, Cleaner & Resume Optimizer",
    template: "%s | TextnGo",
  },

  description:
    "TextnGo is a powerful AI-powered text formatter and cleaner. Fix grammar, rewrite professionally, optimize resumes, remove extra spaces, convert case, and prepare text for email, social media, and code instantly.",

  keywords: [
    "AI text formatter",
    "text cleaner tool",
    "grammar fixer online",
    "resume optimizer AI",
    "case converter tool",
    "remove extra spaces",
    "text normalizer",
    "rewrite text professionally",
    "camel case converter",
    "AI writing assistant",
  ],

  authors: [{ name: "TextnGo Team" }],

  creator: "TextnGo",
  publisher: "TextnGo",

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    title: "TextnGo – AI Text Formatter & Cleaner",
    description:
      "Clean, format, rewrite, and optimize text instantly with AI. Perfect for resumes, emails, social media, and code formatting.",
    url: "https://textngo.in",
    siteName: "TextnGo",
    images: [
      {
        url: "/images/logo.png", // create this in public folder
        width: 1200,
        height: 630,
        alt: "TextnGo AI Text Formatter",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "TextnGo – AI Text Formatter & Resume Optimizer",
    description: "Instantly clean, rewrite, and format your text with AI.",
    images: ["/images/logo.png"],
    creator: "@yourtwitterhandle", // optional
  },

  category: "technology",

  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  manifest: "/site.webmanifest",

  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2563eb" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-N910LT7CB8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N910LT7CB8', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </body>
    </html>
  );
}
