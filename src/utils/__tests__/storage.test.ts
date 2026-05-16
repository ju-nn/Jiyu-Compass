import { vi } from 'vitest';
import { safeGetLocalStorage, safeSetLocalStorage, safeRemoveLocalStorage } from '../storage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Storage utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('safeGetLocalStorage', () => {
    it('should return default value when key does not exist', () => {
      const result = safeGetLocalStorage('nonexistent', 'default');
      expect(result).toBe('default');
    });

    it('should return parsed value when key exists', () => {
      localStorage.setItem('test', JSON.stringify({ value: 42 }));
      const result = safeGetLocalStorage('test', null);
      expect(result).toEqual({ value: 42 });
    });

    it('should return default value when JSON parsing fails', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      localStorage.setItem('invalid', 'invalid json');
      const result = safeGetLocalStorage('invalid', 'default');
      expect(result).toBe('default');
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('safeSetLocalStorage', () => {
    it('should set value successfully', () => {
      const result = safeSetLocalStorage('test', { value: 42 });
      expect(result).toBe(true);
      expect(localStorage.getItem('test')).toBe('{"value":42}');
    });
  });

  describe('safeRemoveLocalStorage', () => {
    it('should remove value successfully', () => {
      localStorage.setItem('test', 'value');
      const result = safeRemoveLocalStorage('test');
      expect(result).toBe(true);
      expect(localStorage.getItem('test')).toBeNull();
    });
  });
});
