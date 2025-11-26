import { Router } from 'express';
import {
  criarPrestador,
  listarPrestadores,
  buscarPrestadorPorId,
  buscarPrestadoresPorCategoria,
  atualizarPrestador,
  deletarPrestador
} from '../controllers/prestadorController.js';
import verificarToken from '../middleware/auth.js';

const router = Router();

/**
 * @route POST /api/prestadores
 * @desc Criar prestador (PROTEGIDO COM JWT)
 * @access Private
 */
router.post('/', verificarToken, criarPrestador);

/**
 * @route GET /api/prestadores
 * @desc Listar todos prestadores
 * @access Public
 */
router.get('/', listarPrestadores);

/**
 * @route GET /api/prestadores/categoria/:id_categoria
 * @desc Buscar prestadores por categoria (REQUISITO DO TRABALHO)
 * @access Public
 */
router.get('/categoria/:id_categoria', buscarPrestadoresPorCategoria);

/**
 * @route GET /api/prestadores/:id
 * @desc Buscar prestador por ID
 * @access Public
 */
router.get('/:id', buscarPrestadorPorId);

/**
 * @route PUT /api/prestadores/:id
 * @desc Atualizar prestador
 * @access Public
 */
router.put('/:id', atualizarPrestador);

/**
 * @route DELETE /api/prestadores/:id
 * @desc Deletar prestador
 * @access Public
 */
router.delete('/:id', deletarPrestador);

export default router;