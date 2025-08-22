import { useState, useRef, useCallback } from "react";
import { useUser } from "../../store/user-context";
import { Input } from "../UI/Input";
import { Button } from "../UI/Button";
import { Card } from "../UI/Card";

export const ProfilePage = () => {
  const { user, updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    homeAddress: user?.homeAddress || "",
    mobilePhoneNumber: user?.mobilePhoneNumber || "",
    vehicleType: user?.vehicleType || "",
    vehiclePlate: user?.vehiclePlate || "",
    driversLicenseNumber: user?.driversLicenseNumber || "",
    password: "",
    confirmPassword: "",
  });

  // Resize handlers - moved before early return
  const startResizing = useCallback((mouseDownEvent: React.MouseEvent) => {
    setIsResizing(true);
    
    const startX = mouseDownEvent.clientX;
    const startWidth = sidebarWidth;

    const doDrag = (mouseMoveEvent: MouseEvent) => {
      const newWidth = startWidth + mouseMoveEvent.clientX - startX;
      if (newWidth >= 200 && newWidth <= 500) {
        setSidebarWidth(newWidth);
      }
    };

    const stopDrag = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);
    };

    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
  }, [sidebarWidth]);

  // Early return after all hooks
  if (!user) {
    return <div>Loading...</div>;
  }

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      name: user.name,
      email: user.email,
      homeAddress: user.homeAddress,
      mobilePhoneNumber: user.mobilePhoneNumber,
      vehicleType: user.vehicleType || "",
      vehiclePlate: user.vehiclePlate || "",
      driversLicenseNumber: user.driversLicenseNumber || "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user.name,
      email: user.email,
      homeAddress: user.homeAddress,
      mobilePhoneNumber: user.mobilePhoneNumber,
      vehicleType: user.vehicleType || "",
      vehiclePlate: user.vehiclePlate || "",
      driversLicenseNumber: user.driversLicenseNumber || "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Validate password only if user wants to change it
    if (formData.password || formData.confirmPassword) {
      if (!formData.password && formData.confirmPassword) {
        alert("Please enter a new password if you want to change it!");
        return;
      }
      if (formData.password && !formData.confirmPassword) {
        alert("Please confirm your new password!");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      if (formData.password && formData.password.length < 8) {
        alert("Password must be at least 8 characters long!");
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      // Prepare update data
      const updateData: any = {
        fullName: formData.name,
        email: formData.email,
        homeAddress: formData.homeAddress,
        mobilePhoneNumber: formData.mobilePhoneNumber,
        vehicleType: formData.vehicleType,
        vehiclePlate: formData.vehiclePlate,
        driversLicenseNumber: formData.driversLicenseNumber,
      };
      
      // Only include password if it's provided
      if (formData.password) {
        updateData.password = formData.password;
      }
      
      // Call the API to update the user profile
      await updateProfile(updateData);
      
      setIsEditing(false);
      // Success notification could be added here
    } catch (error) {
      console.error("Failed to update profile:", error);
      // Error notification could be added here
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <div className={`profile-page ${isResizing ? 'no-select' : ''}`}>
      <div className="profile-header">
        <h2>User Profile</h2>
      </div>
      <div 
        className="profile-container"
        style={{
          gridTemplateColumns: `${sidebarWidth}px 1fr`
        }}
      >
        {/* Left Profile Card */}
        <div 
          className="profile-sidebar"
          ref={sidebarRef}
          style={{ width: sidebarWidth }}
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
                  onClick={handleEdit}
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
            onMouseDown={startResizing}
          />
        </div>

        {/* Right Content Area */}
        <div className="profile-content">
          {/* User Details Form */}
          <Card>
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <Input
                    value={isEditing ? formData.name : user.name}
                    onChange={handleInputChange('name')}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="form-group">
                  <label>Phone</label>
                  <Input
                    value={isEditing ? formData.mobilePhoneNumber : user.mobilePhoneNumber}
                    onChange={handleInputChange('mobilePhoneNumber')}
                    disabled={!isEditing}
                    placeholder="e.g., +1234567890"
                  />
                </div>
                
                <div className="form-group full-width">
                  <label>Email</label>
                  <Input
                    type="email"
                    value={isEditing ? formData.email : user.email}
                    onChange={handleInputChange('email')}
                    disabled={!isEditing}
                  />
                </div>
                
                {isEditing && (
                  <>
                    <div className="form-group">
                      <label>New Password (optional)</label>
                      <Input
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange('password')}
                        placeholder="Leave empty to keep current password"
                        required={false}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Confirm Password</label>
                      <Input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange('confirmPassword')}
                        placeholder="Confirm new password"
                        required={false}
                      />
                    </div>
                  </>
                )}
                
                <div className="form-group full-width">
                  <label>Address</label>
                  <Input
                    value={isEditing ? formData.homeAddress : user.homeAddress}
                    onChange={handleInputChange('homeAddress')}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="form-group">
                  <label>Vehicle Type</label>
                  <Input
                    value={isEditing ? formData.vehicleType : user.vehicleType || ""}
                    onChange={handleInputChange('vehicleType')}
                    disabled={!isEditing}
                    placeholder="e.g., Car, Motorcycle, SUV"
                  />
                </div>
                
                <div className="form-group">
                  <label>Vehicle Plate</label>
                  <Input
                    value={isEditing ? formData.vehiclePlate : user.vehiclePlate || ""}
                    onChange={handleInputChange('vehiclePlate')}
                    disabled={!isEditing}
                    placeholder="e.g., ABC-123"
                  />
                </div>
                
                <div className="form-group full-width">
                  <label>Driver's License Number</label>
                  <Input
                    value={isEditing ? formData.driversLicenseNumber : user.driversLicenseNumber || ""}
                    onChange={handleInputChange('driversLicenseNumber')}
                    disabled={!isEditing}
                    placeholder="Driver's license number"
                  />
                </div>
              </div>
              
              {isEditing && (
                <div className="form-actions">
                  <Button type="submit" className="edit-btn" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save"}
                  </Button>
                  <Button type="button" variant="secondary" onClick={handleCancel} disabled={isLoading}>
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};