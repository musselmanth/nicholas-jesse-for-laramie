// src/app/layout.jsx
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import localFont from 'next/font/local';
import { DonateProvider } from '@/context/DonateContext';
import { GetInvolvedProvider } from '@/context/GetInvolvedContext';
import DonateModal from '@/components/DonateModal';
import './globals.css';
import GetInvolvedModal from '@/components/GetInvolvedModal';

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
          <GetInvolvedProvider>
            <Navbar />
              {children}
              <DonateModal />
              <GetInvolvedModal />
            <Footer />
            </GetInvolvedProvider>
        </DonateProvider>
      </body>
    </html>
  );
}