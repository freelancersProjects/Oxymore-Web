import React, { useState, useEffect } from "react";
import { OXMCategorie, OXMDropdown } from "@oxymore/ui";
import "./Leagues.scss";

import first from "../../../assets/images/first.png";
import second from "../../../assets/images/second.png";
import third from "../../../assets/images/third.png";

interface Team {
  id: number;
  place: string;
  name: string;
  score: string;
  logo: string;
}

const teamsByRegion: Record<string, Team[]> = {
  Europe: [
    { id: 1, place: "1", name: "Team Phoenix", score: "2040", logo: first },
    { id: 2, place: "2", name: "Dark Wolves", score: "1987", logo: second },
    { id: 3, place: "3", name: "Sniper Squad", score: "1950", logo: third },
  ],
  NA: [
    { id: 4, place: "1", name: "Alpha Wolves", score: "2010", logo: first },
    { id: 5, place: "2", name: "Eagle United", score: "1992", logo: second },
    { id: 6, place: "3", name: "Red Foxes", score: "1920", logo: third },
  ],
  "Latin America": [
    { id: 7, place: "1", name: "Latam Kings", score: "2050", logo: first },
    { id: 8, place: "2", name: "Aztec Force", score: "2001", logo: second },
    { id: 9, place: "3", name: "Inca Squad", score: "1930", logo: third },
  ],
  "Asia Pacific": [
    { id: 10, place: "1", name: "Samurai X", score: "2100", logo: first },
    { id: 11, place: "2", name: "Tiger Esports", score: "2022", logo: second },
    { id: 12, place: "3", name: "Lotus Team", score: "1980", logo: third },
  ],
  "Southeast Asia": [
    { id: 13, place: "1", name: "SEA Legends", score: "2080", logo: first },
    { id: 14, place: "2", name: "Dragon Spirit", score: "2015", logo: second },
    { id: 15, place: "3", name: "Bamboo Crew", score: "1960", logo: third },
  ],
};

const continents = [
  { label: "Europe", value: "Europe" },
  { label: "NA", value: "NA" },
  { label: "Latin America", value: "Latin America" },
  { label: "Asia Pacific", value: "Asia Pacific" },
  { label: "Southeast Asia", value: "Southeast Asia" },
];

const Leagues = () => {
  const [active, setActive] = useState("Europe");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 900px)").matches);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const regionTeams = teamsByRegion[active] || [];
  const podium = isMobile
    ? [regionTeams[0], regionTeams[1], regionTeams[2]]
    : [regionTeams[1], regionTeams[0], regionTeams[2]];

  return (
    <section className="leagues">
      <OXMCategorie label="Best Teams" />
      <h1>Select Your League. See the Best.</h1>
      <p className="subtitle">Choose a league to view top performing teams.</p>

      {!isMobile && (
        <div className="leagues__tabs">
          {continents.map((c) => (
            <button
              key={c.value}
              className={`tab ${active === c.value ? "active" : ""}`}
              onClick={() => setActive(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
{isMobile && (
  <div className="leagues__dropdown-wrapper">
    <OXMDropdown
      options={continents}
      value={active}
      onChange={(selected) => setActive(selected)}
      placeholder="Select a region"
      theme="purple"
    />
  </div>
)}


      <div className="leagues__cards">
        {podium.map((team) =>
          team ? (
            <div
              key={team.id}
              className={`team-card ${team.place === "1" ? "first" : ""} ${team.place === "2" ? "second" : ""} ${team.place === "3" ? "third" : ""}`}
            >
              <img src={team.logo} alt={team.name} />
              <h3>{team.name}</h3>
              <hr />
              <span className="label">Elo Score</span>
              <p className="score">{team.score}</p>
            </div>
          ) : null
        )}
      </div>
    </section>
  );
};

export default Leagues;
