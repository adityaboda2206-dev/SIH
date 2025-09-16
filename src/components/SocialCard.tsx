import React from 'react';
import { SocialPost } from '../types';

interface SocialCardProps {
  socialPosts: SocialPost[];
  showNotification: (title: string, message: string, type: string) => void;
}

const SocialCard: React.FC<SocialCardProps> = ({ socialPosts, showNotification }) => {
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

  const getPlatformIcon = (platform: string) => {
    const icons: { [key: string]: string } = {
      twitter: '🐦',
      instagram: '📸',
      facebook: '👥',
      youtube: '📺',
      tiktok: '🎵'
    };
    return icons[platform] || '🌐';
  };

  const getSentimentIcon = (sentiment: string) => {
    const icons: { [key: string]: string } = {
      positive: 'fa-smile',
      negative: 'fa-frown',
      neutral: 'fa-meh'
    };
    return icons[sentiment] || 'fa-meh';
  };

  const calculateSentimentMetrics = () => {
    const positive = socialPosts.filter(post => post.sentiment === 'positive').length;
    const neutral = socialPosts.filter(post => post.sentiment === 'neutral').length;
    const negative = socialPosts.filter(post => post.sentiment === 'negative').length;
    const total = socialPosts.length;
    
    return {
      positive: Math.round((positive / total) * 100),
      neutral: Math.round((neutral / total) * 100),
      negative: Math.round((negative / total) * 100)
    };
  };

  const handleViewPost = (postId: number) => {
    const post = socialPosts.find(p => p.id === postId);
    if (post) {
      showNotification('Social Post', `Viewing post by ${post.username} on ${post.platform}`, 'info');
    }
  };

  const metrics = calculateSentimentMetrics();

  return (
    <div className="card social-card">
      <div className="card-header">
        <h2>
          <i className="fas fa-hashtag"></i>
          Social Media Intelligence
        </h2>
        <div className="social-metrics">
          <div className="metric positive">
            <span className="metric-value">{metrics.positive}%</span>
            <span className="metric-label">Positive</span>
          </div>
          <div className="metric neutral">
            <span className="metric-value">{metrics.neutral}%</span>
            <span className="metric-label">Neutral</span>
          </div>
          <div className="metric negative">
            <span className="metric-value">{metrics.negative}%</span>
            <span className="metric-label">Negative</span>
          </div>
        </div>
      </div>
      <div className="social-feed">
        {socialPosts.map(post => (
          <div 
            key={post.id}
            className={`social-post sentiment-${post.sentiment} fade-in`}
            onClick={() => handleViewPost(post.id)}
          >
            <div className="post-header">
              <div className="post-avatar">{post.username.charAt(0).toUpperCase()}</div>
              <div className="post-info">
                <div className="post-username">
                  {post.username}
                  {post.verified && <i className="fas fa-check-circle verified-badge"></i>}
                  <span className="platform-badge">{getPlatformIcon(post.platform)}</span>
                </div>
                <div className="post-time">{formatTimeAgo(post.timestamp)}</div>
              </div>
            </div>
            <div className="post-content">{post.content}</div>
            <div className="post-footer">
              <div className={`sentiment-indicator sentiment-${post.sentiment}`}>
                <i className={`fas ${getSentimentIcon(post.sentiment)}`}></i>
                {post.sentiment}
              </div>
              <div className="engagement-stats">
                <span><i className="fas fa-heart"></i> {post.engagement}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialCard;