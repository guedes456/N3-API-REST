import { Router } from 'express';
import { registrar, login, logout } from '../controllers/authController.js';

const router = Router();

router.post('/registrar', registrar);
router.post('/login', login);
router.post('/logout', logout);

export default router;