import express from 'express';
import {
  createChallenge,
  getChallengesByTeam,
  getChallengeById,
  updateChallengeStatus,
  updateChallengeScheduledDate,
  deleteChallenge
} from '../../controllers/team/teamChallengeController';

const router = express.Router();

router.post('/', createChallenge);
router.get('/team/:teamId', getChallengesByTeam);
router.get('/:id', getChallengeById);
router.patch('/:id/status', updateChallengeStatus);
router.patch('/:id/scheduled-date', updateChallengeScheduledDate);
router.delete('/:id', deleteChallenge);

export default router;


