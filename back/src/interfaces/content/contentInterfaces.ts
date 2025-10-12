import { RowDataPacket } from 'mysql2';

export interface FirstPagePromotionVideo extends RowDataPacket {
  first_page_promotion_video: string;
  video_url: string;
  title: string;
  by_user: string;
}

export interface FirstPagePromotionVideoInput {
  video_url: string;
  title: string;
  by_user: string;
}

export interface FirstPagePromotionVideoData {
  first_page_promotion_video: string;
  video_url: string;
  title: string;
  by_user: string;
}
