import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import StartingNumberForm from '../Calculations/StartingNumberForm';
import { calculationsAPI } from '../../services/api';

// Mock the API
vi.mock('../../services/api', () => ({
  calculationsAPI: {
    create: vi.fn()
  }
}));

const mockOnCalculationCreated = vi.fn();

describe('StartingNumberForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form elements correctly', () => {
    render(<StartingNumberForm onCalculationCreated={mockOnCalculationCreated} />);
    
    expect(screen.getByLabelText(/starting number/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start calculation/i })).toBeInTheDocument();
  });

  it('submits form with valid number', async () => {
    const mockCreate = vi.mocked(calculationsAPI.create);
    mockCreate.mockResolvedValueOnce({ calculation: {} as any });

    render(<StartingNumberForm onCalculationCreated={mockOnCalculationCreated} />);
    
    const input = screen.getByLabelText(/starting number/i);
    const submitButton = screen.getByRole('button', { name: /start calculation/i });

    fireEvent.change(input, { target: { value: '42' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({ number: 42 });
      expect(mockOnCalculationCreated).toHaveBeenCalled();
    });
  });

  it('shows error for invalid number', async () => {
    render(<StartingNumberForm onCalculationCreated={mockOnCalculationCreated} />);
    
    const input = screen.getByLabelText(/starting number/i);
    const submitButton = screen.getByRole('button', { name: /start calculation/i });

    fireEvent.change(input, { target: { value: 'not a number' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid number/i)).toBeInTheDocument();
    });
  });

  it('shows error when API call fails', async () => {
    const mockCreate = vi.mocked(calculationsAPI.create);
    mockCreate.mockRejectedValueOnce(new Error('API Error'));

    render(<StartingNumberForm onCalculationCreated={mockOnCalculationCreated} />);
    
    const input = screen.getByLabelText(/starting number/i);
    const submitButton = screen.getByRole('button', { name: /start calculation/i });

    fireEvent.change(input, { target: { value: '42' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to create starting number/i)).toBeInTheDocument();
    });
  });
});
