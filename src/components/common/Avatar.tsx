import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 'md', 
  className = '',
  status
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const statusColors = {
    online: 'bg-success-500',
    offline: 'bg-gray-400',
    away: 'bg-warning-500',
    busy: 'bg-error-500',
  };

  return (
    <div className={`avatar relative ${className}`}>
      <img 
        src={src} 
        alt={alt} 
        className={`${sizeClasses[size]} object-cover rounded-full`}
      />
      {status && (
        <span className={`absolute bottom-0 right-0 block rounded-full ${statusColors[status]} ring-2 ring-white w-2.5 h-2.5`}></span>
      )}
    </div>
  );
};

export default Avatar;