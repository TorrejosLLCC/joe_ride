import { useState, useCallback } from "react";
import { useUser } from "../../store/user-context";
import { useNotifications } from "../../store/notifications-context";
import { useProfileForm } from "./hooks/useProfileForm";
import { useResizablePanel } from "./hooks/useResizablePanel";
import { ProfileSidebar } from "./ProfileSidebar";
import { ProfileForm } from "./ProfileForm";
import { PROFILE_CONSTANTS } from "./constants";

const NOTIFICATION_MESSAGES = PROFILE_CONSTANTS.MESSAGES;

export const UserProfile = () => {
  const { user, updateProfile } = useUser();
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    formData,
    isEditing,
    updateField,
    startEditing,
    cancelEditing,
    validateAndGetUpdateData,
    getFieldError,
  } = useProfileForm(user);

  const {
    width: sidebarWidth,
    isResizing,
    startResizing,
  } = useResizablePanel({
    initialWidth: PROFILE_CONSTANTS.SIDEBAR.DEFAULT_WIDTH,
    minWidth: PROFILE_CONSTANTS.SIDEBAR.MIN_WIDTH,
    maxWidth: PROFILE_CONSTANTS.SIDEBAR.MAX_WIDTH,
  });

  const handleEdit = useCallback(() => {
    startEditing();
  }, [startEditing]);

  const handleCancel = useCallback(() => {
    cancelEditing();
  }, [cancelEditing]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    const { isValid, updateData } = validateAndGetUpdateData();
    
    if (!isValid) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await updateProfile(updateData!);
      cancelEditing();
      addNotification({
        title: "Success",
        message: NOTIFICATION_MESSAGES.SUCCESS,
        type: "success"
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      addNotification({
        title: "Error",
        message: NOTIFICATION_MESSAGES.ERROR,
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, validateAndGetUpdateData, updateProfile, cancelEditing, addNotification]);

  const handleFieldChange = useCallback((field: keyof typeof formData, value: string) => {
    updateField(field, value);
  }, [updateField]);

  // Early return after all hooks
  if (!user) {
    return (
      <div className="profile-page-loading">
        <div className="loading-spinner">{NOTIFICATION_MESSAGES.LOADING}</div>
      </div>
    );
  }

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
        <ProfileSidebar
          user={user}
          width={sidebarWidth}
          isEditing={isEditing}
          isLoading={isLoading}
          onEdit={handleEdit}
          onStartResizing={startResizing}
          isResizing={isResizing}
        />

        <ProfileForm
          user={user}
          formData={formData}
          isEditing={isEditing}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onFieldChange={handleFieldChange}
          getFieldError={getFieldError}
        />
      </div>
    </div>
  );
};