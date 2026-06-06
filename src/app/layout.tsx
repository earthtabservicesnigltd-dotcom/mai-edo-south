import type { Metadata } from "next";
import { Bebas_Neue, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { Dancing_Script } from 'next/font/google'

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-dancing',
})

const outfit = Outfit({subsets:['latin'], variable:'--font-outfit', display: 'swap'});

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

const SITE_NAME = 'MAI EDO SOUTH'
const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mai4senate.com'
const SITE_DESC = 'Driven by Experience, Inspired by the People and Committed to Real Representation. Vote MAI for Edo South Senatorial District 2027.'

export const metadata: Metadata = {
  title: 'MAI Edo South 2027 — Hon. Matthew Aigbuhenze Iduoriyekemwen',
  description: 'Driven by Experience, Inspired by the People and Committed to Real Representation. Vote MAI for Edo South Senatorial District 2027.',
  keywords: ['MAI', 'Edo South', '2027', 'Senate', 'Matthew Aigbuhenze Iduoriyekemwen', 'ADC', 'Edo State'],
  authors: [{name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_NG',
    url: SITE_URL,
    title: SITE_URL,
    description: SITE_DESC,
  },
  twitter: {
    card: 'summary_large_image',
    site: '@PinnacleNewspaper',
    creator: '@PinnacleNewspaper',
    title: SITE_NAME,
    description: SITE_DESC,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${bebasNeue.variable} ${dancingScript.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}
        <Toaster position="bottom-right" richColors/>
      </body>
    </html>
  );
}
