'use client';

import { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Fill, Stroke, Text, Circle as CircleStyle } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import Link from 'next/link';

export default function WardMap({ fullScreen = false }) {
  const mapElement = useRef(null);
  
  // Keep tracks of map elements across renders so our search function can access them
  const mapInstance = useRef(null);
  const vectorSourceRef = useRef(null);
  const markerSourceRef = useRef(null);

  // UI State for Search Form
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '', ward: null });

  useEffect(() => {
    if (mapInstance.current) return;

    // Initialize the main GeoJSON layer source
    const vectorSource = new VectorSource({
      url: '/wards.geojson', 
      format: new GeoJSON({
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      }),
    });
    vectorSourceRef.current = vectorSource;

    // Initialize an empty layer specifically for dropping the search marker pin
    const markerSource = new VectorSource();
    markerSourceRef.current = markerSource;

    const fullScreenColors = {
      'Ward 1': { fill: 'rgba(220, 101, 58, 0.3)',  stroke: '#dc653a', label: '#7a2c0e' },
      'Ward 2': { fill: 'rgba(83, 137, 91, 0.3)',   stroke: '#53895b', label: '#1e4024' },
      'Ward 3': { fill: 'rgba(90, 120, 180, 0.3)',  stroke: '#5a78b4', label: '#1e3060' },
    };

    const wardStyleFunction = (feature) => {
      const wardName = feature.get('Ward');

      if (fullScreen) {
        const colors = fullScreenColors[wardName] ?? { fill: 'rgba(120,120,120,0.25)', stroke: '#666', label: '#444' };
        return new Style({
          fill: new Fill({ color: colors.fill }),
          stroke: new Stroke({ color: colors.stroke, width: 2.5 }),
          text: new Text({
            text: wardName,
            font: 'bold 15px sans-serif',
            fill: new Fill({ color: colors.label }),
            stroke: new Stroke({ color: '#FFFFFF', width: 4 }),
            overflow: true,
          })
        });
      }

      const isWard1 = wardName === 'Ward 1';
      return new Style({
        fill: new Fill({ color: isWard1 ? 'rgba(224, 90, 61, 0.25)' : 'rgba(120, 120, 120, 0.25)' }),
        stroke: new Stroke({
          color: isWard1 ? '#E05A3D' : '#666666',
          width: isWard1 ? 3 : 1.5,
          lineDash: isWard1 ? null : [5, 5]
        }),
        text: new Text({
          text: wardName,
          font: isWard1 ? 'bold 16px sans-serif' : 'bold 13px sans-serif',
          fill: new Fill({ color: isWard1 ? '#5c2214' : '#444444' }),
          stroke: new Stroke({ color: '#FFFFFF', width: 4 }),
          overflow: true,
        })
      });
    };

    // Style for the searched location pin
    const markerLayer = new VectorLayer({
      source: markerSource,
      style: new Style({
        image: new CircleStyle({
          radius: 8,
          fill: new Fill({ color: '#000000' }),
          stroke: new Stroke({ color: '#FFFFFF', width: 3 })
        })
      })
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: wardStyleFunction, 
    });

    mapInstance.current = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        vectorLayer,
        markerLayer // Layer order ensures pin stays on top of boundaries
      ],
      view: new View({
        center: fromLonLat([-105.5911, 41.3114]),
        zoom: 13,
      }),
    });

    // iOS WebKit reports 0 dimensions during init; force a size recalculation
    setTimeout(() => { mapInstance.current?.updateSize(); }, 200);

    const handleReady = () => {
      if (vectorSource.getState() === 'ready' && vectorSource.getFeatures().length > 0) {
        const totalExtent = vectorSource.getExtent();
        const buffer = 3000; 
        const lockedExtent = [
          totalExtent[0] - buffer,
          totalExtent[1] - buffer,
          totalExtent[2] + buffer,
          totalExtent[3] + buffer 
        ];

        const constrainedView = new View({
          extent: lockedExtent, 
          minZoom: 11,
          maxZoom: 19,
        });

        mapInstance.current.setView(constrainedView);
        constrainedView.fit(totalExtent, {
          padding: [40, 40, 40, 40],
          maxZoom: 14, 
        });

        vectorSource.un('change', handleReady);
      }
    };

    vectorSource.on('change', handleReady);
    handleReady();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(null);
        mapInstance.current = null;
      }
    };
  }, []);

  // Handle the Address Geocoding and Verification
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!address.trim()) return;

    setLoading(true);
    setStatus({ type: null, message: '', ward: null });
    markerSourceRef.current.clear(); // Clear old search markers

    try {
      // 1. Query OpenStreetMap Nominatim API
      // We append ", Laramie, WY" automatically to anchor local results seamlessly
      const query = encodeURIComponent(`${address}, Laramie, WY`);
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${query}&limit=1`);
      const data = await response.json();

      if (!data || data.length === 0) {
        setStatus({ type: 'error', message: 'Could not find your address. Please check spelling or add more specific details.', ward: null });
        setLoading(false);
        return;
      }

      // Format the returned address into a clean "street, city, state" string
      const addr = data[0].address ?? {};
      const streetParts = [addr.house_number, addr.road].filter(Boolean);
      const cityPart = addr.city || addr.town || addr.village || addr.county || '';
      const statePart = addr.state || '';
      const formattedAddress = [...streetParts, cityPart, statePart].filter(Boolean).join(', ');
      if (formattedAddress) setAddress(formattedAddress);

      // Convert result coordinate strings to numbers
      const lon = parseFloat(data[0].lon);
      const lat = parseFloat(data[0].lat);
      const mapCoords = fromLonLat([lon, lat]);

      // 2. Perform Point-in-Polygon matching against our loaded features
      const features = vectorSourceRef.current.getFeatures();
      let matchedWardFeature = null;

      for (let feature of features) {
        const geometry = feature.getGeometry();
        if (geometry && geometry.intersectsCoordinate(mapCoords)) {
          matchedWardFeature = feature;
          break;
        }
      }

      // 3. Evaluate results and set targeted display notifications
      if (!matchedWardFeature) {
        setStatus({ type: 'outside', message: 'This address is located outside the Laramie city limits.', ward: null });
      } else {
        const wardName = matchedWardFeature.get('Ward'); // Matches JSON property key
        
        // Drop marker pin onto the map layout
        const searchMarker = new Feature({
          geometry: new Point(mapCoords)
        });
        markerSourceRef.current.addFeature(searchMarker);

        // Smooth zoom transition to verified address
        mapInstance.current.getView().animate({
          center: mapCoords,
          zoom: 16,
          duration: 1000
        });

        if (wardName === 'Ward 1') {
          setStatus({ type: 'ward1', message: 'You are located in Ward 1!', ward: wardName });
        } else {
          setStatus({ type: 'otherWard', message: `You are located in ${wardName}.`, ward: wardName });
        }
      }

    } catch (err) {
      setStatus({ type: 'error', message: 'There was an error connecting to the address service. Please try again later.', ward: null });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={fullScreen
      ? { position: 'relative', width: '100%', height: '100vh', fontFamily: 'sans-serif' }
      : { fontFamily: 'sans-serif', maxWidth: '100%', margin: '0 auto' }
    }>
      {/* Map Element Containers */}
      <div
        ref={mapElement}
        style={fullScreen
          ? { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'translate3d(0,0,0)', WebkitTransform: 'translate3d(0,0,0)' }
          : {
              width: '100%',
              height: '420px',
              overflow: 'hidden',
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              transform: 'translate3d(0,0,0)',
              WebkitTransform: 'translate3d(0,0,0)',
            }
        }
      />

      {/* Lookup Interfacing Engine */}
      <div style={fullScreen
        ? {
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'min(560px, calc(100% - 2rem))',
            zIndex: 10,
          }
        : { marginTop: '16px' }
      }>
        <form onSubmit={handleSearch} style={{
          display: 'flex',
          gap: '8px',
          ...(fullScreen && {
            background: 'rgba(247, 246, 240, 0.92)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: '10px',
            padding: '10px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)'
          })
        }}>
          <input
            type="text"
            placeholder="Enter your street address (e.g., 502 Main St)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{
              flexGrow: 1,
              padding: '10px 14px',
              borderRadius: '6px',
              border: '1px solid #D1D5DB',
              fontSize: '15px',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#9CA3AF' : '#E05A3D',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '15px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Searching...' : 'Find My Ward'}
          </button>
        </form>

        {/* Dynamic Status Notifications Panels */}
        {status.type && (
          <div style={{
            marginTop: '10px',
            padding: '16px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            lineHeight: '1.5',
            fontSize: '15px',
            backgroundColor: status.type === 'ward1' ? '#F0FDF4' : status.type === 'otherWard' ? '#EFF6FF' : '#FEF2F2',
            border: `1px solid ${status.type === 'ward1' ? '#DCFCE7' : status.type === 'otherWard' ? '#DBEAFE' : '#FEE2E2'}`,
            color: status.type === 'ward1' ? '#14532D' : status.type === 'otherWard' ? '#1E3A8A' : '#7F1D1D'
          }}>
            {/* Success Icon */}
            {status.type === 'ward1' && (
              <svg style={{ width: '20px', height: '20px', color: '#16A34A', flexShrink: 0, marginTop: '2px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}

            {/* Info Icon */}
            {status.type === 'otherWard' && (
              <svg style={{ width: '20px', height: '20px', color: '#2563EB', flexShrink: 0, marginTop: '2px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}

            {/* Warning/Error Icon */}
            {(status.type === 'error' || status.type === 'outside') && (
              <svg style={{ width: '20px', height: '20px', color: '#DC2626', flexShrink: 0, marginTop: '2px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}

            <div>
              <span style={{ fontWeight: '600' }}>{status.message}</span>
              {status.type === 'otherWard' && (
                <div style={{ marginTop: '6px' }}>
                  To view a list of candidates running in your district, visit the{' '}
                  <a 
                    href="https://www.cityoflaramie.org/396/Municipal-Elections" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#2563EB', textDecoration: 'underline', fontWeight: '500' }}
                  >
                    City of Laramie Municipal Elections Portal
                  </a>.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}