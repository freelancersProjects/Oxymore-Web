export const avatarService = {
  getAvatarUrl: (username?: string | null, avatarUrl?: string | null, fallbackName: string = 'User'): string => {
    if (avatarUrl) {
      return avatarUrl;
    }
    return '';
  }
};


