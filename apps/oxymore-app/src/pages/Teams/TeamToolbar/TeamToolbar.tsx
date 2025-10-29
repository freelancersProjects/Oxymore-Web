import React from 'react';
import { Settings, Users, Trophy, FileText, MessageSquare, Sword, Activity } from 'lucide-react';
import { OXMTooltip, OXMBadge } from '@oxymore/ui';
import './TeamToolbar.scss';

export type TeamTab = 'members' | 'messages' | 'challenges' | 'matchHistory' | 'applications' | 'tournamentHistory' | 'settings';

interface TeamToolbarProps {
  activeTab: TeamTab;
  onTabChange: (tab: TeamTab) => void;
  isAdmin: boolean;
  pendingApplicationsCount?: number;
  unreadMessagesCount?: number;
  pendingChallengesCount?: number;
}

const TeamToolbar: React.FC<TeamToolbarProps> = ({ activeTab, onTabChange, isAdmin, pendingApplicationsCount = 0, unreadMessagesCount = 0, pendingChallengesCount = 0 }) => {
  return (
    <div className="team-toolbar">
      <div className="team-toolbar__tabs">
        <OXMTooltip text="Membres" position="bottom" delay={200}>
          <button
            className={`team-toolbar__tab ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => onTabChange('members')}
          >
            <Users className="team-toolbar__icon" />
          </button>
        </OXMTooltip>
        <OXMTooltip text="Messages" position="bottom" delay={200}>
          <button
            className={`team-toolbar__tab ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => onTabChange('messages')}
          >
            <div className="team-toolbar__icon-wrapper">
              <MessageSquare className="team-toolbar__icon" />
              <OXMBadge count={unreadMessagesCount} variant="toolbar" />
            </div>
          </button>
        </OXMTooltip>
        <OXMTooltip text="Défis" position="bottom" delay={200}>
          <button
            className={`team-toolbar__tab ${activeTab === 'challenges' ? 'active' : ''}`}
            onClick={() => onTabChange('challenges')}
          >
            <div className="team-toolbar__icon-wrapper">
              <Sword className="team-toolbar__icon" />
              <OXMBadge count={pendingChallengesCount} variant="toolbar" />
            </div>
          </button>
        </OXMTooltip>
        <OXMTooltip text="Matchs précédents" position="bottom" delay={200}>
          <button
            className={`team-toolbar__tab ${activeTab === 'matchHistory' ? 'active' : ''}`}
            onClick={() => onTabChange('matchHistory')}
          >
            <Activity className="team-toolbar__icon" />
          </button>
        </OXMTooltip>
        {isAdmin && (
          <>
            <OXMTooltip text="Candidatures" position="bottom" delay={200}>
              <button
                className={`team-toolbar__tab ${activeTab === 'applications' ? 'active' : ''}`}
                onClick={() => onTabChange('applications')}
              >
                <div className="team-toolbar__icon-wrapper">
                  <FileText className="team-toolbar__icon" />
                  <OXMBadge count={pendingApplicationsCount} variant="toolbar" />
                </div>
              </button>
            </OXMTooltip>
            <OXMTooltip text="Historique des tournois" position="bottom" delay={200}>
              <button
                className={`team-toolbar__tab ${activeTab === 'tournamentHistory' ? 'active' : ''}`}
                onClick={() => onTabChange('tournamentHistory')}
              >
                <Trophy className="team-toolbar__icon" />
              </button>
            </OXMTooltip>
            <OXMTooltip text="Paramètres" position="bottom" delay={200}>
              <button
                className={`team-toolbar__tab ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => onTabChange('settings')}
              >
                <Settings className="team-toolbar__icon" />
              </button>
            </OXMTooltip>
          </>
        )}
      </div>
    </div>
  );
};

export default TeamToolbar;

