import apiService from '../api/apiService';
import type { FriendWithUser, UserSearchResult } from '../types/friend';

export const friendService = {
  getAllFriends: async (userId: string): Promise<FriendWithUser[]> => {
    try {
      const friends = await apiService.get(`/friends/user/${userId}`);
      // S'assurer que is_favorite est un boolean strict
      return friends.map((friend: FriendWithUser) => {
        // Convertir is_favorite en boolean strict (gère 1, 0, true, false, "1", "0", etc.)
        let isFavorite = false;
        if (friend.is_favorite === true || friend.is_favorite === 1 || friend.is_favorite === '1' || friend.is_favorite === 'true') {
          isFavorite = true;
        } else if (friend.is_favorite === false || friend.is_favorite === 0 || friend.is_favorite === '0' || friend.is_favorite === 'false' || friend.is_favorite === null || friend.is_favorite === undefined) {
          isFavorite = false;
        }
        
        return {
          ...friend,
          is_favorite: isFavorite
        };
      });
    } catch (error) {
      return [];
    }
  },

  getPendingRequests: async (userId: string): Promise<FriendWithUser[]> => {
    try {
      const requests = await apiService.get(`/friends/pending/${userId}`);
      return requests;
    } catch (error) {
      return [];
    }
  },

  getSentRequests: async (userId: string): Promise<FriendWithUser[]> => {
    try {
      const requests = await apiService.get(`/friends/sent/${userId}`);
      return requests;
    } catch (error) {
      return [];
    }
  },

  searchUsers: async (userId: string, query: string): Promise<UserSearchResult[]> => {
    try {
      const results = await apiService.get(`/friends/search/${userId}?q=${encodeURIComponent(query)}`);
      return results;
    } catch (error) {
      return [];
    }
  },

  addFriend: async (id_user_sender: string, id_user_receiver: string): Promise<void> => {
    try {
      await apiService.post('/friends', {
        id_user_sender,
        id_user_receiver,
        status: 'pending'
      });
    } catch (error) {
      throw error;
    }
  },

  toggleFavorite: async (userId: string, friendId: string): Promise<{ is_favorite: boolean }> => {
    try {
      const result = await apiService.post(`/favorite-friends/${userId}/${friendId}/toggle`);
      return result;
    } catch (error) {
      throw error;
    }
  },

  deleteFriend: async (friendId: string): Promise<void> => {
    try {
      await apiService.delete(`/friends/${friendId}`);
    } catch (error) {
      throw error;
    }
  },

  acceptRequest: async (friendId: string): Promise<void> => {
    try {
      await apiService.put(`/friends/${friendId}/accept`);
    } catch (error) {
      throw error;
    }
  },

  rejectRequest: async (friendId: string): Promise<void> => {
    try {
      await apiService.put(`/friends/${friendId}/reject`);
    } catch (error) {
      throw error;
    }
  },

  cancelRequest: async (friendId: string): Promise<void> => {
    try {
      await apiService.delete(`/friends/${friendId}/cancel`);
    } catch (error) {
      throw error;
    }
  },

  updateDisplayName: async (userId: string, friendId: string, displayName: string): Promise<{ display_name: string }> => {
    try {
      const result = await apiService.put(`/friends/${userId}/${friendId}/display-name`, {
        display_name: displayName
      });
      return result;
    } catch (error) {
      throw error;
    }
  },

  deleteDisplayName: async (userId: string, friendId: string): Promise<void> => {
    try {
      await apiService.delete(`/friends/${userId}/${friendId}/display-name`);
    } catch (error) {
      throw error;
    }
  }
};

