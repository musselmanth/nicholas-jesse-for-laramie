import dynamic from 'next/dynamic';

const WardMap = dynamic(() => import('@/components/WardMap'), { ssr: false });

export default function MapPage() {
  return (
    <main style={{ height: '100vh', overflow: 'hidden' }}>
      <WardMap fullScreen />
    </main>
  );
}
