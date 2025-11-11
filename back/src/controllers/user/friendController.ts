import { Request, Response } from "express";
import * as FriendService from "../../services/user/friendService";

export const getAllFriends = async (req: Request, res: Response) => {
  try {
    const friends = await FriendService.getAllFriends();
    res.json(friends);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFriendsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const friends = await FriendService.getFriendsByUserId(userId);
    res.json(friends);
  } catch (error: any) {
    console.error('Error getting friends by user id:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPendingFriendRequests = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const requests = await FriendService.getPendingFriendRequests(userId);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSentFriendRequests = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const requests = await FriendService.getSentFriendRequests(userId);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFriendById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const friend = await FriendService.getFriendById(id);

    if (!friend) {
      res.status(404).json({ error: "Friend not found" });
      return;
    }

    res.json(friend);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createFriend = async (req: Request, res: Response) => {
  try {
    const friendData = req.body;
    const friend = await FriendService.createFriend(friendData);
    res.status(201).json(friend);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateFriend = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const friend = await FriendService.updateFriend(id, updateData);

    if (!friend) {
      res.status(404).json({ error: "Friend not found" });
      return;
    }

    res.json(friend);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteFriend = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await FriendService.deleteFriend(id);

    if (!deleted) {
      res.status(404).json({ error: "Friend not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const acceptFriendRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const friend = await FriendService.acceptFriendRequest(id);

    if (!friend) {
      res.status(404).json({ error: "Friend request not found" });
      return;
    }

    res.json(friend);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const rejectFriendRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const friend = await FriendService.rejectFriendRequest(id);

    if (!friend) {
      res.status(404).json({ error: "Friend request not found" });
      return;
    }

    res.json(friend);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const cancelFriendRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await FriendService.cancelFriendRequest(id);

    if (!deleted) {
      res.status(404).json({ error: "Friend request not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const blockUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const friend = await FriendService.blockUser(id);

    if (!friend) {
      res.status(404).json({ error: "Friend not found" });
      return;
    }

    res.json(friend);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


export const searchUsersForFriends = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      res.status(400).json({ error: "Search query is required" });
      return;
    }

    const users = await FriendService.searchUsersForFriends(userId, q);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateFriendDisplayName = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, friendId } = req.params;
    const { display_name } = req.body;

    if (!display_name || typeof display_name !== 'string' || display_name.trim().length === 0) {
      res.status(400).json({ error: "display_name is required and must be a non-empty string" });
      return;
    }

    const result = await FriendService.updateFriendDisplayName(userId, friendId, display_name.trim());
    res.json(result);
  } catch (error: any) {
    console.error('Error updating friend display name:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteFriendDisplayName = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, friendId } = req.params;
    const deleted = await FriendService.deleteFriendDisplayName(userId, friendId);

    if (!deleted) {
      res.status(404).json({ error: "Display name not found" });
      return;
    }

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting friend display name:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};