import React from 'react';

export function HouseIllustration({ className = 'w-32 h-24 sm:w-40 sm:h-28' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background Soft Sky Cloud */}
      <ellipse cx="140" cy="40" rx="36" ry="18" fill="#dcfce7" fillOpacity="0.7" />
      <ellipse cx="165" cy="45" rx="24" ry="14" fill="#dcfce7" fillOpacity="0.7" />

      {/* Lawn Base */}
      <ellipse cx="140" cy="126" rx="55" ry="12" fill="#86efac" />
      <ellipse cx="135" cy="128" rx="60" ry="10" fill="#4ade80" />

      {/* Background Tree Left */}
      <circle cx="95" cy="98" r="14" fill="#22c55e" />
      <circle cx="90" cy="104" r="11" fill="#16a34a" />
      <rect x="93" y="108" width="4" height="18" rx="1.5" fill="#a16207" />

      {/* Background Tree Right */}
      <circle cx="180" cy="95" r="16" fill="#22c55e" />
      <circle cx="186" cy="100" r="12" fill="#16a34a" />
      <rect x="178" y="106" width="4" height="20" rx="1.5" fill="#a16207" />

      {/* House Main Body */}
      <rect x="106" y="68" width="66" height="52" rx="3" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />

      {/* House Wing / Front Extension */}
      <rect x="98" y="80" width="30" height="40" rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />

      {/* Main Roof (Gable Pitch) - Emerald Green */}
      <path
        d="M98 68L139 36L180 68Z"
        fill="#15803d"
      />
      <path
        d="M139 36L180 68H174L139 40L104 68H98L139 36Z"
        fill="#166534"
      />

      {/* Small Chimney */}
      <rect x="156" y="44" width="8" height="16" rx="1" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="154" y="42" width="12" height="3" rx="1" fill="#94a3b8" />

      {/* Wing Roof */}
      <path
        d="M94 80L113 62L132 80Z"
        fill="#16a34a"
      />

      {/* Windows - Main Floor Right */}
      <rect x="144" y="76" width="16" height="16" rx="2" fill="#bae6fd" stroke="#0284c7" strokeWidth="1" />
      <line x1="152" y1="76" x2="152" y2="92" stroke="#0284c7" strokeWidth="1" />
      <line x1="144" y1="84" x2="160" y2="84" stroke="#0284c7" strokeWidth="1" />

      {/* Windows - Main Floor Lower */}
      <rect x="144" y="98" width="16" height="14" rx="2" fill="#bae6fd" stroke="#0284c7" strokeWidth="1" />
      <line x1="152" y1="98" x2="152" y2="112" stroke="#0284c7" strokeWidth="1" />
      <line x1="144" y1="105" x2="160" y2="105" stroke="#0284c7" strokeWidth="1" />

      {/* Front Door */}
      <rect x="107" y="92" width="12" height="28" rx="2" fill="#15803d" />
      <circle cx="116" cy="107" r="1.5" fill="#fef08a" />
      <rect x="105" y="119" width="16" height="3" rx="1" fill="#94a3b8" />

      {/* Attic Window Wing */}
      <circle cx="113" cy="73" r="4.5" fill="#bae6fd" stroke="#0284c7" strokeWidth="0.8" />
      <line x1="113" y1="68.5" x2="113" y2="77.5" stroke="#0284c7" strokeWidth="0.8" />
      <line x1="108.5" y1="73" x2="117.5" y2="73" stroke="#0284c7" strokeWidth="0.8" />

      {/* Bush Front Left */}
      <circle cx="102" cy="121" r="7" fill="#22c55e" />
      <circle cx="96" cy="123" r="5" fill="#16a34a" />

      {/* Bush Front Right */}
      <circle cx="170" cy="120" r="8" fill="#22c55e" />
      <circle cx="175" cy="122" r="6" fill="#15803d" />
    </svg>
  );
}
