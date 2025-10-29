import React from "react";
import type { Team } from "../../../../types/team";
import "./TeamMatchHistory.scss";

interface TeamMatchHistoryProps {
  teamId: string;
  teamData: Team | null;
}

const TeamMatchHistory: React.FC<TeamMatchHistoryProps> = ({ teamId, teamData }) => {
  return (
    <div className="team-match-history-page">
      <h2>Matchs précédents</h2>
      <p>Liste des matchs effectués avec les statistiques détaillées</p>
    </div>
  );
};

export default TeamMatchHistory;


