import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import DashboardGrid from './components/DashboardGrid';
import ReportModal from './components/ReportModal';
import ProfileMenu from './components/ProfileMenu';
import NotificationContainer from './components/NotificationContainer';
import LoadingOverlay from './components/LoadingOverlay';
import AnimatedBackground from './components/AnimatedBackground';
import { useTheme } from './hooks/useTheme';
import { useNotifications } from './hooks/useNotifications';
import { useAppData } from './hooks/useAppData';
import './styles/main.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { notifications, showNotification, removeNotification } = useNotifications();
  const { reports, socialPosts, stats, updateStats } = useAppData();

  useEffect(() => {
    // Initialize the app with loading sequence
    const initTimer = setTimeout(() => {
      setIsLoading(false);
      showNotification('Welcome to Ocean Guardian!', 'Ready to protect our oceans together.', 'success');
    }, 2000);

    // Auto-refresh data every 30 seconds
    const refreshTimer = setInterval(() => {
      updateStats();
    }, 30000);

    return () => {
      clearTimeout(initTimer);
      clearInterval(refreshTimer);
    };
  }, [showNotification, updateStats]);

  const handleShowDashboard = () => {
    document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCloseProfileMenu = () => {
    setShowProfileMenu(false);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showProfileMenu && !(event.target as Element)?.closest('.nav-profile, .profile-menu')) {
        setShowProfileMenu(false);
      }
      if (showReportModal && (event.target as Element)?.classList.contains('modal')) {
        setShowReportModal(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showProfileMenu, showReportModal]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowReportModal(false);
        setShowProfileMenu(false);
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault();
        setShowReportModal(true);
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
        event.preventDefault();
        toggleDarkMode();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleDarkMode]);

  return (
    <div className={`app ${isDarkMode ? 'dark-theme' : ''}`}>
      <AnimatedBackground />
      
      <Navigation 
        onShowReportModal={() => setShowReportModal(true)}
        onShowDashboard={handleShowDashboard}
        onToggleDarkMode={toggleDarkMode}
        onToggleProfileMenu={() => setShowProfileMenu(!showProfileMenu)}
        isDarkMode={isDarkMode}
      />

      <HeroSection onShowReportModal={() => setShowReportModal(true)} />

      <main className="main-container" id="dashboard">
        <StatsSection stats={stats} />
        <DashboardGrid 
          reports={reports} 
          socialPosts={socialPosts}
          onShowReportModal={() => setShowReportModal(true)}
          showNotification={showNotification}
        />
      </main>

      {showReportModal && (
        <ReportModal 
          onClose={() => setShowReportModal(false)}
          showNotification={showNotification}
        />
      )}

      {showProfileMenu && (
        <ProfileMenu onClose={handleCloseProfileMenu} />
      )}

      <NotificationContainer 
        notifications={notifications}
        onRemove={removeNotification}
      />

      {isLoading && <LoadingOverlay />}
    </div>
  );
}

export default App;