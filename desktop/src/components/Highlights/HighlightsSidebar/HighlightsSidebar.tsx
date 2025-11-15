import React, { useState, useEffect } from 'react';
import { Upload, UserPlus, MoreHorizontal } from 'lucide-react';
import { OXMButton } from '@oxymore/ui';
import type { UserSuggestion } from '../../../types/video';
import './HighlightsSidebar.scss';

interface HighlightsSidebarProps {
  currentUser?: {
    id_user: string;
    username: string;
    avatar_url?: string;
  };
  suggestions?: UserSuggestion[];
  onUpload?: () => void;
  onFollow?: (userId: string) => void;
}

const HighlightsSidebar: React.FC<HighlightsSidebarProps> = ({
  currentUser,
  suggestions = [],
  onUpload,
  onFollow,
}) => {
  const [following, setFollowing] = useState<Set<string>>(new Set());

  const handleFollow = (userId: string) => {
    setFollowing((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
    if (onFollow) {
      onFollow(userId);
    }
  };

  return (
    <div className="highlights-sidebar">
      {onUpload && (
        <OXMButton
          variant="primary"
          onClick={onUpload}
          className="highlights-sidebar__upload-btn"
        >
          <Upload size={20} />
          Upload Highlights
        </OXMButton>
      )}

      {currentUser && (
        <div className="highlights-sidebar__user">
          <div className="highlights-sidebar__user-avatar">
            {currentUser.avatar_url ? (
              <img
                src={currentUser.avatar_url}
                alt={currentUser.username}
              />
            ) : (
              <div
                className="highlights-sidebar__user-placeholder"
                style={{
                  background: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'][
                    currentUser.username.charCodeAt(0) % 5
                  ],
                }}
              >
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="highlights-sidebar__user-info">
            <div className="highlights-sidebar__username">{currentUser.username}</div>
            <button className="highlights-sidebar__switch-btn">Switch</button>
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="highlights-sidebar__suggestions">
          <h3 className="highlights-sidebar__section-title">Suggestions for you</h3>
          <div className="highlights-sidebar__suggestions-list">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id_user} className="highlights-sidebar__suggestion">
                <div className="highlights-sidebar__suggestion-avatar">
                  {suggestion.avatar_url ? (
                    <img
                      src={suggestion.avatar_url}
                      alt={suggestion.username}
                    />
                  ) : (
                    <div
                      className="highlights-sidebar__suggestion-placeholder"
                      style={{
                        background: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'][
                          suggestion.username.charCodeAt(0) % 5
                        ],
                      }}
                    >
                      {suggestion.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="highlights-sidebar__suggestion-info">
                  <div className="highlights-sidebar__suggestion-username">
                    {suggestion.username}
                  </div>
                  {suggestion.follows_you && (
                    <div className="highlights-sidebar__suggestion-label">Follows you</div>
                  )}
                </div>
                <button
                  className={`highlights-sidebar__follow-btn ${
                    following.has(suggestion.id_user) ? 'following' : ''
                  }`}
                  onClick={() => handleFollow(suggestion.id_user)}
                >
                  {following.has(suggestion.id_user) ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
          <button className="highlights-sidebar__see-all">See All</button>
        </div>
      )}

      <div className="highlights-sidebar__footer">
        <div className="highlights-sidebar__links">
          <a href="/about">About</a>
          <a href="/help">Help</a>
          <a href="/press">Press</a>
          <a href="/api">API</a>
          <a href="/language">Language</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/locations">Locations</a>
        </div>
        <div className="highlights-sidebar__copyright">
          © {new Date().getFullYear()} OXYMORE
        </div>
      </div>
    </div>
  );
};

export default HighlightsSidebar;

