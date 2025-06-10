import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | Nyika Safaris',
  description: 'Experience the best African safaris with Nyika Safaris',
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
