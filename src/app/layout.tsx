import type { Metadata } from 'next';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Your Name — Design Portfolio',
    template: '%s | Your Name',
  },
  description: 'Product designer focused on interaction, systems, and the space between.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Your Name Portfolio',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
