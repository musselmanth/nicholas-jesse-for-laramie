import WardMap from '@/components/WardMapClient';

export default function MapPage() {
  return (
    <main style={{ height: '100vh', overflow: 'hidden' }}>
      <WardMap fullScreen />
    </main>
  );
}
