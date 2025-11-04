import { Router } from 'express';
import type { Handler } from 'express';
import { sendContact } from '../../controllers/email/emailController';

const router = Router();

router.post('/contact', sendContact as Handler);

export default router;


