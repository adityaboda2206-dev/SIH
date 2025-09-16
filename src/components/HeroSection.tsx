import React from 'react';

interface HeroSectionProps {
  onShowReportModal: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onShowReportModal }) => {
  const handleViewAnalytics = () => {
    document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Protecting Our Oceans Together</h1>
        <p className="hero-subtitle">
          Real-time marine hazard reporting and social media analytics for ocean conservation
        </p>
        <div className="hero-actions">
          <button className="btn btn-hero-primary" onClick={onShowReportModal}>
            <i className="fas fa-shield-alt"></i> Report Hazard
          </button>
          <button className="btn btn-hero-secondary" onClick={handleViewAnalytics}>
            <i className="fas fa-chart-line"></i> View Analytics
          </button>
        </div>
      </div>
      <div className="hero-visual">
        <div className="floating-cards">
          <div className="floating-card card-1">
            <i className="fas fa-oil-can"></i>
            <span>Oil Spill Detection</span>
          </div>
          <div className="floating-card card-2">
            <i className="fas fa-recycle"></i>
            <span>Plastic Monitoring</span>
          </div>
          <div className="floating-card card-3">
            <i className="fas fa-fish"></i>
            <span>Marine Life Protection</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;