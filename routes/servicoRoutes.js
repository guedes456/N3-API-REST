import { Router } from 'express';
import {
  criarServico,
  listarServicos,
  buscarServicoPorId,
  buscarServicosPorPrestador,
  atualizarServico,
  deletarServico
} from '../controllers/servicoController.js';

const router = Router();

router.post('/', criarServico);
router.get('/', listarServicos);
router.get('/prestador/:codigo_prestador', buscarServicosPorPrestador);
router.get('/:id', buscarServicoPorId);
router.put('/:id', atualizarServico);
router.delete('/:id', deletarServico);

export default router;