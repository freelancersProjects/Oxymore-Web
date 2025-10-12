import { RowDataPacket } from 'mysql2';

export interface VideoComment extends RowDataPacket {
  id_video_comment: string;
  comment_text: string;
  posted_at?: string;
  id_user: string;
  id_video: string;
}

export interface VideoCommentInput {
  comment_text: string;
  posted_at?: string;
  id_user: string;
  id_video: string;
}

export interface VideoLike extends RowDataPacket {
  id_video_like: string;
  liked_at?: string;
  id_user: string;
  id_video: string;
}

export interface VideoLikeInput {
  liked_at?: string;
  id_user: string;
  id_video: string;
}

export interface UserVideo extends RowDataPacket {
  id_video: string;
  video_url: string;
  description?: string;
  posted_at?: string;
  likes_count?: number;
  shares_count?: number;
  comments_count?: number;
  is_downloadable?: boolean;
  id_user: string;
}

export interface UserVideoInput {
  video_url: string;
  description?: string;
  posted_at?: string;
  likes_count?: number;
  shares_count?: number;
  comments_count?: number;
  is_downloadable?: boolean;
  id_user: string;
}

export interface UserVideoData {
  id_video: string;
  video_url: string;
  description?: string;
  posted_at?: string;
  likes_count?: number;
  shares_count?: number;
  comments_count?: number;
  is_downloadable?: boolean;
  id_user: string;
}

export interface VideoCommentData {
  id_video_comment: string;
  comment_text: string;
  posted_at?: string;
  id_user: string;
  id_video: string;
}

export interface VideoLikeData {
  id_video_like: string;
  liked_at?: string;
  id_user: string;
  id_video: string;
}
