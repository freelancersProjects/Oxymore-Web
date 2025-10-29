export const avatarService = {
  getAvatarUrl: (username?: string | null, avatarUrl?: string | null, fallbackName: string = 'User'): string => {
    if (avatarUrl) {
      return avatarUrl;
    }

    const name = username || fallbackName;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  }
};


