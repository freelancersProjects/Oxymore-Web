import { motion } from 'framer-motion';
import TeamSearch from './TeamSearch/TeamSearch';
import type { Team } from './TeamSearch/types/Team';
import "./Teams.scss";

export const Teams: React.FC = () => {

  const handleTeamSelect = (team: Team): void => {
    console.log('Équipe sélectionnée:', team);
  };

  return (
    <div className="teams-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="teams-content"
      >
        <TeamSearch onTeamSelect={handleTeamSelect} />
      </motion.div>
    </div>
  );
};
