import React from 'react';
import { User } from '../types';

interface ProfileMenuProps {
  onClose: () => void;
  user: User | null;
  onLogout: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ onClose, user, onLogout }) => {
  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <div className="profile-menu" style={{ display: 'block' }}>
      <div className="profile-info">
        <img
          src={
            user?.avatar ||
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face'
          }
          alt="Profile"
        />
        <div>
          <div className="profile-name">{user?.name || 'Ocean Guardian'}</div>
          <div className="profile-role">{user?.role || 'Marine Conservationist'}</div>
        </div>
      </div>
      <div className="menu-divider"></div>
      <a href="#" className="menu-item">
        <i className="fas fa-user"></i> Profile Settings
      </a>
      <a href="#" className="menu-item">
        <i className="fas fa-bell"></i> Notifications
      </a>
      <a href="#" className="menu-item">
        <i className="fas fa-chart-bar"></i> My Reports
      </a>
      <div className="menu-divider"></div>
      <a href="#" className="menu-item" onClick={handleLogout}>
        <i className="fas fa-sign-out-alt"></i> Logout
      </a>
    </div>
  );
};

export default ProfileMenu;
