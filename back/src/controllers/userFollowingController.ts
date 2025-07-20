import { Request, Response } from "express";
import * as UserFollowingService from "../services/userFollowingService";

export const getAllUserFollowings = async (req: Request, res: Response) => {
  const followings = await UserFollowingService.getAllUserFollowings();
  res.json(followings);
};

export const createUserFollowing = async (req: Request, res: Response) => {
  const { followed_at, id_follower, id_followed } = req.body;
  if (!id_follower || !id_followed) {
    res.status(400).json({ message: "id_follower et id_followed sont requis" });
    return;
  }
  const newFollowing = await UserFollowingService.createUserFollowing({
    followed_at,
    id_follower,
    id_followed
  });
  res.status(201).json(newFollowing);
};

export const deleteUserFollowing = async (req: Request, res: Response) => {
  await UserFollowingService.deleteUserFollowing(req.params.id);
  res.status(204).send();
};
