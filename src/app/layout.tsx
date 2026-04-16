import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const momoTrustSans = localFont({
  src: [
    { path: '../../fonts/MomoTrustSans-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../../fonts/MomoTrustSans-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../../fonts/MomoTrustSans-SemiBold.ttf', weight: '600', style: 'normal' },
  ],
  variable: '--font-momo',
  fallback: ['system-ui', 'sans-serif'],
});

export const metadata: Metadata = {
  title: 'Notion Mail — Email Row',
  description: 'Email Row component playground',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={momoTrustSans.variable}>
      <body>{children}</body>
    </html>
  );
}
