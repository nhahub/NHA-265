import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LatLngExpression } from 'leaflet'; 

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Workaround: allow using MapContainer with flexible props (avoids strict JSX prop typing issues)
const AnyMapContainer: React.ComponentType<any> = MapContainer;

interface MapMarker {
  lat: number;
  lng: number;
  popupText: string;
}

interface MapComponentProps {
  markers: MapMarker[];
}

const MapComponent: React.FC<MapComponentProps> = ({ markers }) => {
  const defaultPosition: LatLngExpression = [30.0444, 31.2357];
  
  const mapCenter: LatLngExpression =
    markers.length > 0 ? [markers[0].lat, markers[0].lng] : defaultPosition;
  return (
    <AnyMapContainer 
      center={mapCenter}
      zoom={10} 
      style={{ height: '100%', width: '100%' }}>
      <TileLayer
        {...({
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        } as any)}
      />
      
      {markers.map((marker, index) => (
        <Marker key={index} position={[marker.lat, marker.lng]}>
          <Popup>
            {marker.popupText}
          </Popup>
        </Marker>
      ))}
    </AnyMapContainer>
  );
};

export default MapComponent;