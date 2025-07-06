import React, { useEffect, useState } from "react";
import "./FriendsStatTooltip.scss";

interface Friend {
  id: number;
  name: string;
  level: number;
  league: string;
  leagueColor: string;
  status: "online" | "offline" | "in-game";
}

interface Props {
  friends: Friend[];
  label: string;
  visible: boolean;
  anchorRef: React.RefObject<HTMLElement | null>;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const FriendsStatTooltip: React.FC<Props> = ({
  friends,
  label,
  visible,
  anchorRef,
  getStatusColor,
  getStatusText,
}) => {
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    if (visible && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY - 140,
        left: rect.left + rect.width / 2,
      });
    }
  }, [visible, anchorRef]);

  if (!visible || friends.length === 0) return null;

  return (
    <div
      className="stat-tooltip"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="stat-tooltip-content">
        <div className="stat-tooltip-title">
          {label} ({friends.length})
        </div>
        <table className="stat-tooltip-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Lvl</th>
              <th>League</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {friends.map((f) => (
              <tr key={f.id}>
                <td>{f.name}</td>
                <td>{f.level}</td>
                <td>
                  <span
                    className="league-badge-mini"
                    style={{ borderColor: f.leagueColor }}
                  >
                    {f.league}
                  </span>
                </td>
                <td>
                  <span
                    className="status-dot"
                    style={{ backgroundColor: getStatusColor(f.status) }}
                  />
                  {getStatusText(f.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="stat-tooltip-arrow" />
    </div>
  );
};

export default FriendsStatTooltip;
