interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'light' | 'dark';
}

export default function Logo({ className = '', showText = true, variant = 'light' }: LogoProps) {
  const textColor = variant === 'light' ? '#ffffff' : '#7c3aed';
  const iconColor1 = variant === 'light' ? '#ffffff' : '#7c3aed';
  const iconColor2 = variant === 'light' ? '#a78bfa' : '#a78bfa';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Icon */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Calendar background */}
        <rect
          x="4"
          y="6"
          width="24"
          height="22"
          rx="3"
          fill={iconColor1}
          fillOpacity="0.2"
        />
        <rect
          x="4"
          y="6"
          width="24"
          height="22"
          rx="3"
          stroke={iconColor1}
          strokeWidth="2"
        />
        
        {/* Calendar header */}
        <rect
          x="4"
          y="6"
          width="24"
          height="6"
          rx="3"
          fill={iconColor1}
        />
        
        {/* Calendar dots */}
        <circle cx="10" cy="16" r="1.5" fill={iconColor2} />
        <circle cx="16" cy="16" r="1.5" fill={iconColor2} />
        <circle cx="22" cy="16" r="1.5" fill={iconColor2} />
        <circle cx="10" cy="21" r="1.5" fill={iconColor2} />
        <circle cx="16" cy="21" r="1.5" fill={iconColor2} />
        
        {/* Click cursor/pointer */}
        <g transform="translate(18, 18)">
          <path
            d="M0 0 L0 10 L3 7 L5 11 L7 10 L5 6 L8 6 Z"
            fill={iconColor1}
            stroke={variant === 'light' ? '#7c3aed' : '#ffffff'}
            strokeWidth="0.5"
          />
        </g>
      </svg>

      {/* Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className="font-bold text-lg tracking-tight"
            style={{ color: textColor }}
          >
            Cliq<span className="font-extrabold">Agenda</span>
          </span>
        </div>
      )}
    </div>
  );
}
