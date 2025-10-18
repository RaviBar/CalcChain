import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { calculationsAPI } from './services/api';
import { Calculation } from './types';
import Header from './components/Layout/Header';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import CalculationTree from './components/Calculations/CalculationTree';
import StartingNumberForm from './components/Calculations/StartingNumberForm';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [loadingCalculations, setLoadingCalculations] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const fetchCalculations = async () => {
    try {
      setLoadingCalculations(true);
      setError(null);
      const response = await calculationsAPI.getAll();
      setCalculations(response?.calculations ?? []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch calculations');
    } finally {
      setLoadingCalculations(false);
    }
  };

  useEffect(() => {
    fetchCalculations();
  }, []);

  const handleCalculationCreated = () => {
    fetchCalculations();
  };

  if (loading) {
    return (
      <div className="loading">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <Header 
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
      />
      
      <div className="container">
        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {isAuthenticated && (
          <div className="card">
            <h2>Start a New Calculation</h2>
            <StartingNumberForm onCalculationCreated={handleCalculationCreated} />
          </div>
        )}

        <div className="calculation-tree">
          <h2>Calculation Trees</h2>
          {loadingCalculations ? (
            <div className="loading">
              <p>Loading calculations...</p>
            </div>
          ) : (calculations?.length ?? 0) === 0 ? (
            <p>No calculations yet. {!isAuthenticated && 'Register to start the first calculation!'}</p>
          ) : (
            <CalculationTree 
              calculations={calculations} 
              onCalculationCreated={handleCalculationCreated}
            />
          )}
        </div>
      </div>

      {showLogin && (
        <LoginForm 
          onClose={() => setShowLogin(false)}
          onSuccess={() => {
            setShowLogin(false);
            fetchCalculations();
          }}
        />
      )}

      {showRegister && (
        <RegisterForm 
          onClose={() => setShowRegister(false)}
          onSuccess={() => {
            setShowRegister(false);
            fetchCalculations();
          }}
        />
      )}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
