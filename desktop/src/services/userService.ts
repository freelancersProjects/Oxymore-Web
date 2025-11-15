import apiService from "../api/apiService";

export const userService = {
  toggleTeamChatMute: async (userId: string, isMuted: boolean) => {
    try {
      const response = await apiService.patch(
        `/users/${userId}/team-chat-mute`,
        {
          team_chat_is_muted: isMuted,
        }
      );
      return response;
    } catch (error) {
      console.error("Error toggling team chat mute:", error);
      throw error;
    }
  },
};
