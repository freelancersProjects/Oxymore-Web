import { Request, Response } from "express";
import { cloudinaryService } from "../../services/cloudinary/cloudinaryService";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const { image, folder, type, oldPublicId } = req.body;

    if (!image) {
      res.status(400).json({ message: "Image is required" });
      return;
    }

    if (oldPublicId) {
      try {
        await cloudinaryService.delete(oldPublicId, 'image');
      } catch (deleteError) {
        console.error("Error deleting old image:", deleteError);
      }
    }

    const folderPath = folder || (type === 'avatar' ? 'oxymore/avatars' : type === 'banner' ? 'oxymore/banners' : 'oxymore');

    const result = await cloudinaryService.uploadFromBase64(image, {
      folder: folderPath,
      resource_type: 'image',
    });

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    res.status(500).json({ message: "Server error" });
  }
};

