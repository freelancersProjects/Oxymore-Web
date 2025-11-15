import React from 'react';
import { avatarService } from '../../services/avatarService';

const AVATAR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
];

interface AvatarProps {
  username?: string | null;
  avatarUrl?: string | null;
  size?: number;
  className?: string;
  fallbackName?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  username, 
  avatarUrl, 
  size = 48, 
  className = '',
  fallbackName = 'User' 
}) => {
  const name = username || fallbackName;
  const initial = name.charAt(0).toUpperCase();
  const colorIndex = name.charCodeAt(0) % AVATAR_COLORS.length;
  const backgroundColor = AVATAR_COLORS[colorIndex];
  const [imgError, setImgError] = React.useState(false);

  if (avatarUrl && !imgError) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={className}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: size * 0.4,
        fontWeight: 'bold',
        fontFamily: 'Orbitron, sans-serif'
      }}
    >
      {initial}
    </div>
  );
};

export default Avatar;



