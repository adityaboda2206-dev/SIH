import React from 'react';
import MapCard from './MapCard';
import ReportsCard from './ReportsCard';
import SocialCard from './SocialCard';
import AnalyticsCard from './AnalyticsCard';
import AICard from './AICard';
import WeatherCard from './WeatherCard';
import { Report, SocialPost } from '../types';

interface DashboardGridProps {
  reports: Report[];
  socialPosts: SocialPost[];
  onShowReportModal: () => void;
  showNotification: (title: string, message: string, type: string) => void;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({ 
  reports, 
  socialPosts, 
  onShowReportModal,
  showNotification 
}) => {
  return (
    <div className="dashboard-grid">
      <MapCard reports={reports} showNotification={showNotification} />
      <ReportsCard reports={reports} showNotification={showNotification} />
      <SocialCard socialPosts={socialPosts} showNotification={showNotification} />
      <AnalyticsCard />
      <AICard />
      <WeatherCard />
    </div>
  );
};

export default DashboardGrid;