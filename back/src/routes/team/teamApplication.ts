import express from 'express';
import {
  createApplication,
  getApplicationsByTeam,
  getApplicationsByUser,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication
} from '../../controllers/team/teamApplicationController';

const router = express.Router();

router.post('/', createApplication);
router.get('/team/:teamId', getApplicationsByTeam);
router.get('/user/:userId', getApplicationsByUser);
router.get('/:id', getApplicationById);
router.patch('/:id/status', updateApplicationStatus);
router.delete('/:id', deleteApplication);

export default router;

