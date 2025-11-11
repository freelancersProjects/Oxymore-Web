import React from 'react';
import { OXMDropdown } from '@oxymore/ui';
import { Grid3X3, List } from 'lucide-react';
import './TournamentFilters.scss';

interface TournamentFiltersProps {
  matchFormat: string;
  setMatchFormat: (value: string) => void;
  teamSize: string;
  setTeamSize: (value: string) => void;
  prizePool: string;
  setPrizePool: (value: string) => void;
  accessType: string;
  setAccessType: (value: string) => void;
  viewMode: 'cards' | 'list';
  setViewMode: (mode: 'cards' | 'list') => void;
}

const TournamentFilters: React.FC<TournamentFiltersProps> = ({
  matchFormat,
  setMatchFormat,
  teamSize,
  setTeamSize,
  prizePool,
  setPrizePool,
  accessType,
  setAccessType,
  viewMode,
  setViewMode
}) => {
  const matchFormats = [
    { label: "Match Formats", value: "all" },
    { label: "Best of 1", value: "bo1" },
    { label: "Best of 3", value: "bo3" },
    { label: "Best of 5", value: "bo5" },
  ];

  const teamSizes = [
    { label: 'Team Sizes', value: 'all' },
    { label: '1V1', value: '1V1' },
    { label: '2V2', value: '2V2' },
    { label: '5V5', value: '5V5' }
  ];

  const prizePools = [
    { label: 'Prize Pools', value: 'all' },
    { label: '0-50€', value: 'low' },
    { label: '100-1000€', value: 'medium' },
    { label: '1000€+', value: 'high' }
  ];

  const accessTypes = [
    { label: 'Access Types', value: 'all' },
    { label: 'Public', value: 'public' },
    { label: 'Privé', value: 'private' },
    { label: 'Premium', value: 'premium' }
  ];

  return (
    <div className="tournament-filters">
      {React.createElement(OXMDropdown as any, {
        options: matchFormats,
        value: matchFormat,
        onChange: (value: string) => setMatchFormat(value),
        placeholder: "Match Format"
      })}
      {React.createElement(OXMDropdown as any, {
        options: teamSizes,
        value: teamSize,
        onChange: (value: string) => setTeamSize(value),
        placeholder: "Team Size"
      })}
      {React.createElement(OXMDropdown as any, {
        options: prizePools,
        value: prizePool,
        onChange: (value: string) => setPrizePool(value),
        placeholder: "Prize Pool",

      })}
      {React.createElement(OXMDropdown as any, {
        options: accessTypes,
        value: accessType,
        onChange: (value: string) => setAccessType(value),
        placeholder: "Access Type",
      })}

      <div className="view-toggle">
        <button
          className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
          onClick={() => setViewMode('cards')}
          title="Vue cartes"
        >
          <Grid3X3 size={20} />
        </button>
        <button
          className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => setViewMode('list')}
          title="Vue liste"
        >
          <List size={20} />
        </button>
      </div>
    </div>
  );
};

export default TournamentFilters;



