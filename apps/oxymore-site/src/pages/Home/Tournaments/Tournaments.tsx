import { OXMCategorie } from "@oxymore/ui";
import "./Tournaments.scss";

const tournaments = [
  {
    id: 1,
    title: "Valor Clash",
    date: "June 25, 2025",
    format: "BO3",
    prize: "$5,000",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    title: "PUBG",
    date: "June 15, 2025",
    format: "5v5",
    prize: "$10,000",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
];

const Tournaments = () => {
  return (
    <section className="tournaments">
      <OXMCategorie label="Upcoming Tournaments" />
      <h1 className="orbitron">Tournaments</h1>

      <div className="tournaments__list">
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="tournament-card">
            <img src={tournament.image} alt={tournament.title} />
            <div className="tournament-card__content">
              <h3 className="orbitron">{tournament.title}</h3>
              <div className="tournament-card__info">
                <span>{`Date: ${tournament.date}`}</span>
                <span>{`Format: ${tournament.format}`}</span>
              </div>
              <hr />
              <div className="tournament-card__prize orbitron">
                Prize: {tournament.prize}
              </div>
              <button className="tournament-card__button">Register Now</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Tournaments;
