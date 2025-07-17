import { useState, useEffect } from "react";
import { OXMCategorie, OXMDropdown } from "@oxymore/ui";
import { useLanguage } from "../../../context/LanguageContext";
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

const leagues = [
  { label: "Oxymore pro league", value: "pro" },
  { label: "Heaven league", value: "heaven" },
  { label: "MID league", value: "mid" },
  { label: "Jungle league", value: "jungle" },
  { label: "Dust league", value: "dust" },
];

const teamsByLeague: Record<string, Team[]> = {
  pro: [
    { id: 1, place: "1", name: "Team Phoenix", score: "2040", logo: first },
    { id: 2, place: "2", name: "Dark Wolves", score: "1987", logo: second },
    { id: 3, place: "3", name: "Sniper Squad", score: "1950", logo: third },
  ],
  heaven: [
    { id: 4, place: "1", name: "Heavenly Stars", score: "2010", logo: first },
    { id: 5, place: "2", name: "Cloud Nine", score: "1992", logo: second },
    { id: 6, place: "3", name: "Sky Guardians", score: "1920", logo: third },
  ],
  mid: [
    { id: 7, place: "1", name: "Mid Titans", score: "2050", logo: first },
    { id: 8, place: "2", name: "Balance Force", score: "2001", logo: second },
    { id: 9, place: "3", name: "Median Crew", score: "1930", logo: third },
  ],
  jungle: [
    { id: 10, place: "1", name: "Jungle Kings", score: "2100", logo: first },
    { id: 11, place: "2", name: "Wild Hunters", score: "2022", logo: second },
    { id: 12, place: "3", name: "Predator Team", score: "1980", logo: third },
  ],
  dust: [
    { id: 13, place: "1", name: "Dust Warriors", score: "2080", logo: first },
    { id: 14, place: "2", name: "Sandstorm", score: "2015", logo: second },
    { id: 15, place: "3", name: "Desert Foxes", score: "1960", logo: third },
  ],
};

const Leagues = () => {
  const { t } = useLanguage();
  const [active, setActive] = useState("pro");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 900px)").matches);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const leagueTeams = teamsByLeague[active] || [];
  const podium = isMobile
    ? [leagueTeams[0], leagueTeams[1], leagueTeams[2]]
    : [leagueTeams[1], leagueTeams[0], leagueTeams[2]];

  return (
    <section className="leagues">
      <OXMCategorie label={t('home.leagues.bestTeams')} />
      <h1>{t('home.leagues.title')}</h1>
      <p className="subtitle">{t('home.leagues.subtitle')}</p>

      {!isMobile && (
        <div className="leagues__tabs">
          {leagues.map((l) => (
            <button
              key={l.value}
              className={`tab ${active === l.value ? "active" : ""}`}
              onClick={() => setActive(l.value)}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
      {isMobile && (
        <div className="leagues__dropdown-wrapper">
          <OXMDropdown
            options={leagues}
            value={active}
            onChange={(selected) => setActive(selected ?? "")}
            placeholder={t('home.leagues.title')}
            theme="purple"
          />
        </div>
      )}

      <div className="leagues__cards">
        {podium.map((team) =>
          team ? (
            <div
              key={team.id}
              className={`team-card ${team.place === "1" ? "first" : ""} ${
                team.place === "2" ? "second" : ""
              } ${team.place === "3" ? "third" : ""}`}
            >
              <img src={team.logo} alt={team.name} />
              <h3>{team.name}</h3>
              <hr />
              <span className="label">{t('home.leagues.elo')}</span>
              <p className="score">{team.score}</p>
            </div>
          ) : null
        )}
      </div>
    </section>
  );
};

export default Leagues;
