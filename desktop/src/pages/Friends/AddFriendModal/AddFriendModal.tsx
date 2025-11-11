import { useState, useRef, useCallback, useEffect } from "react";
import { OXMModal } from "@oxymore/ui";
import {
  Close as CloseIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  Person as PersonIcon
} from "@mui/icons-material";
import { friendService } from "../../../services/friendService";
import type { UserSearchResult } from "../../../types/friend";
import "./AddFriendModal.scss";

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onAddFriend: (userId: string) => Promise<void>;
}

const AddFriendModal = ({ isOpen, onClose, userId, onAddFriend }: AddFriendModalProps) => {
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSearchUsers = useCallback(async (query: string) => {
    if (!query.trim() || !userId) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await friendService.searchUsers(userId, query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [userId]);

  const handleClose = () => {
    setUserSearchQuery("");
    setSearchResults([]);
    onClose();
  };

  return (
    <OXMModal
      isOpen={isOpen}
      onClose={handleClose}
      variant="default"
    >
      <div className="add-friend-modal-header">
        <div>
          <h2 className="add-friend-modal-title">Find New Friends</h2>
          <p className="add-friend-modal-subtitle">Search and connect with players around the world</p>
        </div>
        <button className="add-friend-modal-close" onClick={handleClose}>
          <CloseIcon />
        </button>
      </div>
      <div className="add-friend-modal">
        <div className="search-section">
          <div className="search-input-wrapper">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search for players..."
              value={userSearchQuery}
              onChange={(e) => {
                const value = e.target.value;
                setUserSearchQuery(value);

                if (searchTimeoutRef.current) {
                  clearTimeout(searchTimeoutRef.current);
                }

                if (value.trim()) {
                  searchTimeoutRef.current = setTimeout(() => {
                    handleSearchUsers(value);
                  }, 300);
                } else {
                  setSearchResults([]);
                }
              }}
              className="user-search-input"
            />
            {userSearchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => {
                  setUserSearchQuery("");
                  setSearchResults([]);
                }}
              >
                <ClearIcon />
              </button>
            )}
          </div>
        </div>

        <div className="search-results">
          {isSearching && (
            <div className="loading-results">
              <p>Searching...</p>
            </div>
          )}

          {!isSearching && searchResults.length > 0 && (
            <div className="results-list">
              {searchResults.map((user) => (
                <div key={user.id_user} className="user-result-item">
                  <div className="user-info">
                    <PersonIcon className="user-avatar" />
                    <div className="user-details">
                      <h4 className="user-name">{user.username}</h4>
                    </div>
                  </div>
                  <div className="user-actions">
                    {user.friend_status === 'pending' ? (
                      <span className="status-badge pending">Request Sent</span>
                    ) : user.friend_status === 'accepted' ? (
                      <span className="status-badge accepted">Already Friends</span>
                    ) : (
                      <button
                        className="add-friend-btn"
                        onClick={() => onAddFriend(user.id_user)}
                      >
                        <AddIcon />
                        Add Friend
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isSearching && userSearchQuery && searchResults.length === 0 && !userId && (
            <div className="no-results">
              <p>Please log in to search for users</p>
            </div>
          )}

          {!isSearching && userSearchQuery && searchResults.length === 0 && userId && (
            <div className="no-results">
              <p>No users found matching "{userSearchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </OXMModal>
  );
};

export default AddFriendModal;

