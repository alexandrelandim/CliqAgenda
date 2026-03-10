import { User } from 'lucide-react';

interface UserAvatarProps {
  name?: string;
  photoUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export function UserAvatar({ 
  name = '', 
  photoUrl, 
  size = 'md', 
  className = '',
  onClick 
}: UserAvatarProps) {
  const getInitials = (fullName: string) => {
    if (!fullName) return '?';
    
    const names = fullName.trim().split(' ').filter(n => n.length > 0);
    
    if (names.length === 0) return '?';
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    
    // First letter of first name + first letter of last name
    const firstInitial = names[0].charAt(0).toUpperCase();
    const lastInitial = names[names.length - 1].charAt(0).toUpperCase();
    
    return `${firstInitial}${lastInitial}`;
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };

  const initials = getInitials(name);

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-purple-100 flex items-center justify-center font-semibold text-purple-700 overflow-hidden ${
        onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
      } ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
