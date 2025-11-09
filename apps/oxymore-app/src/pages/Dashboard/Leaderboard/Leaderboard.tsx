import { useState, useEffect } from "react";
import { OXMDropdown } from "@oxymore/ui";
import { Trophy, Loader2, Calendar, Users } from "lucide-react";
import { leagueService } from "../../../services/leagueService";
import type { League, LeagueTeamWithDetails } from "../../../types/league";
import "./Leaderboard.scss";

const Leaderboard = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>("");
  const [teams, setTeams] = useState<LeagueTeamWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(false);

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        setLoading(true);
        const leaguesData = await leagueService.getAllLeagues();
        setLeagues(leaguesData);
        if (leaguesData.length > 0) {
          setSelectedLeagueId(leaguesData[0].id_league);
        }
      } catch (error) {
        console.error('Error fetching leagues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      if (!selectedLeagueId) return;

      try {
        setLoadingTeams(true);
        const teamsData = await leagueService.getLeagueTeams(selectedLeagueId);
        setTeams(teamsData);
      } catch (error) {
        console.error('Error fetching league teams:', error);
        setTeams([]);
      } finally {
        setLoadingTeams(false);
      }
    };

    fetchTeams();
  }, [selectedLeagueId]);

  const getSelectedLeague = (): League | undefined => {
    return leagues.find(league => league.id_league === selectedLeagueId);
  };

  const isLeagueStarted = (league: League | undefined): boolean => {
    if (!league || !league.start_date) return false;
    const now = new Date();
    const startDate = new Date(league.start_date);
    return now >= startDate;
  };

  const leagueOptions = leagues.map(league => ({
    label: league.league_name,
    value: league.id_league
  }));

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

  const selectedLeague = getSelectedLeague();
  const leagueStarted = isLeagueStarted(selectedLeague);

  return (
    <section className="leaderboard">
      <div className="leaderboard-header-dashboard">
        <h2 className="section-title orbitron">Top 10 Leaderboard</h2>
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <OXMDropdown
            options={leagueOptions}
            value={selectedLeagueId}
            onChange={setSelectedLeagueId}
            placeholder="Sélectionner une ligue"
          />
        )}
      </div>

      <div className="leaderboard-content">
        <div className="leaderboard-header-row">
          <div className="header-rank orbitron">Rank</div>
          <div className="header-team orbitron">Team Name</div>
          <div className="header-elo orbitron">Points</div>
        </div>

        {loadingTeams ? (
          <div className="leaderboard-empty-state">
            <div className="empty-state-content">
              <Loader2 className="empty-state-icon" size={48} />
              <p className="empty-state-message">Chargement des équipes...</p>
            </div>
          </div>
        ) : !leagueStarted ? (
          <div className="leaderboard-empty-state">
            <div className="empty-state-content">
              <Calendar className="empty-state-icon" size={48} />
              <p className="empty-state-message">La ligue n'a pas encore commencé</p>
            </div>
          </div>
        ) : teams.length === 0 ? (
          <div className="leaderboard-empty-state">
            <div className="empty-state-content">
              <Users className="empty-state-icon" size={48} />
              <p className="empty-state-message">Aucune équipe dans cette ligue</p>
            </div>
          </div>
        ) : (
          <div className="leaderboard-entries">
            {teams.map((team) => (
              <div 
                key={team.id} 
                className={`leaderboard-entry ${team.rank === 1 ? 'rank-first' : team.rank === 2 ? 'rank-second' : team.rank === 3 ? 'rank-third' : ''}`}
              >
                <div className="entry-rank">
                  {getRankIcon(team.rank)}
                </div>
                <div className="entry-team orbitron">
                  {team.team_name}
                </div>
                <div className="entry-elo">
                  <span className="elo-badge orbitron">{team.points}</span>
                </div>
              </div>
            ))}
          </div>
        )}
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
