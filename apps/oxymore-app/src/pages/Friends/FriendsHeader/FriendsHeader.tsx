import { OXMButton } from "@oxymore/ui";
import { Add as AddIcon } from "@mui/icons-material";
import "./FriendsHeader.scss";

interface FriendsHeaderProps {
  onAddFriendClick: () => void;
}

const FriendsHeader = ({ onAddFriendClick }: FriendsHeaderProps) => {
  return (
    <div className="friends-header">
      <div className="header-content">
        <h1 className="friends-title white">Friends</h1>
        <p className="friends-subtitle">Connect with your gaming squad</p>
      </div>

      <div className="header-actions">
        <OXMButton
          variant="primary"
          size="medium"
          onClick={onAddFriendClick}
        >
          <AddIcon />
          Add Friend
        </OXMButton>
      </div>
    </div>
  );
};

export default FriendsHeader;


