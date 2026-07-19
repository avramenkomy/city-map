import { describe, expect, it } from 'vitest';

import {
  hasPlaceFormErrors,
  validatePlaceForm,
} from '../validatePlaceForm';

describe('validatePlaceForm', () => {
  const validForm = {
    category_id: '1',
    title: 'Central Park',
    description: 'A large city park.',
    address: 'Test address',
    latitude: '55.751244',
    longitude: '37.618423',
    image: null,
  };

  it('returns empty object for valid form', () => {
    expect(validatePlaceForm(validForm)).toEqual({});
  });

  it('requires category', () => {
    const errors = validatePlaceForm({
      ...validForm,
      category_id: '',
    });

    expect(errors.category_id).toBe('places.validation.categoryRequired');
  });

  it('requires title', () => {
    const errors = validatePlaceForm({
      ...validForm,
      title: '   ',
    });

    expect(errors.title).toBe('places.validation.titleRequired');
  });

  it('requires latitude', () => {
    const errors = validatePlaceForm({
      ...validForm,
      latitude: '',
    });

    expect(errors.latitude).toBe('places.validation.latitudeRequired');
  });

  it('rejects latitude outside range', () => {
    const errors = validatePlaceForm({
      ...validForm,
      latitude: '91',
    });

    expect(errors.latitude).toBe('places.validation.latitudeInvalid');
  });

  it('requires longitude', () => {
    const errors = validatePlaceForm({
      ...validForm,
      longitude: '',
    });

    expect(errors.longitude).toBe('places.validation.longitudeRequired');
  });

  it('rejects longitude outside range', () => {
    const errors = validatePlaceForm({
      ...validForm,
      longitude: '181',
    });

    expect(errors.longitude).toBe('places.validation.longitudeInvalid');
  });

  it('hasPlaceFormErrors returns false for empty errors', () => {
    expect(hasPlaceFormErrors({})).toBe(false);
  });

  it('hasPlaceFormErrors returns true when at least one error exists', () => {
    expect(hasPlaceFormErrors({
      title: 'places.validation.titleRequired',
    })).toBe(true);
  });
});
