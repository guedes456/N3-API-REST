import { Router } from 'express';
import {
  criarPrestador,
  listarPrestadores,
  buscarPrestadorPorId,
  buscarPrestadoresPorCategoria,
  buscarPrestadoresPorServico,
  atualizarPrestador,
  deletarPrestador
} from '../controllers/prestadorController.js';
import verificarToken from '../middleware/auth.js';

const router = Router();

router.post('/', verificarToken, criarPrestador);
router.get('/', listarPrestadores);
router.get('/categoria/:id_categoria', buscarPrestadoresPorCategoria);
router.get('/servico/:id_servico', buscarPrestadoresPorServico);
router.get('/:id', buscarPrestadorPorId);
router.put('/:id', verificarToken, atualizarPrestador);
router.delete('/:id', verificarToken, deletarPrestador);

export default router;