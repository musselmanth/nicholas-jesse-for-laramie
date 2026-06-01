'use client';

import { useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Fill, Stroke } from 'ol/style';
import { fromLonLat, transformExtent } from 'ol/proj';

export default function WardMap() {
  const mapElement = useRef(null);
  const mapInstance = useRef(null);

useEffect(() => {
    if (mapInstance.current) return;

    const vectorSource = new VectorSource({
      url: '/nicholas-jesse-for-laramie/ward1.geojson',
      format: new GeoJSON(),
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        fill: new Fill({ color: 'rgba(224, 90, 61, 0.2)' }),
        stroke: new Stroke({ color: '#E05A3D', width: 3 }),
      }),
    });

    // 1. Initialize Map with a temporary view
    mapInstance.current = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([-105.5911, 41.3114]), 
        zoom: 13,
      }),
    });

    // 2. Wait for the data, then lock it down
    vectorSource.once('change', () => {
      if (vectorSource.getState() === 'ready') {
        const wardExtent = vectorSource.getExtent();

        // Step A: Create an invisible fence slightly larger than the ward.
        // OpenLayers uses meters for its default projection. This adds a 3,000 meter (3km) buffer.
        const buffer = 3000; 
        const lockedExtent = [
          wardExtent[0] - buffer, // min X (West)
          wardExtent[1] - buffer, // min Y (South)
          wardExtent[2] + buffer, // max X (East)
          wardExtent[3] + buffer  // max Y (North)
        ];

        // Step B: Create a brand NEW View with the hard constraints applied
        const constrainedView = new View({
          extent: lockedExtent, // The invisible fence is applied here!
          minZoom: 12,
          maxZoom: 19,
        });

        // Step C: Swap the map to use this new, locked-down view
        mapInstance.current.setView(constrainedView);

        // Step D: Zoom in perfectly to the ward polygon
        constrainedView.fit(wardExtent, {
          padding: [50, 50, 50, 50],
          maxZoom: 15,
        });
      }
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(null);
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={mapElement} 
      style={{ 
        width: '100%', 
        height: '400px', // Adjust this height as needed!
        overflow: 'hidden',
      }} 
    />
  );
}