import { Router } from 'express';
import {
  criarCategoria,
  listarCategorias,
  buscarCategoriaPorId,
  atualizarCategoria,
  deletarCategoria
} from '../controllers/categoriaController.js';

const router = Router();

/**
 * @route POST /api/categorias
 * @desc Criar categoria
 * @access Public
 */
router.post('/', criarCategoria);

/**
 * @route GET /api/categorias
 * @desc Listar todas categorias
 * @access Public
 */
router.get('/', listarCategorias);

/**
 * @route GET /api/categorias/:id
 * @desc Buscar categoria por ID
 * @access Public
 */
router.get('/:id', buscarCategoriaPorId);

/**
 * @route PUT /api/categorias/:id
 * @desc Atualizar categoria
 * @access Public
 */
router.put('/:id', atualizarCategoria);

/**
 * @route DELETE /api/categorias/:id
 * @desc Deletar categoria
 * @access Public
 */
router.delete('/:id', deletarCategoria);

export default router;