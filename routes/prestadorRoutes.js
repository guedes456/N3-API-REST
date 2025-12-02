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

router.post('/', verificarToken, criarPrestador);
router.get('/', listarPrestadores);
router.get('/categoria/:id_categoria', buscarPrestadoresPorCategoria);
router.get('/:id', buscarPrestadorPorId);
router.put('/:id', atualizarPrestador);
router.delete('/:id', deletarPrestador);

export default router;