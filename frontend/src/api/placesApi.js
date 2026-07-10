export async function getPlaces() {
  const response = await fetch('/api/places/');

  if (!response.ok) {
    throw new Error('Failed to load places.');
  }

  return response.json();
}
