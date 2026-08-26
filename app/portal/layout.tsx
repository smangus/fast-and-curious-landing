import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,300&family=Instrument+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap"
        rel="stylesheet"
      />
      <div className="portal">{children}</div>
    </>
  );
}
