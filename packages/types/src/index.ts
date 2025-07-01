export interface Message {
  id: number;
  author: string;
  text: string;
  time: string;
  side: "left" | "right";
  avatar: string;
  channel_id?: string;
  user_id?: string;
  is_from_ai?: boolean;
}
