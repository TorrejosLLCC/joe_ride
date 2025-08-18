import type { FC, ReactNode } from "react";

interface ModalProps {
	open: boolean;
	onClose: () => void;
	title?: string;
	children: ReactNode;
	width?: string;
}

export const Modal: FC<ModalProps> = ({ open, onClose, title, children, width = "400px" }) => {
	if (!open) return null;
	return (
		<div className="modal-backdrop" onClick={onClose}>
			<div
				className="modal" 
				style={{ width }}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="modal-header">
					{title && <h2>{title}</h2>}
					<button className="modal-close" onClick={onClose} aria-label="Close">×</button>
				</div>
				<div className="modal-body">{children}</div>
			</div>
		</div>
	);
};
