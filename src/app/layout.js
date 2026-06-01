// src/app/layout.jsx
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import localFont from 'next/font/local';
import { DonateProvider } from '@/context/DonateContext';
import DonateModal from '@/components/DonateModal';
import './globals.css';

const ranchWater = localFont({
  src: './fonts/RanchWater.otf', // Point directly to your file
  variable: '--ranch-water',         // This creates the CSS variable
  display: 'swap',
});

const cowboy = localFont({
  src: './fonts/COWBOY.otf', // Point directly to your file
  variable: '--cowboy',         // This creates the CSS variable
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${ranchWater.variable} ${cowboy.variable}`}>
      <body>
        <DonateProvider>
          <Navbar />
            {children}
            <DonateModal />
          <Footer />
        </DonateProvider>
      </body>
    </html>
  );
}