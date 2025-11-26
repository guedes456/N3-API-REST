import { Router } from 'express';
import { registrar, login, logout } from '../controllers/authController.js';

const router = Router();

/**
 * @route POST /api/auth/registrar
 * @desc Registrar novo usuário
 * @access Public
 */
router.post('/registrar', registrar);

/**
 * @route POST /api/auth/login
 * @desc Login e geração de token JWT
 * @access Public
 */
router.post('/login', login);

/**
 * @route POST /api/auth/logout
 * @desc Logout
 * @access Public
 */
router.post('/logout', logout);

export default router;