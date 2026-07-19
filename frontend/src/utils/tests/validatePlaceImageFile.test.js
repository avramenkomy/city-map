import { describe, expect, it } from 'vitest';

import {
  MAX_PLACE_IMAGE_SIZE, validatePlaceImagFile
} from '../validatePlaceImageFile';

describe('validatePlaceImageFile tests', () => {
  function createFileMock({ size, type }) {
    return {
      size,
      type,
    };
  }

  it ('returns null if file is not selected', () => {
    expect(validatePlaceImagFile(null)).toBeNull();
    expect(validatePlaceImagFile(undefined)).toBeNull();
  });

  it ('returns null if file is valid', () => {
    const file = createFileMock({
      size: MAX_PLACE_IMAGE_SIZE,
      type: 'image/jpeg'
    });

    expect(validatePlaceImagFile(file)).toBeNull();
  });

  it ('accept png', () => {
    const file = createFileMock({
      size: MAX_PLACE_IMAGE_SIZE,
      type: 'image/png'
    });

    expect(validatePlaceImagFile(file)).toBeNull();
  });

  it ('accept webp', () => {
    const file = createFileMock({
      size: MAX_PLACE_IMAGE_SIZE,
      type: 'image/webp'
    });

    expect(validatePlaceImagFile(file)).toBeNull();
  });

  it ('rejects if type is not allowed', () => {
    const file = createFileMock({
      size: MAX_PLACE_IMAGE_SIZE,
      type: 'image/svg'
    });

    expect(validatePlaceImagFile(file)).toBe('places.imageUnsupportedType');
  });

  it ('rejects error if file is greather as max size', () => {
    const file = createFileMock({
      size: MAX_PLACE_IMAGE_SIZE + 1,
      type: 'image/jpeg'
    });

    expect(validatePlaceImagFile(file)).toBe('places.imageTooLarge');
  });
});
