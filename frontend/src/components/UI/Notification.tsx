import type { FC } from "react";

interface NotificationProps {
	type?: "success" | "error" | "info" | "warning";
	title?: string;
	message: string;
	onClose?: () => void;
}

export const Notification: FC<NotificationProps> = ({ type = "info", title, message, onClose }) => {
	return (
		<div className={`notification ${type}`}>
			<div className="notification-content">
				{title && <div className="notification-title">{title}</div>}
				<span className="notification-message">{message}</span>
			</div>
			{onClose && (
				<button className="notification-close" onClick={onClose} aria-label="Close">×</button>
			)}
		</div>
	);
};
