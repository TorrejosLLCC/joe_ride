import { memo } from 'react';
import type { User } from '../../store/user-context';
import { Card } from '../UI/Card';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import type { ProfileFormData } from './hooks/useProfileForm';

interface ProfileFormProps {
  user: User;
  formData: ProfileFormData;
  isEditing: boolean;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onFieldChange: (field: keyof ProfileFormData, value: string) => void;
  getFieldError: (field: keyof ProfileFormData) => string | undefined;
}

export const ProfileForm = memo(({
  user,
  formData,
  isEditing,
  isLoading,
  onSubmit,
  onCancel,
  onFieldChange,
  getFieldError
}: ProfileFormProps) => {
  const handleInputChange = (field: keyof ProfileFormData) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      onFieldChange(field, e.target.value);
    };

  return (
    <div className="profile-content">
      <Card>
        <form onSubmit={onSubmit} className="profile-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <Input
                value={isEditing ? formData.name : user.name}
                onChange={handleInputChange('name')}
                disabled={!isEditing}
              />
              {getFieldError('name') && <span className="field-error">{getFieldError('name')}</span>}
            </div>
            
            <div className="form-group">
              <label>Phone</label>
              <Input
                value={isEditing ? formData.mobilePhoneNumber : user.mobilePhoneNumber}
                onChange={handleInputChange('mobilePhoneNumber')}
                disabled={!isEditing}
                placeholder="e.g., +1234567890"
              />
              {getFieldError('mobilePhoneNumber') && <span className="field-error">{getFieldError('mobilePhoneNumber')}</span>}
            </div>
            
            <div className="form-group full-width">
              <label>Email</label>
              <Input
                type="email"
                value={isEditing ? formData.email : user.email}
                onChange={handleInputChange('email')}
                disabled={!isEditing}
              />
              {getFieldError('email') && <span className="field-error">{getFieldError('email')}</span>}
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
                  {getFieldError('password') && <span className="field-error">{getFieldError('password')}</span>}
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
                  {getFieldError('confirmPassword') && <span className="field-error">{getFieldError('confirmPassword')}</span>}
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
              {getFieldError('homeAddress') && <span className="field-error">{getFieldError('homeAddress')}</span>}
            </div>
            
            <div className="form-group">
              <label>Vehicle Type</label>
              <Input
                value={isEditing ? formData.vehicleType : user.vehicleType || ""}
                onChange={handleInputChange('vehicleType')}
                disabled={!isEditing}
                placeholder="e.g., Car, Motorcycle, SUV"
              />
              {getFieldError('vehicleType') && <span className="field-error">{getFieldError('vehicleType')}</span>}
            </div>
            
            <div className="form-group">
              <label>Vehicle Plate</label>
              <Input
                value={isEditing ? formData.vehiclePlate : user.vehiclePlate || ""}
                onChange={handleInputChange('vehiclePlate')}
                disabled={!isEditing}
                placeholder="e.g., ABC-123"
              />
              {getFieldError('vehiclePlate') && <span className="field-error">{getFieldError('vehiclePlate')}</span>}
            </div>
            
            <div className="form-group full-width">
              <label>Driver's License Number</label>
              <Input
                value={isEditing ? formData.driversLicenseNumber : user.driversLicenseNumber || ""}
                onChange={handleInputChange('driversLicenseNumber')}
                disabled={!isEditing}
                placeholder="Driver's license number"
              />
              {getFieldError('driversLicenseNumber') && <span className="field-error">{getFieldError('driversLicenseNumber')}</span>}
            </div>
          </div>
          
          {isEditing && (
            <div className="form-actions">
              <Button type="submit" className="edit-btn" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
              <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
});
