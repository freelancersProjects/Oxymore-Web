import React, { useState, useMemo } from "react";
import "./Teams.scss";
import { Users, Search } from "lucide-react";
import '../../styles/global.scss';

const TEAMS = [
  { id: 1, name: "Oxia Legends", members: 42, description: "La team la plus active de la plateforme !", color: "#8B5CF6" },
  { id: 2, name: "CS2 Tryharders", members: 31, description: "Pour les fans de compétition.", color: "#0EA5E9" },
  { id: 3, name: "Chill Gamers", members: 27, description: "Ici on joue pour le fun.", color: "#F59E42" },
  { id: 4, name: "Night Owls", members: 19, description: "Les joueurs de la nuit.", color: "#F43F5E" },
  { id: 5, name: "SoloQ Enjoyers", members: 12, description: "Pour ceux qui aiment carry solo.", color: "#22D3EE" },
];

export const Teams = () => {
  const [search, setSearch] = useState("");

  const filteredTeams = useMemo(() => {
    return TEAMS.filter((team) =>
      team.name.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => b.members - a.members);
  }, [search]);

  return (
    <div className="teams-container">
      <div className="teams-header">
        <div className="header-content">
          <h1 className="teams-title">Teams</h1>
          <p className="teams-subtitle">Trouve et rejoins une équipe pour vivre l'expérience Oxymore à plusieurs !</p>
        </div>
      </div>

      <div className="teams-stats">
        <div className="stat-card">
          <div className="stat-number">{TEAMS.length}</div>
          <div className="stat-label">Équipes</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{TEAMS.reduce((acc, t) => acc + t.members, 0)}</div>
          <div className="stat-label">Membres</div>
        </div>
      </div>

      <div className="teams-search-bar">
        <Search size={20} />
        <input
          type="text"
          placeholder="Rechercher une équipe..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="teams-grid">
        {filteredTeams.length === 0 ? (
          <div className="teams-empty">
            <Users size={48} />
            <h3>Aucune équipe trouvée</h3>
            <p>Essayez un autre nom ou revenez plus tard !</p>
          </div>
        ) : (
          filteredTeams.map((team, idx) => (
            <div
              className="team-card"
              key={team.id}
              style={{ borderLeft: `5px solid ${team.color}` }}
              tabIndex={0}
            >
              <div className="team-header">
                <div className="team-avatar" style={{ background: team.color }}>
                  <Users size={28} />
                </div>
                <div className="team-info">
                  <div className="team-name">{team.name}</div>
                  <div className="team-members">{team.members} membres</div>
                </div>
              </div>
              <div className="team-desc">{team.description}</div>
              <button className="team-join-btn">Rejoindre</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
