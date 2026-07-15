export const MAX_PLACE_IMAGE_SIZE = 2 * 1024 * 1024;

export const ALLOWED_PLACE_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
]

export function validatePlaceImagFile(file) {
  if (!file) return null;

  if (file.size > MAX_PLACE_IMAGE_SIZE) {
    return 'places.imageTooLarge';
  }

  if (!ALLOWED_PLACE_IMAGE_TYPES.includes(file.type)) {
    return 'places.imageUnsupportedType'
  }

  return null;
}