import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import DashboardGrid from './components/DashboardGrid';
import ReportModal from './components/ReportModal';
import AuthModal from './components/AuthModal';
import ProfileMenu from './components/ProfileMenu';
import NotificationContainer from './components/NotificationContainer';
import LoadingOverlay from './components/LoadingOverlay';
import AnimatedBackground from './components/AnimatedBackground';
import { useTheme } from './hooks/useTheme';
import { useNotifications } from './hooks/useNotifications';
import { useAppData } from './hooks/useAppData';
import { useAuth } from './hooks/useAuth';
import { Report } from './types';
import './styles/main.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [newReport, setNewReport] = useState<Report | null>(null);

  const { isDarkMode, toggleDarkMode } = useTheme();
  const { notifications, showNotification, removeNotification } = useNotifications();
  const { reports, socialPosts, stats, updateStats, addReport } = useAppData(showNotification);
  const { user, isAuthenticated, isLoading: authLoading, login, signup, logout } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      const initTimer = setTimeout(() => {
        setIsLoading(false);
        if (isAuthenticated && user) {
          showNotification(
            `Welcome back, ${user.name}!`,
            'Ready to protect our oceans together.',
            'success'
          );
        } else {
          showNotification(
            'Welcome to Ocean Guardian!',
            'Sign in to report hazards and track ocean health.',
            'info'
          );
        }
      }, 2000);

      return () => clearTimeout(initTimer);
    }
  }, [authLoading, isAuthenticated, user, showNotification]);

  useEffect(() => {
    const refreshTimer = setInterval(() => {
      updateStats();
    }, 30000);
    return () => clearInterval(refreshTimer);
  }, [updateStats]);

  const handleShowDashboard = () => {
    document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShowReportModal = () => {
    if (!isAuthenticated) {
      showNotification('Authentication Required', 'Please sign in to report hazards.', 'warning');
      setShowAuthModal(true);
      return;
    }
    setShowReportModal(true);
  };

  const handleReportSubmit = (reportData: Omit<Report, 'id' | 'timestamp'>) => {
    const report = addReport(reportData);
    setNewReport(report);

    setTimeout(() => {
      setNewReport(null);
    }, 10000);
  };

  const handleCloseProfileMenu = () => {
    setShowProfileMenu(false);
  };

  const handleLogout = () => {
    logout();
    showNotification('Signed Out', 'You have been successfully signed out.', 'info');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showProfileMenu && !(event.target as Element)?.closest('.nav-profile, .profile-menu')) {
        setShowProfileMenu(false);
      }
      if (showReportModal && (event.target as Element)?.classList.contains('modal')) {
        setShowReportModal(false);
      }
      if (showAuthModal && (event.target as Element)?.classList.contains('modal')) {
        setShowAuthModal(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showProfileMenu, showReportModal, showAuthModal]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowReportModal(false);
        setShowAuthModal(false);
        setShowProfileMenu(false);
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault();
        handleShowReportModal();
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
        onShowReportModal={handleShowReportModal}
        onShowDashboard={handleShowDashboard}
        onToggleDarkMode={toggleDarkMode}
        onToggleProfileMenu={() => setShowProfileMenu(!showProfileMenu)}
        onShowAuthModal={() => setShowAuthModal(true)}
        isDarkMode={isDarkMode}
        user={user}
        isAuthenticated={isAuthenticated}
      />

      <HeroSection onShowReportModal={handleShowReportModal} />

      <main className="main-container" id="dashboard">
        <StatsSection stats={stats} />
        <DashboardGrid
          reports={reports}
          socialPosts={socialPosts}
          onShowReportModal={handleShowReportModal}
          showNotification={showNotification}
          newReport={newReport}
        />
      </main>

      {showReportModal && (
        <ReportModal
          onClose={() => setShowReportModal(false)}
          showNotification={showNotification}
          onReportSubmit={handleReportSubmit}
          user={user}
        />
      )}

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={login}
          onSignup={signup}
          showNotification={showNotification}
        />
      )}

      {showProfileMenu && isAuthenticated && (
        <ProfileMenu
          onClose={handleCloseProfileMenu}
          user={user}
          onLogout={handleLogout}
        />
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
