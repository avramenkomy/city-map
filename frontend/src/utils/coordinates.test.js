import { describe, expect, it } from 'vitest';

import {
  getValidLocation, isBlank, isValidLatitude, isValidLongitude, parseCoordinate
} from './coordinates';

describe('coordinates utils', () => {
  describe('idBlank', () => {
    it('returns true for empty values', () => {
      expect(isBlank('')).toBe(true);
      expect(isBlank('   ')).toBe(true);
      expect(isBlank(null)).toBe(true);
      expect(isBlank(undefined)).toBe(true);
    });

    it('returns false for non-empty values', () => {
      expect(isBlank('0')).toBe(false);
      expect(isBlank(0)).toBe(false);
      expect(isBlank('55.751244')).toBe(false);
    });
  });

  describe('parseCoordinate', () => {
    it('parse valid numeric values', () => {
      expect(parseCoordinate('55.751244')).toBe(55.751244);
      expect(parseCoordinate('-90')).toBe(-90);
      expect(parseCoordinate(0)).toBe(0);
    });

    it('returns null for empty or invalid values', () => {
      expect(parseCoordinate('')).toBe(null);
      expect(parseCoordinate('  ')).toBe(null);
      expect(parseCoordinate('abc')).toBe(null);
      expect(parseCoordinate(null)).toBe(null);
      expect(parseCoordinate(undefined)).toBe(null);
    });
  });

  describe('isValidLatitude', () => {
    it('accept latitude values from -90 to 90', () => {
      expect(isValidLatitude('-90')).toBe(true);
      expect(isValidLatitude('90')).toBe(true);
      expect(isValidLatitude('0')).toBe(true);
      expect(isValidLatitude(55.751244)).toBe(true);
    });

    it('rejects latitude values outside range', () => {
      expect(isValidLatitude('-91')).toBe(false);
      expect(isValidLatitude('91')).toBe(false);
      expect(isValidLatitude('abc')).toBe(false);
      expect(isValidLatitude('')).toBe(false);
    });
  });

  describe('isValidLongitude', () => {
    it('accept longitude values from -180 to 180', () => {
      expect(isValidLongitude('-180')).toBe(true);
      expect(isValidLongitude('180')).toBe(true);
      expect(isValidLongitude('0')).toBe(true);
      expect(isValidLongitude(37.618423)).toBe(true);
    });

    it('rejects longitude values outside range', () => {
      expect(isValidLongitude('-181')).toBe(false);
      expect(isValidLongitude('181')).toBe(false);
      expect(isValidLongitude('abc')).toBe(false);
      expect(isValidLongitude('')).toBe(false);
    });
  });

  describe('isValidLocation', () => {
    it('returns parsed location for valid coordinates', () => {
      expect(getValidLocation('55.751244', '37.618423')).toEqual({
        latitude: 55.751244,
        longitude: 37.618423,
      });
    });

    it('returns null for invalid latitude', () => {
      expect(getValidLocation('999', '37.618423')).toBe(null);
    });

    it('returns null for invalid longitude', () => {
      expect(getValidLocation('55.751244', '999')).toBe(null);
    });

    it('returns null for empty coordinates', () => {
      expect(getValidLocation('', '')).toBe(null);
    });
  });
});
