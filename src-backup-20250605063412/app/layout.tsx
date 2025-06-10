import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nyika Safaris',
  description: 'Experience the best safaris in Africa with Nyika Safaris',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
