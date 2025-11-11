import { useState } from "react";
import { OXMTabSwitcher, type Tab } from "@oxymore/ui";
import {
  Close as CloseIcon,
  Search as SearchIcon,
  ViewList as ListIcon,
  ViewModule as CardIcon
} from "@mui/icons-material";
import "./FriendsFilters.scss";

interface FriendsFiltersProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  viewMode: "card" | "list";
  onViewModeChange: (mode: "card" | "list") => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

const FriendsFilters = ({
  activeTab,
  onTabChange,
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchQueryChange
}: FriendsFiltersProps) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchAnimation, setSearchAnimation] = useState(false);

  const tabs = [
    { value: "all", label: "All Friends" },
    { value: "online", label: "Online" },
    { value: "favorites", label: "Favorites" },
    { value: "pending", label: "Pending" },
    { value: "sent", label: "Sent" },
  ];

  const handleToggleSearch = () => {
    setShowSearch(!showSearch);
    setSearchAnimation(true);
    setTimeout(() => setSearchAnimation(false), 300);
  };

  return (
    <div className="friends-tabs-search">
      <div className="tabs-container">
        <OXMTabSwitcher
          tabs={tabs.map(tab => ({ label: tab.label, value: tab.value })) as Tab[]}
          value={activeTab}
          onChange={onTabChange}
        />
        <div className="view-controls">
          <button
            className={`view-toggle-btn ${viewMode === "card" ? "active" : ""}`}
            onClick={() => onViewModeChange("card")}
            title="Card View"
          >
            <CardIcon />
          </button>
          <button
            className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => onViewModeChange("list")}
            title="List View"
          >
            <ListIcon />
          </button>
          <button
            className={`search-toggle-btn ${searchAnimation ? "anim" : ""}`}
            onClick={handleToggleSearch}
            title="Search Friends"
          >
            <SearchIcon className="custom-search-icon" />
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="search-bar-inline">
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="search-input"
            autoFocus
          />
          <button
            className="search-close-btn"
            onClick={() => {
              setShowSearch(false);
              onSearchQueryChange("");
            }}
          >
            <CloseIcon />
          </button>
        </div>
      )}
    </div>
  );
};

export default FriendsFilters;


