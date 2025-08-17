import type { FC } from "react";

interface NotificationProps {
	type?: "success" | "error" | "info";
	message: string;
	onClose?: () => void;
}

export const Notification: FC<NotificationProps> = ({ type = "info", message, onClose }) => {
	return (
		<div className={`notification ${type}`}>
			<span>{message}</span>
			{onClose && (
				<button className="notification-close" onClick={onClose} aria-label="Close">×</button>
			)}
		</div>
	);
};
