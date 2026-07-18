import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

import {
  DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, getOsmRasterStyle,
} from '../config/map';


function parseCoordinate(value) {
  if ((String(value) || '').trim() === '') {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}


function isValidLatitude(value) {
  return value !== null && value >= -90 && value <= 90;
}


function isValidLongitude(value) {
  return value !== null && value >= -180 && value <= 180;
}


function getValidLocation(latitude, longitude) {
  const parsedLatitude = parseCoordinate(latitude);
  const parsedLongitude = parseCoordinate(longitude);

  if (!isValidLatitude(parsedLatitude) || !isValidLongitude(parsedLongitude)) {
    return null;
  }

  return {
    latitude: parsedLatitude,
    longitude: parsedLongitude,
  }
}


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
      return undefined;
    }

    const validLocation = getValidLocation(latitude, longitude);
    const initLocation = validLocation || DEFAULT_MAP_CENTER;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getOsmRasterStyle(),
      center: DEFAULT_MAP_CENTER,
      zoom: DEFAULT_MAP_ZOOM,
    });

    mapRef.current = map;

    const marker = new maplibregl.Marker({ draggable: false })
      .setLngLat(initLocation)
      .addTo(map);

    markerRef.current = marker;

    // map.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.on('click', (event) => {
      const nextLocation = {
        longitude:  event.lngLat.lng.toFixed(6),
        latitude: event.lngLat.lat.toFixed(6),
      }

      marker.setLngLat([
        Number(nextLocation.longitude),
        Number(nextLocation.latitude)
      ]);

      onChangeRef.current(nextLocation);
    });

    map.on('load', () => {
      map.resize();
    });

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!markerRef.current) return;

    const validLocation = getValidLocation(latitude, longitude);

    if (!validLocation) return;

    markerRef.current.setLngLat([
      validLocation.longitude,
      validLocation.latitude,
    ]);
  }, [longitude, latitude]);

  return (
    <div className="location-picker">
      <div className="location-picker__map" ref={mapContainerRef} />
    </div>
  );
}

export default LocationPickerMap;
