import React, { useRef, useState, useEffect } from 'react';
import { SLIDE_GEOMETRY } from '../types/slideGeometry';

interface SlideViewportProps {
  children: React.ReactNode;
  className?: string;
  maxScale?: number;
}

/**
 * SlideViewport
 * 
 * Houses the canonical 1920 x 1080 slide inside a dynamically measured container.
 * Calculates uniform scale factor: Math.min(availW / 1920, availH / 1080)
 * 
 * Guarantee: 
 * - The slide canvas inside is ALWAYS 1920px wide by 1080px high.
 * - Element coordinates, font sizes, margins, card heights NEVER change or jump.
 * - Uniformly scaled, perfectly centered, zero distortion, zero clipping.
 */
export const SlideViewport: React.FC<SlideViewportProps> = ({ 
  children, 
  className = '',
  maxScale = 1.0 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const containerWidth = el.clientWidth;
      const containerHeight = el.clientHeight;

      if (!containerWidth || !containerHeight) return;

      const scaleX = containerWidth / SLIDE_GEOMETRY.CANVAS_WIDTH;
      const scaleY = containerHeight / SLIDE_GEOMETRY.CANVAS_HEIGHT;

      // Uniform scale factor preserving exact 16:9 aspect ratio
      const computedScale = Math.min(scaleX, scaleY, maxScale);
      setScale(computedScale);
    };

    updateScale();

    const resizeObserver = new ResizeObserver(() => {
      updateScale();
    });

    resizeObserver.observe(el);
    window.addEventListener('resize', updateScale);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [maxScale]);

  const displayWidth = SLIDE_GEOMETRY.CANVAS_WIDTH * scale;
  const displayHeight = SLIDE_GEOMETRY.CANVAS_HEIGHT * scale;

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full flex items-center justify-center overflow-hidden relative select-none ${className}`}
      style={{ touchAction: 'none' }}
    >
      <div 
        style={{
          width: `${displayWidth}px`,
          height: `${displayHeight}px`,
          position: 'relative',
          flexShrink: 0
        }}
      >
        <div 
          style={{
            width: `${SLIDE_GEOMETRY.CANVAS_WIDTH}px`,
            height: `${SLIDE_GEOMETRY.CANVAS_HEIGHT}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
