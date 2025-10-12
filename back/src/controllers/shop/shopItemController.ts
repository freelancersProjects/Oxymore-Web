import { Request, Response } from "express";
import * as ShopItemService from "../../services/shop/shopItemService";

export const getAllShopItems = async (req: Request, res: Response) => {
  const items = await ShopItemService.getAllShopItems();
  res.json(items);
};

export const createShopItem = async (req: Request, res: Response) => {
  const { item_name, image_url, price_eur, percentage_premium, external_url } = req.body;
  if (!item_name || price_eur === undefined) {
    res.status(400).json({ message: "item_name et price_eur sont requis" });
    return;
  }
  const newItem = await ShopItemService.createShopItem({
    item_name,
    image_url,
    price_eur,
    percentage_premium,
    external_url
  });
  res.status(201).json(newItem);
};

export const deleteShopItem = async (req: Request, res: Response) => {
  await ShopItemService.deleteShopItem(req.params.id);
  res.status(204).send();
};
