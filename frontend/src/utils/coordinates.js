export function isBlank(value) {
  return String(value ?? '').trim() === '';
}


export function parseCoordinate(value) {
  if (isBlank(value)) return null;

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}


export function isValidLatitude(value) {
  const number = typeof value === 'number' ? value : parseCoordinate(value);

  return number !== null && number <= 90 && number >= -90
}


export function isValidLongitude(value) {
  const number = typeof value === 'number' ? value : parseCoordinate(value);

  return number !== null && number <= 180 && number >= -180;
}


export function getValidLocation(latitude, longitude) {
  const parsedLatitude = parseCoordinate(latitude);
  const parsedLongitude = parseCoordinate(longitude);

  if (!isValidLatitude(parsedLatitude) || !isValidLongitude(parsedLongitude)) {
    return null;
  }

  return {
    latitude: parsedLatitude,
    longitude: parsedLongitude,
  };
}
