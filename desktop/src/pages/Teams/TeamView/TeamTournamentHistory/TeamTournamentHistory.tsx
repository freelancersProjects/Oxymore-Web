import React from "react";
import { Trophy } from "lucide-react";
import EmptyState from "../../../../components/EmptyState/EmptyState";
import type { Team } from "../../../../types/team";
import "./TeamTournamentHistory.scss";

interface TeamTournamentHistoryProps {
  teamId: string;
  teamData: Team | null;
}

const TeamTournamentHistory: React.FC<TeamTournamentHistoryProps> = ({ teamId, teamData }) => {
  return (
    <div className="team-tournament-history-page">
      <div className="tournament-history-header">
        <h2 className="tournament-history-title">Historique des tournois</h2>
      </div>
      <EmptyState
        icon={Trophy}
        title="Aucun tournoi"
        description="Votre équipe n'a pas encore participé à un tournoi"
      />
    </div>
  );
};

export default TeamTournamentHistory;

