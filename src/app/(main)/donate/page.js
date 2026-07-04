'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DonatePage() {
  const router = useRouter();

  useEffect(() => {
    // Instantly redirect to the homepage and append our trigger phrase
    router.replace('/?open=donate');
  }, [router]);

  // Return a blank screen (or a simple loading message) while the split-second redirect happens
  return (
    <div style={{ height: '100vh', backgroundColor: 'var(--brand-olive)' }}></div>
  );
}