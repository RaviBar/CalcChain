import React, { useState } from 'react';
import { Calculation } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import OperationForm from './OperationForm';

interface CalculationNodeProps {
  calculation: Calculation;
  onCalculationCreated: () => void;
}

// A simple avatar component
const Avatar: React.FC<{ username: string }> = ({ username }) => {
  const initial = username ? username.charAt(0).toUpperCase() : '?';
  // Simple hashing function to get a consistent color for each user
  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };

  const colorFromHash = (hash: number) => {
    const colors = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#4ade80', '#34d399', '#2dd4bf', '#22d3ee', '#38bdf8', '#60a5fa', '#818cf8', '#a78bfa', '#c084fc', '#e879f9', '#f472b6', '#fb7185'];
    const index = Math.abs(hash % colors.length);
    return colors[index];
  };

  const bgColor = colorFromHash(hashCode(username || ''));

  return (
    <div className="avatar" style={{ backgroundColor: bgColor }}>
      <span>{initial}</span>
    </div>
  );
};


const CalculationNode: React.FC<CalculationNodeProps> = ({ 
  calculation, 
  onCalculationCreated 
}) => {
  const { isAuthenticated } = useAuth();
  const [isReplying, setIsReplying] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getOperationSymbol = (operation: string | null) => {
    switch (operation) {
      case '+': return 'added';
      case '-': return 'subtracted';
      case '*': return 'multiplied by';
      case '/': return 'divided by';
      default: return '';
    }
  };

  const isStartingNumber = calculation.parent_id === null;

  const handleReplySuccess = () => {
    setIsReplying(false);
    onCalculationCreated();
  };

  return (
    <div className={`calculation-node-wrapper ${isStartingNumber ? 'root' : ''}`}>
      <div className="calculation-node-line"></div>
      <div className={`calculation-node ${isStartingNumber ? 'starting' : ''}`}>
        <div className="calculation-avatar-column">
           <Avatar username={calculation.username || 'User'} />
        </div>
        <div className="calculation-main-column">
          <div className="calculation-header">
            <strong>{calculation.username}</strong>
            <span className="calculation-meta">{formatDate(calculation.created_at)}</span>
          </div>

          <div className="calculation-body">
            <p className="calculation-result-text">{calculation.result}</p>
            {!isStartingNumber && (
              <p className="calculation-operation-meta">
                (by {getOperationSymbol(calculation.operation)} {calculation.number})
              </p>
            )}
          </div>

          {isAuthenticated && (
            <div className="calculation-actions">
              <button className="btn-reply" onClick={() => setIsReplying(!isReplying)}>
                {isReplying ? 'Cancel' : 'Reply'}
              </button>
            </div>
          )}
          
          {isReplying && (
            <div className="reply-form-container">
              <OperationForm
                parentId={calculation.id}
                parentResult={calculation.result}
                onCalculationCreated={handleReplySuccess}
              />
            </div>
          )}
        </div>
      </div>
       {calculation.children && calculation.children.length > 0 && (
        <div className="children">
          {calculation.children.map((child) => (
            <CalculationNode
              key={child.id}
              calculation={child}
              onCalculationCreated={onCalculationCreated}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CalculationNode;