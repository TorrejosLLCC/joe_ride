import { memo } from 'react';
import type { User } from '../../store/user-context';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';

interface ProfileSidebarProps {
  user: User;
  width: number;
  isEditing: boolean;
  isLoading: boolean;
  onEdit: () => void;
  onStartResizing: (event: React.MouseEvent) => void;
  isResizing: boolean;
}

export const ProfileSidebar = memo(({
  user,
  width,
  isEditing,
  isLoading,
  onEdit,
  onStartResizing,
  isResizing
}: ProfileSidebarProps) => {
  return (
    <div 
      className="profile-sidebar"
      style={{ width }}
    >
      <Card>
        <div className="profile-card">
          <div className="avatar-section">
            <div className="avatar">
              <img 
                src="/api/placeholder/120/120" 
                alt="Profile Avatar"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.display = 'flex';
                  }
                }}
              />
              <div className="avatar-fallback" style={{ display: 'none' }}>
                <span>{user.name.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          </div>
          
          <div className="profile-info">
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-title">Ride Share Member</p>
            <p className="profile-location">{user.homeAddress}</p>
          </div>

          <div className="profile-actions">
            <Button 
              onClick={onEdit}
              disabled={isEditing || isLoading}
              className="follow-btn"
            >
              {isEditing ? "Editing..." : "Edit"}
            </Button>
            <Button variant="secondary" className="message-btn">
              Message
            </Button>
          </div>

          {/* Social Links */}
          <div className="social-links">
            <div className="social-item">
              <span className="social-icon">🌐</span>
              <span className="social-label">Website</span>
              <span className="social-value">joeride.com</span>
            </div>
            <div className="social-item">
              <span className="social-icon">💼</span>
              <span className="social-label">Rides</span>
              <span className="social-value">{user.name.toLowerCase()}</span>
            </div>
            <div className="social-item">
              <span className="social-icon">📱</span>
              <span className="social-label">Mobile</span>
              <span className="social-value">{user.mobilePhoneNumber}</span>
            </div>
            <div className="social-item">
              <span className="social-icon">📧</span>
              <span className="social-label">Email</span>
              <span className="social-value">{user.email}</span>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Resize Handle */}
      <div 
        className={`resize-handle ${isResizing ? 'resizing' : ''}`}
        onMouseDown={onStartResizing}
      />
    </div>
  );
});
