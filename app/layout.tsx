import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Fast and the Curious',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
