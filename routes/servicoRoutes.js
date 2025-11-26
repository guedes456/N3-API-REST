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

/**
 * @route POST /api/servicos
 * @desc Criar serviço
 * @access Public
 */
router.post('/', criarServico);

/**
 * @route GET /api/servicos
 * @desc Listar todos serviços
 * @access Public
 */
router.get('/', listarServicos);

/**
 * @route GET /api/servicos/prestador/:codigo_prestador
 * @desc Buscar serviços por prestador (REQUISITO DO TRABALHO)
 * @access Public
 */
router.get('/prestador/:codigo_prestador', buscarServicosPorPrestador);

/**
 * @route GET /api/servicos/:id
 * @desc Buscar serviço por ID
 * @access Public
 */
router.get('/:id', buscarServicoPorId);

/**
 * @route PUT /api/servicos/:id
 * @desc Atualizar serviço
 * @access Public
 */
router.put('/:id', atualizarServico);

/**
 * @route DELETE /api/servicos/:id
 * @desc Deletar serviço
 * @access Public
 */
router.delete('/:id', deletarServico);

export default router;