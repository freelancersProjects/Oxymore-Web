import React, { FC, useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Tooltip.scss';

export interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

const OXMTooltip: FC<TooltipProps> = ({
  text,
  children,
  position: initialPosition = 'top',
  delay = 200
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0, arrowOffset: 0 });
  const [actualPosition, setActualPosition] = useState(initialPosition);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const positionRef = useRef(initialPosition);

  const updatePosition = () => {
    if (parentRef.current && tooltipRef.current) {
      const parentRect = parentRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const padding = 10;
      const gapVertical = 12;
      const gapHorizontal = 20;
      let currentPosition = positionRef.current;
      const arrowSize = 8;

      let top = 0;
      let left = 0;
      let arrowOffset = 0;
      const parentCenterX = parentRect.left + (parentRect.width / 2);
      const parentCenterY = parentRect.top + (parentRect.height / 2);

      switch (currentPosition) {
        case 'top': {
          left = parentCenterX - (tooltipRect.width / 2);

          if (left < padding) {
            left = padding;
          } else if (left + tooltipRect.width > viewportWidth - padding) {
            left = viewportWidth - tooltipRect.width - padding;
          }

          top = parentRect.top - tooltipRect.height - gapVertical;

          const tooltipBottom = top + tooltipRect.height;
          const overlapsParent = top < parentRect.bottom && tooltipBottom > parentRect.top;

          if (top < padding || overlapsParent) {
            top = parentRect.bottom + gapVertical;
            currentPosition = 'bottom';
            positionRef.current = 'bottom';
            setActualPosition('bottom');
          }

          arrowOffset = parentCenterX - left;
          break;
        }
        case 'bottom': {
          left = parentCenterX - (tooltipRect.width / 2);

          if (left < padding) {
            left = padding;
          } else if (left + tooltipRect.width > viewportWidth - padding) {
            left = viewportWidth - tooltipRect.width - padding;
          }

          top = parentRect.bottom + gapVertical;

          const tooltipBottom = top + tooltipRect.height;
          const overlapsParent = top < parentRect.bottom && tooltipBottom > parentRect.top;

          if (tooltipBottom > viewportHeight - padding || overlapsParent) {
            top = parentRect.top - tooltipRect.height - gapVertical;
            currentPosition = 'top';
            positionRef.current = 'top';
            setActualPosition('top');
          }

          arrowOffset = parentCenterX - left;
          break;
        }
        case 'left': {
          left = parentRect.left - tooltipRect.width - gapHorizontal;

          const tooltipRight = left + tooltipRect.width;
          const overlapsParent = tooltipRight >= parentRect.left;

          if (left < padding || overlapsParent) {
            if (left < padding) {
              left = parentRect.right + gapHorizontal;
              currentPosition = 'right';
              positionRef.current = 'right';
              setActualPosition('right');
            } else {
              left = parentRect.left - tooltipRect.width - gapHorizontal;
            }
          }

          top = parentCenterY - (tooltipRect.height / 2);

          if (top < padding) {
            top = padding;
          } else if (top + tooltipRect.height > viewportHeight - padding) {
            top = viewportHeight - tooltipRect.height - padding;
          }

          arrowOffset = parentCenterY - top;
          break;
        }
        case 'right': {
          left = parentRect.right + gapHorizontal;

          const tooltipRight = left + tooltipRect.width;
          const overlapsParent = left <= parentRect.right;

          if (overlapsParent || tooltipRight > viewportWidth - padding) {
            if (tooltipRight > viewportWidth - padding) {
              left = parentRect.left - tooltipRect.width - gapHorizontal;
              currentPosition = 'left';
              positionRef.current = 'left';
              setActualPosition('left');
            } else {
              left = parentRect.right + gapHorizontal;
            }
          }

          top = parentCenterY - (tooltipRect.height / 2);

          if (top < padding) {
            top = padding;
          } else if (top + tooltipRect.height > viewportHeight - padding) {
            top = viewportHeight - tooltipRect.height - padding;
          }

          arrowOffset = parentCenterY - top;
          break;
        }
      }

      const minArrowOffset = arrowSize + 6;
      const maxArrowOffset = (currentPosition === 'top' || currentPosition === 'bottom')
        ? tooltipRect.width - arrowSize - 6
        : tooltipRect.height - arrowSize - 6;

      const constrainedArrowOffset = Math.max(minArrowOffset, Math.min(arrowOffset, maxArrowOffset));

      const finalTop = Math.max(padding, Math.min(top, viewportHeight - tooltipRect.height - padding));
      const finalLeft = Math.max(padding, Math.min(left, viewportWidth - tooltipRect.width - padding));

      setTooltipPosition({
        top: finalTop,
        left: finalLeft,
        arrowOffset: constrainedArrowOffset
      });
    }
  };

  const handleMouseEnter = () => {
    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
        setTimeout(() => {
          updatePosition();
        }, 0);
      }, delay);
    } else {
      setIsVisible(true);
      setTimeout(() => {
        updatePosition();
      }, 0);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible && tooltipRef.current) {
      const updatePositionWithDelay = () => {
        requestAnimationFrame(() => {
          if (tooltipRef.current) {
            updatePosition();
          }
        });
      };

      updatePositionWithDelay();

      const handleScroll = () => {
        updatePositionWithDelay();
      };

      const handleResize = () => {
        updatePositionWithDelay();
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [isVisible]);

  useEffect(() => {
    positionRef.current = initialPosition;
    setActualPosition(initialPosition);
  }, [initialPosition]);

  const tooltipContent = isVisible ? (
    <div
      ref={tooltipRef}
      className={`oxm-tooltip oxm-tooltip--${actualPosition}`}
      style={{
        position: 'fixed',
        top: `${tooltipPosition.top}px`,
        left: `${tooltipPosition.left}px`,
        zIndex: 99999,
        pointerEvents: 'none'
      }}
    >
      <div className="oxm-tooltip-content">{text}</div>
      <div
        className={`oxm-tooltip-arrow oxm-tooltip-arrow--${actualPosition}`}
        style={
          (actualPosition === 'top' || actualPosition === 'bottom')
            ? { left: `${tooltipPosition.arrowOffset}px`, transform: 'translateX(-50%)' }
            : { top: `${tooltipPosition.arrowOffset}px`, transform: 'translateY(-50%)' }
        }
      ></div>
    </div>
  ) : null;

  return (
    <>
      <div
        ref={parentRef}
        className={`oxm-tooltip-wrapper oxm-tooltip-wrapper--${initialPosition}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {tooltipContent && ReactDOM.createPortal(tooltipContent, document.body)}
    </>
  );
};

export default OXMTooltip;

