import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
// Ignore missing type declarations for side-effect CSS import in this file
// TypeScript may complain if there's no global declaration for '*.css'
// @ts-ignore
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://textngo.in";
const siteName = "TextnGo";
const siteTitle = "TextnGo - AI Text Formatter, Cleaner and Resume Optimizer";
const siteDescription =
  "TextnGo helps you clean, format, rewrite, fix grammar, optimize resumes, and prepare text for email, social media, and code in seconds.";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteName,
  url: siteUrl,
  logo: `${siteUrl}/icon.svg`,
  sameAs: [],
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: siteUrl,
  inLanguage: "en-IN",
  description: siteDescription,
  publisher: {
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
  },
};

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: siteName,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web Browser",
  url: siteUrl,
  image: `${siteUrl}/opengraph-image`,
  description: siteDescription,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: siteTitle,
    template: "%s | TextnGo",
  },
  description: siteDescription,
  keywords: [
    "AI text formatter",
    "text cleaner",
    "resume optimizer",
    "grammar fixer",
    "paragraph formatter",
    "case converter",
    "professional text rewriter",
    "text normalizer",
    "remove extra spaces",
    "online writing tools",
  ],
  authors: [{ name: "TextnGo Team", url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "technology",
  classification: "Productivity software",
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: siteTitle,
    description: siteDescription,
    locale: "en_IN",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "TextnGo AI text formatter and cleaner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6d28d9" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        {children}

        <Script
          id="textngo-organization-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
        >
          {JSON.stringify(organizationJsonLd)}
        </Script>
        <Script
          id="textngo-website-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
        >
          {JSON.stringify(webSiteJsonLd)}
        </Script>
        <Script
          id="textngo-software-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
        >
          {JSON.stringify(softwareApplicationJsonLd)}
        </Script>

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

        <Script
          id="google-adsense"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7211795627084856"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
