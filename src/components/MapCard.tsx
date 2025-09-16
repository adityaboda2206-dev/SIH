import React, { useEffect, useRef } from 'react';
import { Report } from '../types';

declare global {
  interface Window {
    L: any;
  }
}

interface MapCardProps {
  reports: Report[];
  showNotification: (title: string, message: string, type: string) => void;
}

const MapCard: React.FC<MapCardProps> = ({ reports, showNotification }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (mapRef.current && window.L && !mapInstance.current) {
      // Initialize map
      mapInstance.current = window.L.map(mapRef.current, {
        center: [13.0827, 80.2707],
        zoom: 8,
        zoomControl: false,
        scrollWheelZoom: true,
        doubleClickZoom: true
      });

      // Add tile layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapInstance.current);

      // Add zoom control
      window.L.control.zoom({
        position: 'bottomright'
      }).addTo(mapInstance.current);

      // Add scale control
      window.L.control.scale({
        position: 'bottomleft'
      }).addTo(mapInstance.current);
    }
  }, []);

  useEffect(() => {
    if (mapInstance.current && reports.length > 0) {
      // Clear existing markers
      markersRef.current.forEach(marker => mapInstance.current.removeLayer(marker));
      markersRef.current = [];

      // Add markers for reports
      reports.forEach(report => {
        const color = getSeverityColor(report.severity);
        const radius = getSeverityRadius(report.severity);

        const marker = window.L.circleMarker([report.coordinates[0], report.coordinates[1]], {
          color: color,
          fillColor: color,
          fillOpacity: 0.7,
          radius: radius,
          weight: 3
        }).addTo(mapInstance.current);

        const popupContent = `
          <div class="popup-content">
            <div class="popup-header">
              <h4>${formatHazardType(report.type)}</h4>
              <span class="severity-badge severity-${report.severity}">${report.severity.toUpperCase()}</span>
            </div>
            <div class="popup-body">
              <div class="popup-info">
                <i class="fas fa-clock"></i>
                <span>${formatTimeAgo(report.timestamp)}</span>
              </div>
              <div class="popup-info">
                <i class="fas fa-user"></i>
                <span>${report.reporter}</span>
              </div>
              <div class="popup-info">
                <i class="fas ${report.verified ? 'fa-check-circle' : 'fa-clock'}" style="color: ${report.verified ? '#10b981' : '#f59e0b'};"></i>
                <span>${report.verified ? 'Verified' : 'Pending'}</span>
              </div>
              <p class="popup-description">${report.description}</p>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 300,
          className: 'custom-popup'
        });

        markersRef.current.push(marker);
      });
    }
  }, [reports]);

  const getSeverityColor = (severity: string) => {
    const colors: { [key: string]: string } = {
      low: '#059669',
      medium: '#d97706',
      high: '#ea580c',
      critical: '#dc2626'
    };
    return colors[severity] || colors.medium;
  };

  const getSeverityRadius = (severity: string) => {
    const radii: { [key: string]: number } = {
      low: 8,
      medium: 12,
      high: 16,
      critical: 20
    };
    return radii[severity] || radii.medium;
  };

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

  const handleCenterMap = () => {
    if (mapInstance.current) {
      mapInstance.current.setView([13.0827, 80.2707], 8);
    }
  };

  const handleToggleHeatmap = () => {
    showNotification('Heatmap', 'Heatmap visualization feature coming soon!', 'info');
  };

  const handleToggleSatellite = () => {
    showNotification('Satellite View', 'Satellite view feature coming soon!', 'info');
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapRef.current?.requestFullscreen().catch(() => {
        showNotification('Fullscreen Error', 'Could not enter fullscreen mode.', 'error');
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="card map-card">
      <div className="card-header">
        <h2>
          <i className="fas fa-map-marked-alt"></i>
          Live Hazard Map
        </h2>
        <div className="map-controls">
          <button className="map-btn" onClick={handleToggleHeatmap} title="Toggle Heatmap">
            <i className="fas fa-thermometer-half"></i>
          </button>
          <button className="map-btn" onClick={handleToggleSatellite} title="Satellite View">
            <i className="fas fa-satellite"></i>
          </button>
          <button className="map-btn" onClick={handleCenterMap} title="Center Map">
            <i className="fas fa-crosshairs"></i>
          </button>
          <button className="map-btn" onClick={handleToggleFullscreen} title="Fullscreen">
            <i className="fas fa-expand"></i>
          </button>
        </div>
      </div>
      <div className="map-container">
        <div ref={mapRef} id="map"></div>
        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-color critical"></div>
            <span>Critical</span>
          </div>
          <div className="legend-item">
            <div className="legend-color high"></div>
            <span>High</span>
          </div>
          <div className="legend-item">
            <div className="legend-color medium"></div>
            <span>Medium</span>
          </div>
          <div className="legend-item">
            <div className="legend-color low"></div>
            <span>Low</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapCard;