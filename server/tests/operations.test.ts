import { performOperation, isValidOperation } from '../src/utils/operations';

describe('Operations Utils', () => {
  describe('performOperation', () => {
    it('should perform addition correctly', () => {
      const result = performOperation(10, '+', 5);
      expect(result.result).toBe(15);
      expect(result.isValid).toBe(true);
    });

    it('should perform subtraction correctly', () => {
      const result = performOperation(10, '-', 5);
      expect(result.result).toBe(5);
      expect(result.isValid).toBe(true);
    });

    it('should perform multiplication correctly', () => {
      const result = performOperation(10, '*', 5);
      expect(result.result).toBe(50);
      expect(result.isValid).toBe(true);
    });

    it('should perform division correctly', () => {
      const result = performOperation(10, '/', 5);
      expect(result.result).toBe(2);
      expect(result.isValid).toBe(true);
    });

    it('should handle division by zero', () => {
      const result = performOperation(10, '/', 0);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Division by zero is not allowed');
    });

    it('should handle invalid operation', () => {
      const result = performOperation(10, 'invalid' as any, 5);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid operation');
    });

    it('should handle decimal numbers', () => {
      const result = performOperation(10.5, '+', 2.3);
      expect(result.result).toBeCloseTo(12.8);
      expect(result.isValid).toBe(true);
    });
  });

  describe('isValidOperation', () => {
    it('should return true for valid operations', () => {
      expect(isValidOperation('+')).toBe(true);
      expect(isValidOperation('-')).toBe(true);
      expect(isValidOperation('*')).toBe(true);
      expect(isValidOperation('/')).toBe(true);
    });

    it('should return false for invalid operations', () => {
      expect(isValidOperation('invalid')).toBe(false);
      expect(isValidOperation('')).toBe(false);
      expect(isValidOperation('++')).toBe(false);
    });
  });
});
