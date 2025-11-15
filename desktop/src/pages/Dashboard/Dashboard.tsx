import React, { useRef, useState } from "react";
import News from "./News/News";
import UpcomingTournaments, { type UpcomingTournamentsRef } from "./UpcomingTournaments/UpcomingTournaments";
import Leaderboard from "./Leaderboard/Leaderboard";
import CommunityHighlights from "./CommunityHighlights/CommunityHighlights";
import { Plus } from "lucide-react";
import "./Dashboard.scss";

export const Dashboard = () => {
  const tournamentsRef = useRef<UpcomingTournamentsRef>(null);
  const [hasMoreTournaments, setHasMoreTournaments] = useState(false);

  const handleExpandClick = () => {
    if (tournamentsRef.current) {
      const hasMore = tournamentsRef.current.hasMore();
      if (hasMore) {
        tournamentsRef.current.loadMore();
      }
    }
  };

  return (
    <div className="container-dashboarda-app">
      <div className="news-section">
        <News />
      </div>
      <div className="tournaments-section">
        <UpcomingTournaments ref={tournamentsRef} onHasMoreChange={setHasMoreTournaments} />
      </div>
      {hasMoreTournaments && (
        <div className="dashboard-separator">
          <div className="separator-line"></div>
          <button className="expand-button" onClick={handleExpandClick}>
            <Plus className="expand-icon" size={28} />
          </button>
          <div className="separator-line"></div>
        </div>
      )}
      <div className="dashboard-bottom-section">
        <Leaderboard />
        <CommunityHighlights />
      </div>
    </div>
  );
};
