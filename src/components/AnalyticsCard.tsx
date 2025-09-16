import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    Chart: any;
  }
}

const AnalyticsCard: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (chartRef.current && window.Chart && !chartInstance.current) {
      const ctx = chartRef.current.getContext('2d');
      const chartData = generateChartData();

      chartInstance.current = new window.Chart(ctx, {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: 'Oil Spills',
              data: chartData.oilSpills,
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Plastic Waste',
              data: chartData.plasticWaste,
              borderColor: '#f59e0b',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Chemical Pollution',
              data: chartData.chemicalPollution,
              borderColor: '#8b5cf6',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Marine Life Issues',
              data: chartData.marineLife,
              borderColor: '#06b6d4',
              backgroundColor: 'rgba(6, 182, 212, 0.1)',
              tension: 0.4,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: 'index' as const
          },
          plugins: {
            legend: {
              position: 'top' as const,
              labels: {
                usePointStyle: true,
                padding: 20,
                color: '#64748b'
              }
            },
            tooltip: {
              backgroundColor: 'rgba(30, 41, 59, 0.9)',
              titleColor: '#f1f5f9',
              bodyColor: '#94a3b8',
              borderColor: 'rgba(102, 126, 234, 0.3)',
              borderWidth: 1,
              cornerRadius: 12,
              padding: 16
            }
          },
          scales: {
            x: {
              grid: {
                color: 'rgba(226, 232, 240, 0.3)',
                drawBorder: false
              },
              ticks: {
                color: '#64748b'
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(226, 232, 240, 0.3)',
                drawBorder: false
              },
              ticks: {
                color: '#64748b'
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, []);

  const generateChartData = () => {
    const days = 7;
    const labels = [];
    const oilSpills = [];
    const plasticWaste = [];
    const chemicalPollution = [];
    const marineLife = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
      
      oilSpills.push(Math.floor(Math.random() * 15) + 5);
      plasticWaste.push(Math.floor(Math.random() * 25) + 15);
      chemicalPollution.push(Math.floor(Math.random() * 8) + 2);
      marineLife.push(Math.floor(Math.random() * 12) + 8);
    }

    return { labels, oilSpills, plasticWaste, chemicalPollution, marineLife };
  };

  return (
    <div className="card analytics-card">
      <div className="card-header">
        <h2>
          <i className="fas fa-chart-line"></i>
          Predictive Analytics
        </h2>
        <div className="chart-controls">
          <select className="chart-select">
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 3 Months</option>
          </select>
        </div>
      </div>
      <div className="chart-container">
        <canvas ref={chartRef}></canvas>
      </div>
      <div className="chart-insights">
        <div className="insight">
          <i className="fas fa-lightbulb"></i>
          <span>Peak reporting hours: 6-9 AM</span>
        </div>
        <div className="insight">
          <i className="fas fa-trending-up"></i>
          <span>Oil spill reports increased 15% this week</span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;