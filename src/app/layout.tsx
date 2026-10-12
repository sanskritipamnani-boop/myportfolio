import type { Metadata, Viewport } from 'next';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Sanskriti Pamnani — Design Portfolio',
    template: '%s | Sanskriti Pamnani',
  },
  description: 'Product designer focused on interaction, systems, and the space between.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Sanskriti Pamnani Portfolio',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
