import React from 'react';

interface StudentPGLogoProps {
  className?: string;
  showTagline?: boolean;
}

export function StudentPGLogo({
  className = 'h-9 sm:h-10',
  showTagline = true,
}: StudentPGLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {/* Precision Vector Icon matching Reference Design */}
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto shrink-0 drop-shadow-2xs"
        aria-hidden="true"
      >
        {/* House Outline - Left Roof & Left Wall (Navy Blue) */}
        <path
          d="M60 14L18 48C15 50.4 13 54 13 58V96C13 102.6 18.4 108 25 108H46V96H25V59.5L60 31.5"
          fill="#002E6E"
        />

        {/* House Outline - Chimney, Right Roof & Right Wall (Vibrant Green) */}
        <path
          d="M86 26V36L72 24.5L60 14L60 31.5L95 59.5V96H74V108H95C101.6 108 107 102.6 107 96V58C107 54 105 50.4 102 48L86 35V26C86 24 88 22 90 22H94C96 22 98 24 98 26V43.5L86 33.5V26Z"
          fill="#00A859"
        />
        {/* Chimney Body */}
        <rect x="88" y="22" width="10" height="18" rx="2" fill="#00A859" />

        {/* Student Mortarboard Cap (Navy Blue) */}
        <path
          d="M60 46L36 57L60 68L84 57L60 46Z"
          fill="#002E6E"
        />
        {/* Tassel */}
        <path
          d="M74 62.5V74M72.5 74H75.5"
          stroke="#002E6E"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Student Head (Green Circle) */}
        <circle cx="60" cy="74" r="10" fill="#00A859" />

        {/* Student Shoulders (Green Arc) */}
        <path
          d="M45 102C45 92.5 51.5 86 60 86C68.5 86 75 92.5 75 102V108H45V102Z"
          fill="#00A859"
        />
      </svg>

      {/* Brand Wordmark & Tagline */}
      <div className="flex flex-col justify-center select-none">
        <div className="flex items-baseline font-black tracking-[-0.03em] leading-none text-xl sm:text-[22px]">
          <span className="text-[#002E6E]">Student</span>
          <span className="text-[#00A859]">PG</span>
        </div>

        {showTagline && (
          <span className="text-[9px] sm:text-[10px] font-medium tracking-wide text-slate-500 mt-1 leading-none">
            Find Your Next Home
          </span>
        )}
      </div>
    </div>
  );
}
