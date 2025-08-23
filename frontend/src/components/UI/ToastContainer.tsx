import { useEffect, useState } from "react";
import { useNotifications } from "../../store/notifications-context";
import { Notification } from "./Notification";

export const ToastContainer = () => {
  const { notifications, removeNotification } = useNotifications();
  const [exitingNotifications, setExitingNotifications] = useState<Set<string>>(new Set());

  const handleRemoveNotification = (id: string) => {
    // Add notification to exiting set
    setExitingNotifications(prev => new Set(prev).add(id));
    
    // Remove from DOM after animation completes
    setTimeout(() => {
      removeNotification(id);
      setExitingNotifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 300); // Match the CSS transition duration
  };

  // Auto-remove notifications after 5 seconds for success and info messages
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    
    notifications.forEach(notification => {
      if ((notification.type === 'success' || notification.type === 'info') && !exitingNotifications.has(notification.id)) {
        const timer = setTimeout(() => {
          handleRemoveNotification(notification.id);
        }, 5000);
        timers.push(timer);
      }
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [notifications, exitingNotifications]);

  return (
    <div className="toast-container">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`notification-wrapper ${exitingNotifications.has(notification.id) ? 'exiting' : ''}`}
        >
          <Notification
            type={notification.type}
            title={notification.title}
            message={notification.message}
            onClose={() => handleRemoveNotification(notification.id)}
          />
        </div>
      ))}
    </div>
  );
};
