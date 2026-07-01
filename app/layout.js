import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: "--font-poppins",
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata = {
  title: 'DealDrop',
  description: 'Never Miss a Price Drop',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>{children}

        <Toaster />
      </body>
    </html>
  );
}