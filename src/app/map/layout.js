import localFont from 'next/font/local';
import '../globals.css';

const ranchWater = localFont({
  src: '../fonts/RanchWater.otf',
  variable: '--ranch-water',
  display: 'swap',
});

const cowboy = localFont({
  src: '../fonts/COWBOY.otf',
  variable: '--cowboy',
  display: 'swap',
});

export const metadata = {
  title: 'Ward 1 Map | Nicholas Jesse for Laramie City Council',
  description: 'Interactive map of Laramie wards. Find out if you live in Ward 1.',
};

export default function MapLayout({ children }) {
  return (
    <html lang="en" className={`${ranchWater.variable} ${cowboy.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
