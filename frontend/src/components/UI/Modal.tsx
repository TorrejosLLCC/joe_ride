import type { FC, ReactNode } from "react";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    width?: string;
    height?: string;
    maxHeight?: string;
}

export const Modal: FC<ModalProps> = ({ 
    open, 
    onClose, 
    title, 
    children, 
    width = "600px", 
    height = "auto", 
    maxHeight = "90vh" 
}) => {
    if (!open) return null;
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    const handleClose = () => {
        document.body.style.overflow = 'auto';
        onClose();
    };

    return (
        <div className="modal-backdrop">
            <div
                className="modal" 
                style={{ 
                    width, 
                    height, 
                    maxHeight,
                    display: 'flex',
                    flexDirection: 'column'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    {title && <h2>{title}</h2>}
                    <button className="modal-close" onClick={handleClose} aria-label="Close">×</button>
                </div>
                <div 
                    className="modal-body" 
                    style={{ 
                        overflowY: 'auto', 
                        flex: 1,
                        padding: '20px'
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};