import { useState, useRef, useCallback, useEffect } from "react";
import { OXMModal, OXMButton } from "@oxymore/ui";
import { X, Search, UserPlus } from "lucide-react";
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
      <div className="add-friend-modal">
        <div className="add-friend-modal-header">
          <div className="modal-header-content">
            <div className="modal-icon-wrapper">
              <UserPlus size={24} />
            </div>
            <h2 className="add-friend-modal-title">Ajouter un ami</h2>
          </div>
          <button className="close-button" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="add-friend-modal-content">
          <p className="add-friend-modal-subtitle">
            Recherchez et connectez-vous avec des joueurs du monde entier
          </p>
          
          <div className="search-section">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Rechercher des joueurs..."
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
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="search-results">
            {isSearching && (
              <div className="loading-results">
                <p>Recherche en cours...</p>
              </div>
            )}

            {!isSearching && searchResults.length > 0 && (
              <div className="results-list">
                {searchResults.map((user) => (
                  <div key={user.id_user} className="user-result-item">
                    <div className="user-info">
                      <div className="user-avatar">
                        <UserPlus size={20} />
                      </div>
                      <div className="user-details">
                        <h4 className="user-name">{user.username}</h4>
                      </div>
                    </div>
                    <div className="user-actions">
                      {user.friend_status === 'pending' ? (
                        <span className="status-badge pending">Demande envoyée</span>
                      ) : user.friend_status === 'accepted' ? (
                        <span className="status-badge accepted">Déjà amis</span>
                      ) : (
                        <OXMButton
                          variant="primary"
                          size="small"
                          onClick={() => onAddFriend(user.id_user)}
                        >
                          <UserPlus size={16} />
                          Ajouter
                        </OXMButton>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isSearching && userSearchQuery && searchResults.length === 0 && !userId && (
              <div className="no-results">
                <p>Veuillez vous connecter pour rechercher des utilisateurs</p>
              </div>
            )}

            {!isSearching && userSearchQuery && searchResults.length === 0 && userId && (
              <div className="no-results">
                <p>Aucun utilisateur trouvé pour "{userSearchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </OXMModal>
  );
};

export default AddFriendModal;


