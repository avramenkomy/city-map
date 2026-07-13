import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

function PlacesMap(props) {
  const { places, focusedPlace, onPlaceClick } = props;

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      // demo style
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
      markersRef.current.forEach(marker => marker.remove());

      markersRef.current = [];

      map.remove();
      mapRef.current = null;
    }
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) return;

    markersRef.current.forEach(marker => {
      marker.remove();
    });

    markersRef.current = [];

    const bounds = new maplibregl.LngLatBounds();

    places.forEach(place => {
      const latitude = Number(place.latitude);
      const longitude = Number(place.longitude);

      if (Number.isNaN(latitude) || Number.isNaN(longitude)) return;

      const popup = new maplibregl.Popup({
        offset: 24,
      }).setHTML(`
        <strong>${place.title}</strong>
        <br />
        <span>${place.category?.name || ''}</span>
        <br />
        <span>${place.address || ''}</span>
      `);

      const marker = new maplibregl.Marker()
        .setLngLat([longitude, latitude])
        .setPopup(popup)
        .addTo(map);

      marker.getElement().addEventListener('click', () => {
        onPlaceClick(place);
      });

      markersRef.current.push(marker);
      bounds.extend([longitude, latitude]);
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, {
        padding: 60,
        maxZoom: 14,
      })
    }

  }, [places, onPlaceClick]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !focusedPlace) return;

    const latitude = Number(focusedPlace.latitude);
    const longitude = Number(focusedPlace.longitude);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) return;

    map.flyTo({
      center: [longitude, latitude],
      zoom: 14,
      essential: true,
    });
  }, [focusedPlace]);

  return (
    <section className="map-section">
      <div className="places-map" ref={mapContainerRef} />
    </section>
  )
}

export default PlacesMap;
