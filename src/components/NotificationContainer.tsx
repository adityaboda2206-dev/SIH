import React, { useEffect } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
}

interface NotificationContainerProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({ notifications, onRemove }) => {
  useEffect(() => {
    notifications.forEach(notification => {
      const timer = setTimeout(() => {
        onRemove(notification.id);
      }, 5000);

      return () => clearTimeout(timer);
    });
  }, [notifications, onRemove]);

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div key={notification.id} className={`notification ${notification.type}`}>
          <div className="notification-content">
            <div className="notification-header">
              <strong>{notification.title}</strong>
              <button className="notification-close" onClick={() => onRemove(notification.id)}>
                ×
              </button>
            </div>
            <div className="notification-message">{notification.message}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;