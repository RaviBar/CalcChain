import React, { useState } from 'react';
import { calculationsAPI } from '../../services/api';

interface StartingNumberFormProps {
  onCalculationCreated: () => void;
}

const StartingNumberForm: React.FC<StartingNumberFormProps> = ({ onCalculationCreated }) => {
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const numValue = parseFloat(number);
    if (isNaN(numValue)) {
      setError('Please enter a valid number');
      return;
    }

    setLoading(true);

    try {
      await calculationsAPI.create({ number: numValue });
      setSuccess('Starting number created successfully!');
      setNumber('');
      onCalculationCreated();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create starting number');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {success && (
        <div className="success">
          {success}
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="startingNumber">
          Starting Number
        </label>
        <input
          type="number"
          id="startingNumber"
          className="form-input"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Enter a number to start a calculation tree"
          step="any"
          required
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Start Calculation'}
      </button>
    </form>
  );
};

export default StartingNumberForm;
