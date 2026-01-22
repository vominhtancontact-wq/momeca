import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0891b2',
};

export const metadata: Metadata = {
  title: {
    default: "Mỡ Mê Cá - Chuyên cung cấp hải sản tươi sống và IQF",
    template: "%s | Mỡ Mê Cá",
  },
  description: "Mua hải sản tươi sống, IQF chất lượng cao. Cua, tôm, cá, ốc, mực... Giao hàng nhanh, giá tốt nhất thị trường.",
  keywords: ["hải sản", "hải sản tươi", "hải sản IQF", "cua", "tôm", "cá", "ốc", "mực", "seafood", "mỡ mê cá"],
  authors: [{ name: "Mỡ Mê Cá" }],
  creator: "Mỡ Mê Cá",
  publisher: "Mỡ Mê Cá",
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://momeca.vn'),
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://momeca.vn',
    siteName: 'Mỡ Mê Cá',
    title: 'Mỡ Mê Cá - Chuyên cung cấp hải sản tươi sống và IQF',
    description: 'Mua hải sản tươi sống, IQF chất lượng cao. Cua, tôm, cá, ốc, mực... Giao hàng nhanh, giá tốt nhất thị trường.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mỡ Mê Cá - Hải sản tươi sống',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mỡ Mê Cá - Chuyên cung cấp hải sản tươi sống và IQF',
    description: 'Mua hải sản tươi sống, IQF chất lượng cao. Cua, tôm, cá, ốc, mực... Giao hàng nhanh, giá tốt nhất thị trường.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
