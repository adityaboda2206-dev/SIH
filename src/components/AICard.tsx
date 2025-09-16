import React from 'react';

const AICard: React.FC = () => {
  return (
    <div className="card ai-card">
      <div className="card-header">
        <h2>
          <i className="fas fa-robot"></i>
          AI-Powered Insights
        </h2>
        <div className="ai-status">
          <div className="status-indicator active"></div>
          <span>AI Engine Active</span>
        </div>
      </div>
      <div className="ai-content">
        <div className="ai-alert high-priority">
          <div className="alert-icon">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <div className="alert-content">
            <h4>High Risk Zone Detected</h4>
            <p>Unusual cluster of reports near Chennai Port. Recommend immediate investigation.</p>
            <span className="alert-confidence">Confidence: 94%</span>
          </div>
        </div>
        <div className="ai-prediction">
          <h4>24-Hour Forecast</h4>
          <div className="prediction-item">
            <span className="prediction-type">Oil Spill Risk</span>
            <div className="risk-meter">
              <div className="risk-fill" style={{width: '65%'}}></div>
            </div>
            <span className="risk-value">65%</span>
          </div>
          <div className="prediction-item">
            <span className="prediction-type">Plastic Debris</span>
            <div className="risk-meter">
              <div className="risk-fill" style={{width: '40%'}}></div>
            </div>
            <span className="risk-value">40%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICard;