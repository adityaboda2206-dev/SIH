import React from 'react';

interface NavigationProps {
  onShowReportModal: () => void;
  onShowDashboard: () => void;
  onToggleDarkMode: () => void;
  onToggleProfileMenu: () => void;
  isDarkMode: boolean;
}

const Navigation: React.FC<NavigationProps> = ({
  onShowReportModal,
  onShowDashboard,
  onToggleDarkMode,
  onToggleProfileMenu,
  isDarkMode
}) => {
  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="logo">
          <div className="logo-icon">
            <i className="fas fa-water"></i>
          </div>
          <div className="logo-text">
            <span className="logo-main">Ocean Guardian</span>
            <span className="logo-sub">Marine Protection System</span>
          </div>
        </div>
        <div className="nav-buttons">
          <button className="nav-btn secondary" onClick={onShowReportModal}>
            <i className="fas fa-plus"></i> 
            <span>Report Hazard</span>
          </button>
          <button className="nav-btn primary" onClick={onShowDashboard}>
            <i className="fas fa-chart-bar"></i> 
            <span>Dashboard</span>
          </button>
          <button className="nav-btn tertiary" onClick={onToggleDarkMode}>
            <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
          <div className="nav-profile" onClick={onToggleProfileMenu}>
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" 
              alt="Profile" 
              className="profile-img"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;