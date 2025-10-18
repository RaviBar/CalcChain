export type Operation = '+' | '-' | '*' | '/';

export interface OperationResult {
  result: number;
  isValid: boolean;
  error?: string;
}

export const performOperation = (
  leftOperand: number,
  operation: Operation,
  rightOperand: number
): OperationResult => {
  try {
    let result: number;

    switch (operation) {
      case '+':
        result = leftOperand + rightOperand;
        break;
      case '-':
        result = leftOperand - rightOperand;
        break;
      case '*':
        result = leftOperand * rightOperand;
        break;
      case '/':
        if (rightOperand === 0) {
          return {
            result: 0,
            isValid: false,
            error: 'Division by zero is not allowed'
          };
        }
        result = leftOperand / rightOperand;
        break;
      default:
        return {
          result: 0,
          isValid: false,
          error: 'Invalid operation'
        };
    }

    // Check for NaN or Infinity
    if (!isFinite(result)) {
      return {
        result: 0,
        isValid: false,
        error: 'Result is not a finite number'
      };
    }

    return {
      result,
      isValid: true
    };
  } catch (error) {
    return {
      result: 0,
      isValid: false,
      error: 'Operation failed'
    };
  }
};

export const isValidOperation = (operation: string): operation is Operation => {
  return ['+', '-', '*', '/'].includes(operation);
};
