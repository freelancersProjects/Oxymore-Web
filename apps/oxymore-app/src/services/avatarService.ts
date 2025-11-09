export const avatarService = {
  getAvatarUrl: (username?: string | null, avatarUrl?: string | null, fallbackName: string = 'User'): string => {
    if (avatarUrl) {
      return avatarUrl;
    }

    const name = username || fallbackName;
    
    if (name === 'Admin') {
      return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=ef4444&textColor=ffffff&size=128`;
    }
    
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&size=128`;
  }
};


