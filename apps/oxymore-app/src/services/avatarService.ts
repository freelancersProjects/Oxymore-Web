export const avatarService = {
  getAvatarUrl: (username?: string | null, avatarUrl?: string | null, fallbackName: string = 'User'): string => {
    if (avatarUrl) {
      return avatarUrl;
    }

    const name = username || fallbackName;
    // For Admin, use red background, otherwise random
    if (name === 'Admin') {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ef4444&color=fff&size=128`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  }
};


