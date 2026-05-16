import { roundToPrecision, safeDivide, clamp, isValidNumber, calculatePercentage } from '../math';

describe('Math utilities', () => {
  describe('roundToPrecision', () => {
    it('should round to specified decimal places', () => {
      expect(roundToPrecision(3.14159, 2)).toBe(3.14);
      expect(roundToPrecision(3.14159, 4)).toBe(3.1416);
    });

    it('should handle default precision', () => {
      expect(roundToPrecision(3.14159)).toBe(3.14);
    });
  });

  describe('safeDivide', () => {
    it('should divide correctly', () => {
      expect(safeDivide(10, 2)).toBe(5);
      expect(safeDivide(7, 3)).toBeCloseTo(2.333, 3);
    });

    it('should return fallback for division by zero', () => {
      expect(safeDivide(10, 0)).toBe(0);
      expect(safeDivide(10, 0, -1)).toBe(-1);
    });

    it('should return fallback for infinite denominator', () => {
      expect(safeDivide(10, Infinity)).toBe(0);
      expect(safeDivide(10, -Infinity)).toBe(0);
    });
  });

  describe('clamp', () => {
    it('should clamp values within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('isValidNumber', () => {
    it('should return true for valid numbers', () => {
      expect(isValidNumber(42)).toBe(true);
      expect(isValidNumber(0)).toBe(true);
      expect(isValidNumber(-3.14)).toBe(true);
    });

    it('should return false for invalid numbers', () => {
      expect(isValidNumber(NaN)).toBe(false);
      expect(isValidNumber(Infinity)).toBe(false);
      expect(isValidNumber(-Infinity)).toBe(false);
    });
  });

  describe('calculatePercentage', () => {
    it('should calculate percentage correctly', () => {
      expect(calculatePercentage(25, 100)).toBe(25);
      expect(calculatePercentage(1, 3)).toBe(33.33);
    });

    it('should return 0 for division by zero', () => {
      expect(calculatePercentage(10, 0)).toBe(0);
    });
  });
});