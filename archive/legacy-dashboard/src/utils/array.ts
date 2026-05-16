/**
 * Safe array utilities
 */

export const safeMap = <T, U>(array: T[] | undefined | null, fn: (item: T, index: number) => U): U[] => {
  return array?.map(fn) ?? [];
};

export const safeFilter = <T>(array: T[] | undefined | null, predicate: (item: T, index: number) => boolean): T[] => {
  return array?.filter(predicate) ?? [];
};

export const safeFind = <T>(array: T[] | undefined | null, predicate: (item: T, index: number) => boolean): T | undefined => {
  return array?.find(predicate);
};

export const safeSlice = <T>(array: T[] | undefined | null, start?: number, end?: number): T[] => {
  return array?.slice(start, end) ?? [];
};

export const safeLength = <T>(array: T[] | undefined | null): number => {
  return array?.length ?? 0;
};

export const isValidArray = <T>(array: T[] | undefined | null): array is T[] => {
  return Array.isArray(array) && array.length > 0;
};