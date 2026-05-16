import { safeMap, safeFilter, safeFind, safeSlice, safeLength, isValidArray } from '../array';

describe('Array utilities', () => {
  describe('safeMap', () => {
    it('should map array correctly', () => {
      const result = safeMap([1, 2, 3], x => x * 2);
      expect(result).toEqual([2, 4, 6]);
    });

    it('should return empty array for null/undefined', () => {
      expect(safeMap(null, x => x)).toEqual([]);
      expect(safeMap(undefined, x => x)).toEqual([]);
    });
  });

  describe('safeFilter', () => {
    it('should filter array correctly', () => {
      const result = safeFilter([1, 2, 3, 4], x => x % 2 === 0);
      expect(result).toEqual([2, 4]);
    });

    it('should return empty array for null/undefined', () => {
      expect(safeFilter(null, x => true)).toEqual([]);
      expect(safeFilter(undefined, x => true)).toEqual([]);
    });
  });

  describe('safeFind', () => {
    it('should find element correctly', () => {
      const result = safeFind([1, 2, 3], x => x === 2);
      expect(result).toBe(2);
    });

    it('should return undefined for null/undefined array', () => {
      expect(safeFind(null, x => true)).toBeUndefined();
      expect(safeFind(undefined, x => true)).toBeUndefined();
    });
  });

  describe('safeSlice', () => {
    it('should slice array correctly', () => {
      const result = safeSlice([1, 2, 3, 4, 5], 1, 3);
      expect(result).toEqual([2, 3]);
    });

    it('should return empty array for null/undefined', () => {
      expect(safeSlice(null, 0, 2)).toEqual([]);
      expect(safeSlice(undefined, 0, 2)).toEqual([]);
    });
  });

  describe('safeLength', () => {
    it('should return correct length', () => {
      expect(safeLength([1, 2, 3])).toBe(3);
      expect(safeLength([])).toBe(0);
    });

    it('should return 0 for null/undefined', () => {
      expect(safeLength(null)).toBe(0);
      expect(safeLength(undefined)).toBe(0);
    });
  });

  describe('isValidArray', () => {
    it('should return true for valid non-empty arrays', () => {
      expect(isValidArray([1, 2, 3])).toBe(true);
      expect(isValidArray(['a'])).toBe(true);
    });

    it('should return false for empty, null, or undefined arrays', () => {
      expect(isValidArray([])).toBe(false);
      expect(isValidArray(null)).toBe(false);
      expect(isValidArray(undefined)).toBe(false);
    });
  });
});