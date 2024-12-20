import { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Icon, Style } from "ol/style";
import markerIcon from "../assets/marker.svg";

interface StaticMapComponentProps {
  coordinates: {
    lat: number;
    lng: number;
  };
  height?: string;
}

export default function StaticMapComponent({
  coordinates,
  height = "400px",
}: StaticMapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Convert coordinates to OpenLayers format
    const markerCoordinates = fromLonLat([coordinates.lng, coordinates.lat]);

    // Create marker style
    const markerStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: markerIcon,
        scale: 1.2,
      }),
    });

    // Create marker feature
    const markerFeature = new Feature({
      geometry: new Point(markerCoordinates),
    });
    markerFeature.setStyle(markerStyle);

    // Create vector layer for marker
    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [markerFeature],
      }),
    });

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
        center: markerCoordinates,
        zoom: 15,
        maxZoom: 19,
        minZoom: 10,
      }),
    });

    mapInstanceRef.current = map;

    // Ensure the map updates when coordinates change
    map.getView().setCenter(markerCoordinates);
    map.getView().setZoom(15);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
        mapInstanceRef.current = null;
      }
    };
  }, [coordinates.lat, coordinates.lng]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: height,
        position: "relative",
      }}
    />
  );
}
