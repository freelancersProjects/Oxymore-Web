import { Request, Response } from "express";
import * as FavoriteFriendService from "../../services/user/favoriteFriendService";

export const getAllFavoriteFriends = async (req: Request, res: Response): Promise<void> => {
  try {
    const favorites = await FavoriteFriendService.getAllFavoriteFriends();
    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFavoriteFriendsByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const favorites = await FavoriteFriendService.getFavoriteFriendsByUserId(userId);
    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFavoriteFriendById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const favorite = await FavoriteFriendService.getFavoriteFriendById(id);

    if (!favorite) {
      res.status(404).json({ error: "Favorite friend not found" });
      return;
    }

    res.json(favorite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createFavoriteFriend = async (req: Request, res: Response): Promise<void> => {
  try {
    const favoriteData = req.body;
    const favorite = await FavoriteFriendService.createFavoriteFriend(favoriteData);
    res.status(201).json(favorite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteFavoriteFriend = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await FavoriteFriendService.deleteFavoriteFriend(id);

    if (!deleted) {
      res.status(404).json({ error: "Favorite friend not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const toggleFavoriteFriend = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, friendId } = req.params;
    const result = await FavoriteFriendService.toggleFavoriteFriend(userId, friendId);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


