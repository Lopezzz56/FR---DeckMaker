import React from 'react';
import { FocusRealmLogo } from './FocusRealmLogo';

interface FocusRealmLoaderProps {
  size?: number;
  title?: string;
  subtitle?: string;
  status?: string;
  fullScreen?: boolean;
  progress?: number; // 0 - 100 optional
  primaryColor?: string;
  accentColor?: string;
}

export const FocusRealmLoader: React.FC<FocusRealmLoaderProps> = ({
  size = 72,
  title = 'Focus Realm',
  subtitle = 'First Call Deck Studio',
  status = 'Loading presentations...',
  fullScreen = true,
  progress,
  primaryColor = '#102F35',
  accentColor = '#3DB89E',
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 select-none text-center max-w-sm mx-auto">
      {/* Animated Logo with Brand Halo */}
      <div className="relative mb-6">
        {/* Soft Radial Ambient Glow */}
        <div 
          className="absolute inset-0 rounded-3xl blur-xl opacity-40 animate-pulse pointer-events-none -z-10"
          style={{ backgroundColor: accentColor, transform: 'scale(1.2)' }}
        />
        <FocusRealmLogo
          size={size}
          primaryColor={primaryColor}
          accentColor={accentColor}
          animated={true}
        />
      </div>

      {/* Brand Title */}
      <h2 
        className="text-lg font-bold font-serif tracking-tight"
        style={{ color: primaryColor }}
      >
        {title}
      </h2>

      {/* Subtitle / Tagline */}
      <p className="text-xs font-medium text-slate-500 tracking-wider uppercase mt-1">
        {subtitle}
      </p>

      {/* Animated Progress Bar */}
      <div className="w-52 h-1 bg-slate-200/80 rounded-full mt-6 overflow-hidden relative shadow-inner">
        {progress !== undefined ? (
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{ 
              width: `${Math.min(100, Math.max(0, progress))}%`,
              backgroundColor: accentColor 
            }}
          />
        ) : (
          <div 
            className="h-full rounded-full animate-loader-bar"
            style={{ 
              background: `linear-gradient(90deg, transparent, ${accentColor}, ${primaryColor}, transparent)` 
            }}
          />
        )}
      </div>

      {/* Dynamic Status Text */}
      {status && (
        <p className="text-xs text-slate-400 font-medium mt-3.5 tracking-tight animate-pulse">
          {status}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 min-h-screen bg-slate-50 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};
