import { Request, Response } from "express";
import * as FriendService from "../../services/user/friendService";
import * as NotificationService from "../../services/notification/notificationService";
import { getIO } from "../../websocket/socketServer";
import { emitFriendRequest, emitFriendRequestAccepted, emitFriendRequestRejected } from "../../websocket/handlers/friendRequestHandler";
import { emitNotification } from "../../websocket/handlers/notificationHandler";
import { db } from "../../config/db";

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
  } catch (error) {
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
    
    if (!friendData.id_user_sender || !friendData.id_user_receiver) {
      res.status(400).json({ error: "Missing required fields: id_user_sender and id_user_receiver" });
      return;
    }
    
    const friend = await FriendService.createFriend(friendData);
    
    if (friendData.id_user_receiver && friendData.id_user_sender) {
      try {
        const io = getIO();
        emitFriendRequest(io, friendData.id_user_receiver, friend);
        emitFriendRequest(io, friendData.id_user_sender, friend);
        
        const [senderRows] = await db.query("SELECT username FROM user WHERE id_user = ?", [friendData.id_user_sender]);
        const sender = (senderRows as any[])[0];
        
        if (sender) {
          const notification = await NotificationService.createNotification({
            type: 'message',
            title: 'Nouvelle demande d\'ami',
            text: `${sender.username} vous a envoyé une demande d'ami`,
            id_user: friendData.id_user_receiver
          });
          
          emitNotification(io, friendData.id_user_receiver, notification);
        }
      } catch (wsError) {
      }
    }
    
    res.status(201).json(friend);
  } catch (error: any) {
    const statusCode = error?.message?.includes('already exists') ? 409 : 500;
    res.status(statusCode).json({ error: error?.message || "Internal server error" });
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

    try {
      const io = getIO();
      emitFriendRequestAccepted(io, friend.id_user_sender, friend);
      emitFriendRequestAccepted(io, friend.id_user_receiver, friend);
      
      const [receiverRows] = await db.query("SELECT username FROM user WHERE id_user = ?", [friend.id_user_receiver]);
      const receiver = (receiverRows as any[])[0];
      
      if (receiver) {
        const notification = await NotificationService.createNotification({
          type: 'success',
          title: 'Demande d\'ami acceptée',
          text: `${receiver.username} a accepté votre demande d'ami`,
          id_user: friend.id_user_sender
        });
        
        emitNotification(io, friend.id_user_sender, notification);
      }
    } catch (error) {
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

    try {
      const io = getIO();
      emitFriendRequestRejected(io, friend.id_user_sender, id);
      
      const [receiverRows] = await db.query("SELECT username FROM user WHERE id_user = ?", [friend.id_user_receiver]);
      const receiver = (receiverRows as any[])[0];
      
      if (receiver) {
        const notification = await NotificationService.createNotification({
          type: 'alert',
          title: 'Demande d\'ami refusée',
          text: `${receiver.username} a refusé votre demande d'ami`,
          id_user: friend.id_user_sender
        });
        
        emitNotification(io, friend.id_user_sender, notification);
      }
    } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};