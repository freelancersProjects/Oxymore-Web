import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Share as ShareIcon } from '@mui/icons-material';
import { OXMButton, OXMAccordionInformation } from '@oxymore/ui';
import { tournamentService } from '../../../services/tournamentService';
import { tournamentFormatService } from '../../../services/tournamentFormatService';
import { dateFormatService } from '../../../services/dateFormatService';
import apiService from '../../../api/apiService';
import type { Tournament } from '../../../types/tournament';
import BlueCheckIcon from '../../../assets/svg/blue-check.svg?react';
import GameIcon from '../../../assets/svg/tournament/game.svg?react';
import TeamSizeIcon from '../../../assets/svg/tournament/team-size.svg?react';
import FormatIcon from '../../../assets/svg/tournament/format.svg?react';
import AntiCheatIcon from '../../../assets/svg/tournament/anti-cheat.svg?react';
import CheckInIcon from '../../../assets/svg/tournament/check-in.svg?react';
import StartDateIcon from '../../../assets/svg/tournament/start-date.svg?react';
import PrizePoolIcon from '../../../assets/svg/tournament/prize-pool.svg?react';
import ParticipantCupIcon from '../../../assets/svg/tournament/participant-cup.svg?react';
import { Trophy } from 'lucide-react';
import Bracket from './Bracket/Bracket';
import Teams from './Teams/Teams';
import Room from './Room/Room';
import './TournamentView.scss';

type TabType = 'general' | 'bracket' | 'teams' | 'room';

interface TournamentRules {
  id: string;
  title: string;
  content: string;
}

const VALID_TABS: TabType[] = ['general', 'bracket', 'teams', 'room'];

