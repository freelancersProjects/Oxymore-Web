import React, { useState } from "react";
import { OXMCategorie } from "@oxymore/ui"; // ton composant catégorie
import "./Leagues.scss";

import first from "../../../assets/images/first.png";
import second from "../../../assets/images/second.png";
import third from "../../../assets/images/third.png";

const teams = [
  {
    id: 1,
    place: "1",
    name: "Team Phoenix",
    score: "2040",
    logo: first,
  },
  {
    id: 2,
    place: "2",
    name: "Dark Wolves",
    score: "1987",
    logo: second,
  },
  {
    id: 3,
    place: "3",
    name: "Sniper Squad",
    score: "1950",
    logo: third,
  },
];

const continents = [
  "Europe",
  "NA",
  "Latin America",
  "Asia Pacific",
  "Southeast Asia",
];

const Leagues = () => {
  const [active, setActive] = useState("Europe");

  // Réorganiser pour podium : second, first, third
  const podium = [
    teams.find((t) => t.place === "2"),
    teams.find((t) => t.place === "1"),
    teams.find((t) => t.place === "3"),
  ];

  return (
    <section className="leagues">
      <OXMCategorie label="Best Teams" />
      <h1>Select Your League. See the Best.</h1>
      <p className="subtitle">Choose a league to view top performing teams.</p>

      <div className="leagues__tabs">
        {continents.map((c) => (
          <button
            key={c}
            className={`tab ${active === c ? "active" : ""}`}
            onClick={() => setActive(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="leagues__cards">
        {podium.map((team, idx) =>
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
