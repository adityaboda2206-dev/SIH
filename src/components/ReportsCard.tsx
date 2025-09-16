import React, { useState } from 'react';
import { Report } from '../types';

interface ReportsCardProps {
  reports: Report[];
  showNotification: (title: string, message: string, type: string) => void;
}

const ReportsCard: React.FC<ReportsCardProps> = ({ reports, showNotification }) => {
  const [filter, setFilter] = useState('all');

  const formatHazardType = (type: string) => {
    const types: { [key: string]: string } = {
      'oil-spill': 'Oil Spill',
      'plastic-waste': 'Plastic Waste',
      'chemical-pollution': 'Chemical Pollution',
      'marine-life': 'Marine Life Issue',
      'algae-bloom': 'Algae Bloom',
      'debris': 'Marine Debris'
    };
    return types[type] || type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const filterReports = () => {
    let filtered = [...reports];
    
    switch (filter) {
      case 'verified':
        filtered = filtered.filter(report => report.verified);
        break;
      case 'pending':
        filtered = filtered.filter(report => !report.verified);
        break;
      case 'high':
        filtered = filtered.filter(report => report.severity === 'high' || report.severity === 'critical');
        break;
      case 'all':
      default:
        break;
    }
    
    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const handleRefresh = () => {
    showNotification('Data Refreshed', 'Reports have been updated with latest data.', 'success');
  };

  const handleViewReport = (reportId: number) => {
    showNotification('Report Details', `Viewing detailed information for report #${reportId}.`, 'info');
  };

  const handleViewOnMap = (coords: [number, number]) => {
    showNotification('Location Found', 'Map centered on report location.', 'success');
  };

  const handleShareReport = (reportId: number) => {
    showNotification('Shared', 'Report details copied to clipboard.', 'success');
  };

  const handleBookmarkReport = (reportId: number) => {
    showNotification('Bookmarked', 'Report has been added to your bookmarks.', 'success');
  };

  const filteredReports = filterReports();

  return (
    <div className="card reports-card">
      <div className="card-header">
        <h2>
          <i className="fas fa-exclamation-triangle"></i>
          Recent Reports
        </h2>
        <div className="card-actions">
          <select 
            className="filter-select" 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Reports</option>
            <option value="verified">Verified Only</option>
            <option value="pending">Pending</option>
            <option value="high">High Priority</option>
          </select>
          <button className="card-btn" onClick={handleRefresh}>
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>
      <div className="reports-list">
        {filteredReports.map(report => (
          <div 
            key={report.id}
            className={`report-item severity-${report.severity} fade-in`}
            onClick={() => handleViewReport(report.id)}
          >
            <div className="report-header">
              <span className="report-type">{formatHazardType(report.type)}</span>
              <span className="report-time">{formatTimeAgo(report.timestamp)}</span>
            </div>
            <div className="report-meta">
              <div><i className="fas fa-map-marker-alt"></i> <strong>Location:</strong> {report.location}</div>
              <div><i className="fas fa-user"></i> <strong>Reporter:</strong> {report.reporter}</div>
              {report.images && <div><i className="fas fa-camera"></i> <strong>Images:</strong> {report.images}</div>}
            </div>
            <p className="report-description">{report.description}</p>
            <div className="report-footer">
              <div className={`verification-status ${report.verified ? 'verified' : 'pending'}`}>
                <i className={`fas ${report.verified ? 'fa-check-circle' : 'fa-clock'}`}></i>
                {report.verified ? 'Verified' : 'Pending Verification'}
              </div>
              <div className="report-actions">
                <button 
                  className="action-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewOnMap(report.coordinates);
                  }}
                  title="View on Map"
                >
                  <i className="fas fa-map"></i>
                </button>
                <button 
                  className="action-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShareReport(report.id);
                  }}
                  title="Share Report"
                >
                  <i className="fas fa-share"></i>
                </button>
                <button 
                  className="action-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmarkReport(report.id);
                  }}
                  title="Bookmark"
                >
                  <i className="fas fa-bookmark"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsCard;