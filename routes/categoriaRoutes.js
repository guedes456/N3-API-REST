import { Router } from 'express';
import {
  criarCategoria,
  listarCategorias,
  buscarCategoriaPorId,
  atualizarCategoria,
  deletarCategoria
} from '../controllers/categoriaController.js';

const router = Router();

router.post('/', criarCategoria);
router.get('/', listarCategorias);
router.get('/:id', buscarCategoriaPorId);
router.put('/:id', atualizarCategoria);
router.delete('/:id', deletarCategoria);

export default router;