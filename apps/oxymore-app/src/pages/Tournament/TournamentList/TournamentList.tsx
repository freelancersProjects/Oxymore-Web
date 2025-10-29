import React from 'react';
import Pagination from '../../../components/Pagination/Pagination';
import TournamentCard from '../TournamentCard/TournamentCard';
import type { Tournament } from '../../../types/tournament';
import './TournamentList.scss';

interface TournamentListProps {
  tournaments: Tournament[];
  viewMode: 'cards' | 'list';
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  formatDate: (dateString: string) => string;
}

const TournamentList: React.FC<TournamentListProps> = ({
  tournaments,
  viewMode,
  currentPage,
  itemsPerPage,
  onPageChange,
  formatDate
}) => {
  const totalPages = Math.ceil(tournaments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTournaments = tournaments.slice(startIndex, endIndex);

  if (tournaments.length === 0) {
    return (
      <div className="tournament-empty">Aucun tournoi disponible</div>
    );
  }

  return (
    <>
      <div className={`tournament-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
        {paginatedTournaments.map((tournament, index) => (
          <TournamentCard
            key={tournament.id_tournament}
            tournament={tournament}
            viewMode={viewMode}
            formatDate={formatDate}
          />
        ))}
      </div>

      {tournaments.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default TournamentList;

