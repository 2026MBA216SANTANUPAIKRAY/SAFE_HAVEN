import React from 'react';

interface SafeHavenLogoProps {
  className?: string;
  size?: number; // size in pixels, default 36
  showWordmark?: boolean;
  variant?: 'dark' | 'light' | 'monochrome';
}

export const SafeHavenLogo: React.FC<SafeHavenLogoProps> = ({
  className = '',
  size = 36,
  showWordmark = false,
  variant = 'dark'
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Vector Emblem (Shield + Architectural Haven + 60GHz Sub-mm Wave) */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
        aria-label="SafeHaven Institutional Shield Logo"
        role="img"
      >
        <defs>
          {/* Obsidian Vault Gradient */}
          <linearGradient id="shShieldBg" x1="6" y1="4" x2="58" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#121624" />
            <stop offset="48%" stopColor="#080b12" />
            <stop offset="100%" stopColor="#030408" />
          </linearGradient>

          {/* Institutional Crimson Rim */}
          <linearGradient id="shCrimsonRim" x1="10" y1="6" x2="54" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#d92d4b" />
            <stop offset="50%" stopColor="#b81c37" />
            <stop offset="100%" stopColor="#7a0c20" />
          </linearGradient>

          {/* Sovereign Gold Crest */}
          <linearGradient id="shGoldAccent" x1="16" y1="12" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffd88d" />
            <stop offset="60%" stopColor="#dfa74d" />
            <stop offset="100%" stopColor="#ab7b2b" />
          </linearGradient>

          {/* mmWave Radar Pulse Glow */}
          <radialGradient id="shRadarGlow" cx="32" cy="28" r="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3E8F5D" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#3E8F5D" stopOpacity="0" />
          </radialGradient>

          {/* Shield Drop Shadow */}
          <filter id="shDropGlow" x="-2" y="-2" width="68" height="68" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Outer Protective Shield Geometry */}
        <path
          d="M32 4.5 C44.5 4.5 55.5 8 57.5 16 C57.5 32 47.5 48 32 59.5 C16.5 48 6.5 32 6.5 16 C8.5 8 19.5 4.5 32 4.5 Z"
          fill="url(#shShieldBg)"
          stroke="url(#shCrimsonRim)"
          strokeWidth="2.2"
          strokeLinejoin="round"
          filter="url(#shDropGlow)"
        />

        {/* Inner Radar Field Subtle Ambient Radiance */}
        <circle cx="32" cy="27" r="17" fill="url(#shRadarGlow)" />

        {/* 60GHz Sub-Millimeter Radar Arc 1 (Outer Wave) */}
        <path
          d="M20 23.5 C23.5 19.5 40.5 19.5 44 23.5"
          stroke="url(#shGoldAccent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.75"
        />

        {/* 60GHz Sub-Millimeter Radar Arc 2 (Mid Wave) */}
        <path
          d="M24 27 C26.5 24 37.5 24 40 27"
          stroke="#ffffff"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeOpacity="0.9"
        />

        {/* Architectural Sanctuary Haven Arch (Roof + Citadel) */}
        <path
          d="M32 14 L45 25 L41.5 25 L41.5 41 L22.5 41 L22.5 25 L19 25 Z"
          fill="none"
          stroke="url(#shGoldAccent)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Sovereign Core: Central Guardian Diamond & Pulse Beacon */}
        <polygon
          points="32,24 37,30.5 32,37 27,30.5"
          fill="url(#shGoldAccent)"
        />

        {/* Center Sub-mm Core Spot */}
        <circle cx="32" cy="30.5" r="2" fill="#ffffff" />

        {/* Base Foundation Bar */}
        <line
          x1="20"
          y1="45"
          x2="44"
          y2="45"
          stroke="url(#shCrimsonRim)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Sovereign Data Moat Keyhole Notch */}
        <path
          d="M32 42.5 L32 46.5"
          stroke="#ffd88d"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>

      {/* Optional Integrated Wordmark */}
      {showWordmark && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1 leading-none">
            <span
              className={`font-sans text-[15px] font-extrabold tracking-tight ${
                variant === 'light' ? 'text-white' : 'text-[#060810]'
              }`}
            >
              SafeHaven
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#b81c37]" />
          </div>
          <span
            className={`font-sans text-[9px] font-semibold tracking-wider uppercase mt-0.5 ${
              variant === 'light' ? 'text-[#dedad2]' : 'text-[#76777c]'
            }`}
          >
            Institutional Security
          </span>
        </div>
      )}
    </div>
  );
};
