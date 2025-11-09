import React from 'react';
import type { Tournament } from '../../../../types/tournament';
import './Room.scss';

interface RoomProps {
  tournament: Tournament;
}

const Room: React.FC<RoomProps> = ({ tournament }) => {
  return (
    <div className="tournament-view-room">
      <h2 className="tournament-view-section-title">Room</h2>
      <div className="tournament-view-room-content">
        <p>Room content will be displayed here.</p>
        {/* TODO: Implement room/chat functionality */}
      </div>
    </div>
  );
};

export default Room;




