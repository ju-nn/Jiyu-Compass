/**
 * Math utilities with precision handling
 */

/**
 * Round to specified decimal places to avoid floating point errors
 */
export const roundToPrecision = (value: number, decimals: number = 2): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

/**
 * Safe division that handles division by zero
 */
export const safeDivide = (numerator: number, denominator: number, fallback: number = 0): number => {
  if (denominator === 0 || !isFinite(denominator)) {
    return fallback;
  }
  return numerator / denominator;
};

/**
 * Clamp value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Check if a number is valid (not NaN, not Infinity)
 */
export const isValidNumber = (value: number): boolean => {
  return typeof value === 'number' && isFinite(value) && !isNaN(value);
};

/**
 * Safe percentage calculation
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return roundToPrecision((value / total) * 100);
};