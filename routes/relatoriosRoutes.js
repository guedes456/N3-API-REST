import { Router } from 'express';
import {
  relatorioServicosCompleto,
  analisePrestadoresPorCategoria,
  rankingPrestadores,
  listarServicosPremium,
  dashboardCategorias,
  cadastrarServicoCompleto,
  relatorioPrestadoresCategoria,
  infoTrigger,
  listarRelatoriosDisponiveis
} from '../controllers/relatoriosController.js';

const router = Router();

// =============================================
// ROTAS DE CONSULTAS COMPLEXAS
// =============================================

// Consulta 1: Relatório completo de serviços (3 tabelas)
router.get('/servicos-completo', relatorioServicosCompleto);

// Consulta 2: Análise de prestadores por categoria (2 tabelas)
router.get('/analise-prestadores', analisePrestadoresPorCategoria);

// Consulta 3: Ranking de prestadores (2 tabelas)
router.get('/ranking-prestadores', rankingPrestadores);

// =============================================
// ROTAS DAS VIEWS
// =============================================

// View 1: Serviços Premium
router.get('/views/servicos-premium', listarServicosPremium);

// View 2: Dashboard de Categorias
router.get('/views/dashboard-categorias', dashboardCategorias);

// =============================================
// ROTAS DAS STORED PROCEDURES
// =============================================

// Stored Procedure 1: Cadastrar serviço completo
router.post('/procedure/servico', cadastrarServicoCompleto);

// Stored Procedure 2: Relatório de prestadores por categoria
// Use :id_categoria = "todos" para listar todas as categorias
router.get('/procedure/prestadores-por-categoria/:id_categoria', relatorioPrestadoresCategoria);

// =============================================
// ROTAS INFORMATIVAS
// =============================================

// Informações sobre o trigger
router.get('/trigger/info', infoTrigger);

// Lista todos os relatórios disponíveis
router.get('/', listarRelatoriosDisponiveis);

export default router;
