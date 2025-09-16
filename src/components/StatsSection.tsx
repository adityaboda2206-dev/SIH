import React, { useEffect, useRef } from 'react';

interface Stats {
  totalReports: number;
  activeHazards: number;
  verifiedReports: number;
  socialMentions: number;
  activeUsers: number;
  coverage: number;
}

interface StatsSectionProps {
  stats: Stats;
}

const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  const animatedRefs = useRef<{ [key: string]: HTMLSpanElement | null }>({});

  useEffect(() => {
    // Animate counters when stats change
    Object.entries(stats).forEach(([key, value]) => {
      const element = animatedRefs.current[key];
      if (element) {
        animateCounter(element, value, key === 'coverage' ? '%' : '');
      }
    });
  }, [stats]);

  const animateCounter = (element: HTMLSpanElement, targetValue: number, suffix: string = '') => {
    const startValue = parseInt(element.textContent || '0');
    const duration = 1000;
    const steps = 60;
    const increment = (targetValue - startValue) / steps;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      const currentValue = Math.floor(startValue + (increment * currentStep));
      element.textContent = currentValue + suffix;
      
      if (currentStep >= steps) {
        clearInterval(timer);
        element.textContent = targetValue + suffix;
      }
    }, duration / steps);
  };

  return (
    <div className="stats-section">
      <h2 className="section-title">
        <i className="fas fa-analytics"></i>
        Real-time Ocean Health Metrics
      </h2>
      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">
              <span ref={el => animatedRefs.current.totalReports = el}>
                {stats.totalReports}
              </span>
            </div>
            <div className="stat-label">Total Reports</div>
            <div className="stat-trend">
              <i className="fas fa-arrow-up"></i> +12% this week
            </div>
          </div>
        </div>
        
        <div className="stat-card stat-danger">
          <div className="stat-icon">
            <i className="fas fa-fire"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">
              <span ref={el => animatedRefs.current.activeHazards = el}>
                {stats.activeHazards}
              </span>
            </div>
            <div className="stat-label">Active Hazards</div>
            <div className="stat-trend">
              <i className="fas fa-arrow-down"></i> -5% from yesterday
            </div>
          </div>
        </div>
        
        <div className="stat-card stat-success">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">
              <span ref={el => animatedRefs.current.verifiedReports = el}>
                {stats.verifiedReports}
              </span>
            </div>
            <div className="stat-label">Verified Reports</div>
            <div className="stat-trend">
              <i className="fas fa-arrow-up"></i> +8% accuracy
            </div>
          </div>
        </div>
        
        <div className="stat-card stat-info">
          <div className="stat-icon">
            <i className="fas fa-hashtag"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">
              <span ref={el => animatedRefs.current.socialMentions = el}>
                {stats.socialMentions}
              </span>
            </div>
            <div className="stat-label">Social Mentions</div>
            <div className="stat-trend">
              <i className="fas fa-arrow-up"></i> +25% engagement
            </div>
          </div>
        </div>
        
        <div className="stat-card stat-warning">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">
              <span ref={el => animatedRefs.current.activeUsers = el}>
                {stats.activeUsers}
              </span>
            </div>
            <div className="stat-label">Active Contributors</div>
            <div className="stat-trend">
              <i className="fas fa-arrow-up"></i> +18% new users
            </div>
          </div>
        </div>
        
        <div className="stat-card stat-purple">
          <div className="stat-icon">
            <i className="fas fa-globe"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">
              <span ref={el => animatedRefs.current.coverage = el}>
                {stats.coverage}
              </span>%
            </div>
            <div className="stat-label">Coastal Coverage</div>
            <div className="stat-trend">
              <i className="fas fa-arrow-up"></i> Expanding reach
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;