import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dartboard',
  description: 'Realistic SVG dartboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
