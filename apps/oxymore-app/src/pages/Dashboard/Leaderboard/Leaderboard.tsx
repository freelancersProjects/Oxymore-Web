import { useState } from "react";
import { OXMDropdown } from "@oxymore/ui";
import { Trophy } from "lucide-react";
import "./Leaderboard.scss";

interface Team {
  id: number;
  name: string;
  elo: number;
  rank: number;
}

const teams: Team[] = [
  { id: 1, name: "Team Phoenix", elo: 2345, rank: 1 },
  { id: 2, name: "Dark Wolves", elo: 2290, rank: 2 },
  { id: 3, name: "Arctic Foxes", elo: 2240, rank: 3 },
  { id: 4, name: "Shadow Squad", elo: 2205, rank: 4 },
  { id: 5, name: "Titanfall", elo: 2205, rank: 5 },
  { id: 6, name: "Bulletproof", elo: 2135, rank: 6 },
  { id: 7, name: "Nitro Clan", elo: 2100, rank: 7 },
  { id: 8, name: "Silent Assassins", elo: 2075, rank: 8 },
  { id: 9, name: "Thunder Strike", elo: 2050, rank: 9 },
  { id: 10, name: "Elite Force", elo: 2025, rank: 10 },
];

const regions = [
  { label: "Europe", value: "europe" },
  { label: "North America", value: "na" },
  { label: "Asia", value: "asia" },
  { label: "South America", value: "sa" },
];

const Leaderboard = () => {
  const [selectedRegion, setSelectedRegion] = useState("europe");

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="trophy-icon gold" size={20} />;
      case 2:
        return <Trophy className="trophy-icon silver" size={20} />;
      case 3:
        return <Trophy className="trophy-icon bronze" size={20} />;
      default:
        return <span className="rank-number">#{rank}</span>;
    }
  };

  return (
    <section className="leaderboard">
      <div className="leaderboard-header-dashboard">
        <h2 className="section-title orbitron">Top 10 Leaderboard</h2>
        <OXMDropdown
          options={regions}
          value={selectedRegion}
          onChange={setSelectedRegion}
          placeholder="Select region"
        />
      </div>

      <div className="leaderboard-content">
                 <div className="leaderboard-header-row">
           <div className="header-rank orbitron">Rank</div>
           <div className="header-team orbitron">Team Name</div>
           <div className="header-elo orbitron">Elo</div>
         </div>

        <div className="leaderboard-entries">
          {teams.map((team) => (
            <div key={team.id} className="leaderboard-entry">
                             <div className="entry-rank">
                 {getRankIcon(team.rank)}
               </div>
               <div className="entry-team orbitron">
                 {team.name}
               </div>
               <div className="entry-elo">
                 <span className="elo-badge orbitron">{team.elo}</span>
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="leaderboard-footer">
        <button className="view-full-btn">
          View Full League Page
        </button>
      </div>
    </section>
  );
};

export default Leaderboard;
