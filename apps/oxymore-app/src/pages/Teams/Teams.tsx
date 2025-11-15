import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import TeamSearch from "./TeamSearch/TeamSearch";
import { teamService } from "../../services/teamService";
import "./Teams.scss";

export const Teams: React.FC = () => {
  const navigate = useNavigate();
  const [checkingTeam, setCheckingTeam] = useState(true);

  useEffect(() => {
    const checkUserTeam = async () => {
      try {
        const userStr = localStorage.getItem("useroxm");
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.id_user) {
            const data = await teamService.getUserTeam(user.id_user);
            if (data.hasTeam && data.teamMember) {
              navigate(`/teams/${data.teamMember.id_team}`);
              return;
            }
          }
        }
      } catch (error) {
        console.error("Error checking user team:", error);
      } finally {
        setCheckingTeam(false);
      }
    };

    checkUserTeam();
  }, [navigate]);

  if (checkingTeam) {
    return null;
  }

  return (
    <div className="teams-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="teams-content"
      >
        <TeamSearch />
      </motion.div>
    </div>
  );
};
