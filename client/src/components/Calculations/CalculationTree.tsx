import React from 'react';
import { Calculation } from '../../types';
import CalculationNode from './CalculationNode';

interface CalculationTreeProps {
  calculations: Calculation[];
  onCalculationCreated: () => void;
}

const CalculationTree: React.FC<CalculationTreeProps> = ({ 
  calculations, 
  onCalculationCreated 
}) => {
  if (calculations.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
        <p>No calculations yet. Be the first to start a calculation tree!</p>
      </div>
    );
  }

  return (
    <div>
      {calculations.map((calculation) => (
        <CalculationNode
          key={calculation.id}
          calculation={calculation}
          onCalculationCreated={onCalculationCreated}
        />
      ))}
    </div>
  );
};

export default CalculationTree;
