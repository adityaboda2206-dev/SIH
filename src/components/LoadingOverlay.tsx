import React from 'react';

const LoadingOverlay: React.FC = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading Ocean Data...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;