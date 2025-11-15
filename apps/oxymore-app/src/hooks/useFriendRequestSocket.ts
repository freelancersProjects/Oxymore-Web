import { useEffect } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';

interface FriendRequest {
  id_friend: string;
  id_user_sender: string;
  id_user_receiver: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface UseFriendRequestSocketOptions {
  onFriendRequestReceived?: (friendRequest: FriendRequest) => void;
  onFriendRequestAccepted?: (friendData: FriendRequest) => void;
  onFriendRequestRejected?: (data: { id_friend: string }) => void;
}

export const useFriendRequestSocket = ({
  onFriendRequestReceived,
  onFriendRequestAccepted,
  onFriendRequestRejected
}: UseFriendRequestSocketOptions = {}) => {
  const { socket, isConnected } = useWebSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.emit('subscribe_friend_requests');

    const handleFriendRequestReceived = (friendRequest: FriendRequest) => {
      if (onFriendRequestReceived) {
        onFriendRequestReceived(friendRequest);
      }
    };

    const handleFriendRequestAccepted = (friendData: FriendRequest) => {
      if (onFriendRequestAccepted) {
        onFriendRequestAccepted(friendData);
      }
    };

    const handleFriendRequestRejected = (data: { id_friend: string }) => {
      if (onFriendRequestRejected) {
        onFriendRequestRejected(data);
      }
    };

    socket.on('friend_request_received', handleFriendRequestReceived);
    socket.on('friend_request_accepted', handleFriendRequestAccepted);
    socket.on('friend_request_rejected', handleFriendRequestRejected);

    return () => {
      socket.emit('unsubscribe_friend_requests');
      socket.off('friend_request_received', handleFriendRequestReceived);
      socket.off('friend_request_accepted', handleFriendRequestAccepted);
      socket.off('friend_request_rejected', handleFriendRequestRejected);
    };
  }, [socket, isConnected, onFriendRequestReceived, onFriendRequestAccepted, onFriendRequestRejected]);
};



