import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

function PlacesMap(props) {
  const { places, onPlaceClick } = props;

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      // style: 'https://demotiles.maplibre.org/style.json',
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: [
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          },
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
          },
        ],
      },
      center: [37.618423, 55.751244],
      zoom: 10,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    }
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) return;

    markersRef.current = [];

    places.forEach(place => {
      const latitude = Number(place.latitude);
      const longitude = Number(place.longitude);

      if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        return;
      }

      const marker = new maplibregl.Marker()
        .setLngLat([latitude, longitude])
        .addTo(map);

      marker.getElement().addEventListener('click', () => {
        onPlaceClick(place);
      });

      markersRef.current.push(marker);
    });
  }, [places, onPlaceClick]);

  return (
    <section className="map-section">
      <div className="places-map" ref={mapContainerRef} />
    </section>
  )
}

export default PlacesMap;
