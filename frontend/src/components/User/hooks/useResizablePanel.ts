import { useState, useCallback, useRef } from 'react';

interface UseResizablePanelProps {
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

export const useResizablePanel = ({
  initialWidth = 280,
  minWidth = 200,
  maxWidth = 500,
}: UseResizablePanelProps = {}) => {
  const [width, setWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const startResizing = useCallback(
    (mouseDownEvent: React.MouseEvent) => {
      setIsResizing(true);

      const startX = mouseDownEvent.clientX;
      const startWidth = width;

      const doDrag = (mouseMoveEvent: MouseEvent) => {
        const newWidth = startWidth + mouseMoveEvent.clientX - startX;
        if (newWidth >= minWidth && newWidth <= maxWidth) {
          setWidth(newWidth);
        }
      };

      const stopDrag = () => {
        setIsResizing(false);
        document.removeEventListener('mousemove', doDrag);
        document.removeEventListener('mouseup', stopDrag);
      };

      document.addEventListener('mousemove', doDrag);
      document.addEventListener('mouseup', stopDrag);
    },
    [width, minWidth, maxWidth]
  );

  return {
    width,
    isResizing,
    panelRef,
    startResizing,
  };
};
