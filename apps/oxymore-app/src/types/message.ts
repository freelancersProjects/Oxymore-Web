export interface Message {
  id: string;
  sender: string;
  senderAvatar: string;
  timestamp: string;
  text: string;
  isFromMe: boolean;
  isAdmin?: boolean;
}

