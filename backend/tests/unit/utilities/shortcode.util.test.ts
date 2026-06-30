import { generateShortCode, isValidShortCode } from '../../../src/utilities/shortcode.util';

describe('ShortCode Utility', () => {
  describe('generateShortCode', () => {
    it('should generate a string of length 7', () => {
      const code = generateShortCode();
      expect(code).toHaveLength(7);
    });

    it('should only contain alphanumeric characters', () => {
      const code = generateShortCode();
      expect(code).toMatch(/^[a-z0-9]+$/);
    });

    it('should generate unique codes', () => {
      const codes = new Set(Array.from({ length: 100 }, () => generateShortCode()));
      expect(codes.size).toBeGreaterThan(90);
    });
  });

  describe('isValidShortCode', () => {
    it('should return true for valid codes', () => {
      expect(isValidShortCode('abc123')).toBe(true);
      expect(isValidShortCode('my-link')).toBe(true);
      expect(isValidShortCode('my_link')).toBe(true);
      expect(isValidShortCode('ABC123')).toBe(true);
    });

    it('should return false for codes shorter than 3 characters', () => {
      expect(isValidShortCode('ab')).toBe(false);
      expect(isValidShortCode('a')).toBe(false);
    });

    it('should return false for codes longer than 50 characters', () => {
      expect(isValidShortCode('a'.repeat(51))).toBe(false);
    });

    it('should return false for codes with invalid characters', () => {
      expect(isValidShortCode('my link')).toBe(false);
      expect(isValidShortCode('my@link')).toBe(false);
      expect(isValidShortCode('my/link')).toBe(false);
    });
  });
});
