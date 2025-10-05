import { Loader2 } from 'lucide-react';

// Loading Spinner Component
const LoadingSpinner = () => {
  const spinnerStyles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 0',
    },
    spinner: {
      width: '32px',
      height: '32px',
      color: '#7c3aed',
      animation: 'spin 1s linear infinite',
    }
  };

  return (
    <div style={spinnerStyles.container}>
      <Loader2 style={spinnerStyles.spinner} />
    </div>
  );
};

export default LoadingSpinner;