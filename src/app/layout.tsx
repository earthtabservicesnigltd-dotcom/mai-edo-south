import type { Metadata } from "next";
import { Bebas_Neue, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const outfit = Outfit({subsets:['latin'], variable:'--font-outfit', display: 'swap'});

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MAI Edo South 2027 — Hon. Matthew Aigbuhenze Iduoriyekemwen',
  description: 'Driven by Experience, Inspired by the People and Committed to Real Representation. Vote MAI for Edo South Senatorial District 2027.',
  keywords: ['MAI', 'Edo South', '2027', 'Senate', 'Matthew Aigbuhenze Iduoriyekemwen', 'ADC', 'Edo State'],

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${bebasNeue.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}
        <Toaster position="bottom-right" richColors/>
      </body>
    </html>
  );
}
