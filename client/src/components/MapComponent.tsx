import { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Icon } from 'ol/style';
import 'ol/ol.css';
import markerIcon from '../assets/marker.svg';

interface MapComponentProps {
  onSelectLocation?: (location: { lat: number; lng: number }) => void;
  initialLocation?: { lat: number; lng: number };
}

const MapComponent = ({ onSelectLocation, initialLocation }: MapComponentProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const markerLayerRef = useRef<VectorLayer<VectorSource> | null>(null);

  // Create marker style
  const createMarkerStyle = () => {
    return new Style({
      image: new Icon({
        anchor: [0.5, 1],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: markerIcon,
        scale: 1,
      }),
    });
  };

  // Function to add marker
  const addMarker = (coordinate: number[]) => {
    if (!markerLayerRef.current) return;
    
    const vectorSource = markerLayerRef.current.getSource();
    if (!vectorSource) return;

    vectorSource.clear();
    const marker = new Feature({
      geometry: new Point(coordinate),
    });
    
    // Apply the custom style to the marker
    marker.setStyle(createMarkerStyle());
    vectorSource.addFeature(marker);
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Create vector source and layer for marker
    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });
    markerLayerRef.current = vectorLayer;

    // Set initial center (Nigeria or initial location)
    const initialCenter = initialLocation 
      ? fromLonLat([initialLocation.lng, initialLocation.lat])
      : fromLonLat([8.6753, 9.082]); // Nigeria coordinates

    // Initialize map
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: initialCenter,
        zoom: 6,
      }),
    });

    mapInstanceRef.current = map;

    // Add initial marker if location provided
    if (initialLocation) {
      addMarker(initialCenter);
    }

    // Add click handler
    map.on('click', (event) => {
      const coordinate = event.coordinate;
      const lonLat = toLonLat(coordinate);
      
      // Update marker
      addMarker(coordinate);

      // Notify parent component
      if (onSelectLocation) {
        onSelectLocation({
          lng: lonLat[0],
          lat: lonLat[1],
        });
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
        mapInstanceRef.current = null;
      }
    };
  }, [onSelectLocation, initialLocation]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative',
      }} 
    />
  );
};

export default MapComponent;