const TournamentView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    // Initialize from URL if available, otherwise default to 'general'
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabFromUrl = params.get('tab');
      if (tabFromUrl && VALID_TABS.includes(tabFromUrl as TabType)) {
        return tabFromUrl as TabType;
      }
    }
    return 'general';
  });
  const [checkInTimeLeft, setCheckInTimeLeft] = useState<string>('');
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [activeTabIndicator, setActiveTabIndicator] = useState({ width: 0, left: 0 });
  const [badge, setBadge] = useState<{ image_url?: string; badge_name?: string; badge_description?: string } | null>(null);

  // Mock rules for now - will be replaced with real data later
  const tournamentRules: TournamentRules[] = [
    {
      id: '1',
      title: 'General Rules',
      content: 'All participants must follow the tournament rules and regulations. Any violation will result in immediate disqualification.'
    },
    {
      id: '2',
      title: 'Match Rules',
      content: 'Matches will be played in a single elimination format. Each match is best of 1 unless otherwise specified.'
    },
    {
      id: '3',
      title: 'Anti-Cheat',
      content: 'Anti-cheat software is required for all participants. Players must have a valid anti-cheat account and be verified before the tournament starts.'
    },
    {
      id: '4',
      title: 'Check-in Requirements',
      content: 'All participants must check in during the designated check-in period. Failure to check in will result in automatic disqualification.'
    }
  ];

  // Initialize tab from URL on mount - always default to 'general' if no valid tab
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    const validTab = tabFromUrl && VALID_TABS.includes(tabFromUrl as TabType) 
      ? (tabFromUrl as TabType) 
      : 'general';
    
    // Only update if different from current state
    if (validTab !== activeTab) {
      setActiveTab(validTab);
    }
    
    // Update URL if it doesn't match the valid tab (only on mount)
    if (tabFromUrl !== validTab) {
      setSearchParams({ tab: validTab }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync tab with URL changes (when URL changes externally, e.g., browser back/forward)
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && VALID_TABS.includes(tabFromUrl as TabType)) {
      const tabAsType = tabFromUrl as TabType;
      setActiveTab(tabAsType);
    } else if (!tabFromUrl) {
      // If URL has no tab, ensure general is selected
      setActiveTab('general');
      setSearchParams({ tab: 'general' }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const fetchTournament = async () => {
      if (!id) {
        setError('Tournament ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await tournamentService.getTournamentById(id);
        setTournament(data);
        setError(null);
        
        // Fetch badge if id_badge_winner exists
        if (data.id_badge_winner) {
          try {
            const badgeData = await apiService.get(`/badges/${data.id_badge_winner}`);
            setBadge(badgeData);
          } catch (badgeErr) {
            console.error('Error fetching badge:', badgeErr);
            // Don't set error, badge is optional
          }
        }
      } catch (err) {
        console.error('Error fetching tournament:', err);
        setError('Failed to load tournament');
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [id]);

  // Update countdown every second
  useEffect(() => {
    if (!tournament?.check_in_date) {
      return;
    }

    const updateCountdown = () => {
      setCheckInTimeLeft(calculateTimeLeft(tournament.check_in_date!));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [tournament?.check_in_date]);

  // Update active tab indicator position
  useEffect(() => {
    const updateIndicator = () => {
      const activeIndex = VALID_TABS.indexOf(activeTab);
      const activeTabElement = tabRefs.current[activeIndex];
      
      if (activeTabElement) {
        const { offsetLeft, offsetWidth } = activeTabElement;
        setActiveTabIndicator({
          left: offsetLeft,
          width: offsetWidth
        });
      }
    };

    const rafId = requestAnimationFrame(() => {
      updateIndicator();
      setTimeout(updateIndicator, 10);
    });

    window.addEventListener('resize', updateIndicator);
    
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [activeTab, loading]);


  if(tournament?.is_premium === true) {
    return (
      <div className="tournament-view-container">
        <div className="tournament-view-premium">
          <h1 className="tournament-view-premium-title">Premium Tournament</h1>
        </div>
      </div>
    );
  }
  else if(tournament?.is_premium === false) {
    return (
      <div className="tournament-view-container">
        <div className="tournament-view-premium">
          <h1 className="tournament-view-premium-title">Premium Tournament</h1>
        </div>
      </div>
    );
  }

  const calculateTimeLeft = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();

    if (diffMs <= 0) {
      return '00d 00h 00m 00s';
    }

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    return `${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  };


  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tournament?.tournament_name,
        text: `Check out this tournament: ${tournament?.tournament_name}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="tournament-view-container">
        <div className="tournament-view-loading">Loading tournament...</div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="tournament-view-container">
        <div className="tournament-view-error">{error || 'Tournament not found'}</div>
      </div>
    );
  }

  return (
    <div className="tournament-view-container">
      {/* Tournament Banner */}
      <div className="tournament-view-banner">
        {tournament.image_url ? (
          <img src={tournament.image_url} alt={tournament.tournament_name} />
        ) : (
          <div className="tournament-view-banner-placeholder">
            <span>No image available</span>
          </div>
        )}
      </div>

      {/* Tournament Overview */}
      <div className="tournament-view-overview">
        <div className="tournament-view-overview-left">
          <div className="tournament-view-status">
            {dateFormatService.formatTournamentStatus(tournament.start_date)}
          </div>
          <h1 className="tournament-view-title">{tournament.tournament_name}</h1>
          <div className="tournament-view-organizer">
            <span className="tournament-view-organized-by">Organized by </span>
            <span className="tournament-view-organizer-name">
              {tournament.organized_by || 'Unknown'}
              <BlueCheckIcon className="tournament-view-check-icon" />
            </span>
          </div>
        </div>

        <div className="tournament-view-overview-right">
          {tournament.check_in_date && checkInTimeLeft && (
            <div className="tournament-view-checkin-countdown">
              Time left to participate: <span className="tournament-view-time-highlight">{checkInTimeLeft}</span>
            </div>
          )}
          <div className="tournament-view-actions">
            <OXMButton variant="primary" size="large" onClick={() => {}}>
              Join The Tournament
            </OXMButton>
            <button className="tournament-view-share-btn" onClick={handleShare}>
              <ShareIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tournament-view-tabs-wrapper">
        <div className="tournament-view-tabs">
          <button
            ref={(el) => { tabRefs.current[0] = el; }}
            className={`tournament-view-tab ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('general');
              setSearchParams({ tab: 'general' }, { replace: true });
            }}
            data-tab-index="0"
          >
            General
          </button>
          <button
            ref={(el) => { tabRefs.current[1] = el; }}
            className={`tournament-view-tab ${activeTab === 'bracket' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('bracket');
              setSearchParams({ tab: 'bracket' }, { replace: true });
            }}
            data-tab-index="1"
          >
            Bracket
          </button>
          <button
            ref={(el) => { tabRefs.current[2] = el; }}
            className={`tournament-view-tab ${activeTab === 'teams' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('teams');
              setSearchParams({ tab: 'teams' }, { replace: true });
            }}
            data-tab-index="2"
          >
            Teams
          </button>
          <button
            ref={(el) => { tabRefs.current[3] = el; }}
            className={`tournament-view-tab ${activeTab === 'room' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('room');
              setSearchParams({ tab: 'room' }, { replace: true });
            }}
            data-tab-index="3"
          >
            Room
          </button>
        </div>
        <hr className="tournament-view-tabs-separator" />
        <div
          className="tournament-view-tab-indicator"
          style={{
            left: `${activeTabIndicator.left}px`,
            width: `${activeTabIndicator.width}px`
          }}
        />
      </div>

      {/* Tab Content */}
      <div className="tournament-view-content">
        {activeTab === 'general' && (
          <div className="tournament-view-general">
            {/* Left Column */}
            <div className="tournament-view-left-column">
              {/* Details Section */}
              <div className="tournament-view-details-container">
                <h2 className="tournament-view-section-title">Details</h2>
                <div className="tournament-view-details-content">
                  {/* First Row: Game, Team Size, Format */}
                  <div className="tournament-view-detail-row">
                    <GameIcon className="tournament-view-detail-icon" />
                    <div className="tournament-view-detail-info">
                      <span className="tournament-view-detail-label">Game</span>
                      <span className="tournament-view-detail-value">CS2</span>
                    </div>
                  </div>
                  <div className="tournament-view-detail-row">
                    <TeamSizeIcon className="tournament-view-detail-icon" />
                    <div className="tournament-view-detail-info">
                      <span className="tournament-view-detail-label">Team Size</span>
                      <span className="tournament-view-detail-value">5V5</span>
                    </div>
                  </div>
                  <div className="tournament-view-detail-row">
                    <FormatIcon className="tournament-view-detail-icon" />
                    <div className="tournament-view-detail-info">
                      <span className="tournament-view-detail-label">Format</span>
                      <span className="tournament-view-detail-value">{tournamentFormatService.getStructureLabel(tournament.structure)}</span>
                    </div>
                  </div>
                  {/* Second Row: Anti-Cheat, Check-in, Start */}
                  <div className="tournament-view-detail-row">
                    <AntiCheatIcon className="tournament-view-detail-icon" />
                    <div className="tournament-view-detail-info">
                      <span className="tournament-view-detail-label">Anti-Cheat</span>
                      <span className="tournament-view-detail-value">Required</span>
                    </div>
                  </div>
                  {tournament.check_in_date && (
                    <div className="tournament-view-detail-row">
                      <CheckInIcon className="tournament-view-detail-icon" />
                      <div className="tournament-view-detail-info">
                        <span className="tournament-view-detail-label">Check-in</span>
                        <span className="tournament-view-detail-value">
                          {dateFormatService.formatDateTime(tournament.check_in_date)}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="tournament-view-detail-row">
                    <StartDateIcon className="tournament-view-detail-icon" />
                    <div className="tournament-view-detail-info">
                      <span className="tournament-view-detail-label">Start</span>
                      <span className="tournament-view-detail-value">
                        {dateFormatService.formatDateTime(tournament.start_date)}
                      </span>
                    </div>
                  </div>
                  {/* Third Row: Prize Pool (alone) */}
                  {tournament.cash_prize && (
                    <div className="tournament-view-detail-row tournament-view-detail-row-single">
                      <PrizePoolIcon className="tournament-view-detail-icon" />
                      <div className="tournament-view-detail-info">
                        <span className="tournament-view-detail-label">Prize Pool</span>
                        <span className="tournament-view-detail-value">${tournament.cash_prize.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Information Section */}
              <div className="tournament-view-section-right tournament-view-information-section">
                <h2 className="tournament-view-section-title">Information</h2>
                {tournament.description && (
                  <p className="tournament-view-information-text">{tournament.description}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="tournament-view-right-column">
              {/* Participants Section */}
              <div className="tournament-view-section-right">
                <div className="tournament-view-section-header">
                  <h2 className="tournament-view-section-title">Participants</h2>
                  <button className="tournament-view-show-all">Show All</button>
                </div>
                <div className="tournament-view-participants-container">
                  <div className="tournament-view-participants-circle">
                    <div className="tournament-view-participants-gauge">
                      <svg className="tournament-view-participants-gauge-svg" viewBox="0 0 100 100">
                        <circle
                          className="tournament-view-participants-gauge-bg"
                          cx="50"
                          cy="50"
                          r="45"
                        />
                        <circle
                          className="tournament-view-participants-gauge-fill"
                          cx="50"
                          cy="50"
                          r="45"
                          strokeDasharray={`${2 * Math.PI * 45}`}
                          strokeDashoffset={`${2 * Math.PI * 45 * (1 - ((tournament.min_participant || 0) / (tournament.max_participant || 128)))}`}
                        />
                      </svg>
                    </div>
                    <ParticipantCupIcon className="tournament-view-participants-icon" />
                  </div>
                  <span className="tournament-view-participants-count">
                    {tournament.min_participant || 0} / {tournament.max_participant || 128}
                  </span>
                </div>
              </div>

              {/* Prizes Section */}
              <div className="tournament-view-section-right">
                <div className="tournament-view-section-header">
                  <h2 className="tournament-view-section-title">Prizes</h2>
                  <button className="tournament-view-show-all">Show All</button>
                </div>
                <div className="tournament-view-prizes-list">
                  {tournament.cash_prize && (
                    <>
                      <div className="tournament-view-prize-item">
                        <div className="tournament-view-prize-circle">
                          <Trophy className="tournament-view-prize-icon" style={{ color: '#FFD700' }} />
                        </div>
                        <span className="tournament-view-prize-amount">
                          ${Math.floor(tournament.cash_prize * 0.5).toLocaleString()}
                        </span>
                      </div>
                      <div className="tournament-view-prize-item">
                        <div className="tournament-view-prize-circle">
                          <Trophy className="tournament-view-prize-icon" style={{ color: '#C0C0C0' }} />
                        </div>
                        <span className="tournament-view-prize-amount">
                          ${Math.floor(tournament.cash_prize * 0.3).toLocaleString()}
                        </span>
                      </div>
                      <div className="tournament-view-prize-item">
                        <div className="tournament-view-prize-circle">
                          <Trophy className="tournament-view-prize-icon" style={{ color: '#CD7F32' }} />
                        </div>
                        <span className="tournament-view-prize-amount">
                          ${Math.floor(tournament.cash_prize * 0.2).toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Badge Display */}
              {badge && badge.image_url && (
                <div className="tournament-view-section-right">
                  <div className="tournament-view-badge-container">
                    <h3 className="tournament-view-badge-title">Badge à gagner</h3>
                    <div className="tournament-view-badge-image">
                      <img src={badge.image_url} alt="Tournament Badge" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Rules Accordion - Full Width */}
            <div className="tournament-view-section tournament-view-section-full">
              <h2 className="tournament-view-section-title">Rules</h2>
              <div className="tournament-view-rules">
                {tournamentRules.map(rule => (
                  <OXMAccordionInformation
                    key={rule.id}
                    title={rule.title}
                    content={rule.content}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bracket' && tournament && (
          <Bracket tournament={tournament} />
        )}

        {activeTab === 'teams' && tournament && (
          <Teams tournament={tournament} />
        )}

        {activeTab === 'room' && tournament && (
          <Room tournament={tournament} />
        )}
      </div>
    </div>
  );
};

export default TournamentView;
