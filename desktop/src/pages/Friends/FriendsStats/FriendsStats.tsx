import "./FriendsStats.scss";

interface FriendsStatsProps {
  onlineCount: number;
  inGameCount: number;
  favoritesCount: number;
}

const FriendsStats = ({ onlineCount, inGameCount, favoritesCount }: FriendsStatsProps) => {
  return (
    <div className="friends-stats">
      <div className="stat-card">
        <div className="stat-number">{onlineCount}</div>
        <div className="stat-label">Online</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{inGameCount}</div>
        <div className="stat-label">In Game</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{favoritesCount}</div>
        <div className="stat-label">Favorites</div>
      </div>
    </div>
  );
};

export default FriendsStats;

