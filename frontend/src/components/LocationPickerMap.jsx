import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, getOsmRasterStyle } from '../config/map';

function LocationPickerMap({ latitude, longitude, onChange }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getOsmRasterStyle(),
      center: DEFAULT_MAP_CENTER,
      zoom: DEFAULT_MAP_ZOOM,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.on('load', () => {
      map.resize();
    });

    map.on('click', (event) => {
      const nextLongitude = event.lngLat.lng.toFixed(6);
      const nextLatitude = event.lngLat.lat.toFixed(6);

      onChangeRef.current({
        latitude: nextLatitude,
        longitude: nextLongitude,
      });
    });

    mapRef.current = map;

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }

      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    const numericLatitude = Number(latitude);
    const numericLongitude = Number(longitude);

    if (Number.isNaN(numericLatitude) || Number.isNaN(numericLongitude)) {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }

      return;
    }

    const coordinates = [numericLongitude, numericLatitude];

    if (!markerRef.current) {
      markerRef.current = new maplibregl.Marker()
        .setLngLat(coordinates)
        .addTo(map);
    } else {
      markerRef.current.setLngLat(coordinates);
    }
  }, [longitude, latitude]);

  return (
    <div className="location-picker">
      <div className="location-picker__map" ref={mapContainerRef} />
    </div>
  );
}

export default LocationPickerMap;
