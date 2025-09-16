import React from 'react';

const WeatherCard: React.FC = () => {
  return (
    <div className="card weather-card">
      <div className="card-header">
        <h2>
          <i className="fas fa-cloud-sun"></i>
          Marine Weather
        </h2>
      </div>
      <div className="weather-content">
        <div className="current-weather">
          <div className="weather-icon">
            <i className="fas fa-sun"></i>
          </div>
          <div className="weather-details">
            <div className="temperature">28°C</div>
            <div className="conditions">Partly Cloudy</div>
            <div className="location">Bay of Bengal</div>
          </div>
        </div>
        <div className="weather-metrics">
          <div className="weather-item">
            <i className="fas fa-wind"></i>
            <span>12 km/h NE</span>
          </div>
          <div className="weather-item">
            <i className="fas fa-water"></i>
            <span>Wave: 1.2m</span>
          </div>
          <div className="weather-item">
            <i className="fas fa-eye"></i>
            <span>Visibility: 15km</span>
          </div>
        </div>
        <div className="weather-alerts">
          <div className="weather-alert warning">
            <i className="fas fa-exclamation-triangle"></i>
            <span>High tide warning at 3:30 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;