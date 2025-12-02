import { Router } from 'express';
import {
  criarServico,
  listarServicos,
  buscarServicoPorId,
  buscarServicosPorPrestador,
  atualizarServico,
  deletarServico
} from '../controllers/servicoController.js';
import verificarToken from '../middleware/auth.js';

const router = Router();

router.post('/', verificarToken, criarServico);
router.get('/', listarServicos);
router.get('/prestador/:codigo_prestador', buscarServicosPorPrestador);
router.get('/:id', buscarServicoPorId);
router.put('/:id', verificarToken, atualizarServico);
router.delete('/:id', verificarToken, deletarServico);

export default router;