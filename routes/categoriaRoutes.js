import { Router } from 'express';
import {
  criarCategoria,
  listarCategorias,
  buscarCategoriaPorId,
  atualizarCategoria,
  deletarCategoria
} from '../controllers/categoriaController.js';
import verificarToken from '../middleware/auth.js';

const router = Router();

router.post('/', verificarToken, criarCategoria);
router.get('/', listarCategorias);
router.get('/:id', buscarCategoriaPorId);
router.put('/:id', verificarToken, atualizarCategoria);
router.delete('/:id', verificarToken, deletarCategoria);

export default router;