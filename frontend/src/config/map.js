export const DEFAULT_MAP_CENTER = [37.618423, 55.751244];

export const DEFAULT_MAP_ZOOM = 10;

// вместо экспорта объекта создаем функцию, которая будет возвращать
// новый объект для каждой новой карты используемой на проекте
export function getOsmRasterStyle() {
  return {
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
  };
}
