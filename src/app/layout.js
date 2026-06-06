// src/app/layout.jsx
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import localFont from 'next/font/local';
import { DonateProvider } from '@/context/DonateContext';
import { GetInvolvedProvider } from '@/context/GetInvolvedContext';
import DonateModal from '@/components/DonateModal';
import './globals.css';
import GetInvolvedModal from '@/components/GetInvolvedModal';
import Script from 'next/script';

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

export const metadata = {
  metadataBase: new URL('https://nicholasjesseforlaramie.com'),
  title: {
    template: '%s | Nicholas Jesse for Laramie City Council',
    default: 'Nicholas Jesse | Laramie City Council Ward 1', // Falls back to this on the homepage
  },
  description: 'Cultivating community, rooted in Laramie. Nicholas Jesse is running for City Council to keep Laramie livable, expand housing, and support our local future.',
  keywords: ['Nicholas Jesse', 'Laramie City Council', 'Ward 1', 'Laramie Wyoming', 'Local Election', 'Voting'],
  openGraph: {
    title: 'Nicholas Jesse for Laramie City Council',
    description: 'Cultivating community, rooted in Laramie.',
    url: 'https://nicholasjesseforlaramie.com',
    siteName: 'Nicholas Jesse for Laramie City Council',
    images: [
      {
        url: '/social.jpg', // You can change this to a specific social sharing card later
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${ranchWater.variable} ${cowboy.variable}`}>
      <head>
      </head>
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
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=G-XBTJ622G7F" 
          strategy="afterInteractive" 
        />
        
        {/* 2. Initialize it with your configuration */}
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-XBTJ622G7F');
          `}
        </Script>
      </body>
    </html>
  );
}