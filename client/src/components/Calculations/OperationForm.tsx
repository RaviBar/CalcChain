import React, { useState } from 'react';
import { calculationsAPI } from '../../services/api';

interface OperationFormProps {
  parentId: number;
  parentResult: number;
  onCalculationCreated: () => void;
}

const OperationForm: React.FC<OperationFormProps> = ({ 
  parentId, 
  parentResult, 
  onCalculationCreated 
}) => {
  const [operation, setOperation] = useState<'+' | '-' | '*' | '/'>('+');
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numValue = parseFloat(number);
    if (isNaN(numValue)) {
      setError('Please enter a valid number');
      return;
    }

    setLoading(true);

    try {
      await calculationsAPI.create({
        parentId,
        operation,
        number: numValue
      });
      setNumber('');
      onCalculationCreated();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create operation');
    } finally {
      setLoading(false);
    }
  };

  const calculatePreview = () => {
    const numValue = parseFloat(number);
    if (isNaN(numValue)) return '';

    let result: number;
    switch (operation) {
      case '+':
        result = parentResult + numValue;
        break;
      case '-':
        result = parentResult - numValue;
        break;
      case '*':
        result = parentResult * numValue;
        break;
      case '/':
        result = numValue === 0 ? NaN : parentResult / numValue;
        break;
      default:
        return '';
    }

    if (isNaN(result)) {
      return 'Invalid operation';
    }

    return `= ${result}`;
  };

  return (
    <div className="operation-form">
      {error && (
        <div className="error" style={{ width: '100%', marginBottom: '0.5rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', width: '100%' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
          {parentResult}
        </span>
        
        <select
          className="operation-select"
          value={operation}
          onChange={(e) => setOperation(e.target.value as '+' | '-' | '*' | '/')}
          disabled={loading}
        >
          <option value="+">+</option>
          <option value="-">-</option>
          <option value="*">×</option>
          <option value="/">÷</option>
        </select>

        <input
          type="number"
          className="operation-input"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="0"
          step="any"
          required
          disabled={loading}
        />

        <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#6b7280' }}>
          {calculatePreview()}
        </span>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
        >
          {loading ? '...' : 'Add'}
        </button>
      </form>
    </div>
  );
};

export default OperationForm;
