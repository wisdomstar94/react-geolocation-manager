import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'react-geolocation-manager test',
  description: 'react-geolocation-manager test',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</>
  );
}
