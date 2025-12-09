import db from "../config/database.js";

// =============================================
// CONSULTAS COMPLEXAS
// =============================================

// CONSULTA 1: Relatório completo de servicos (3 tabelas)
export const relatorioServicosCompleto = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        s.id_servico,
        s.nome_servico,
        s.vlr_servico AS valor_base,
        p.codigo_prestador,
        p.nome_prestador,
        p.tempo_experiencia,
        c.id_categoria,
        c.nome_categoria,
        CASE 
          WHEN p.tempo_experiencia = 3 THEN ROUND(s.vlr_servico * 1.30, 2)
          WHEN p.tempo_experiencia > 3 AND p.tempo_experiencia <= 5 THEN ROUND(s.vlr_servico * 1.50, 2)
          WHEN p.tempo_experiencia > 5 THEN ROUND(s.vlr_servico * 1.75, 2)
          ELSE s.vlr_servico
        END AS valor_final,
        CASE 
          WHEN p.tempo_experiencia = 3 THEN '30%'
          WHEN p.tempo_experiencia > 3 AND p.tempo_experiencia <= 5 THEN '50%'
          WHEN p.tempo_experiencia > 5 THEN '75%'
          ELSE '0%'
        END AS percentual_acrescimo,
        s.createdAt AS data_criacao_servico
      FROM servicos s
      INNER JOIN prestadores p ON s.codigo_prestador = p.codigo_prestador
      INNER JOIN categorias c ON p.id_categoria = c.id_categoria
      ORDER BY valor_final DESC, c.nome_categoria
    `);

    res.json({
      message: "Relatório completo de servicos gerado com sucesso",
      total: results.length,
      dados: results,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao gerar relatório de servicos",
      error: error.message,
    });
  }
};

// CONSULTA 2: Análise de prestadores por categoria (2 tabelas)
export const analisePrestadoresPorCategoria = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        c.id_categoria,
        c.nome_categoria,
        COUNT(DISTINCT p.codigo_prestador) AS total_prestadores,
        AVG(p.tempo_experiencia) AS media_experiencia,
        MIN(p.tempo_experiencia) AS menor_experiencia,
        MAX(p.tempo_experiencia) AS maior_experiencia,
        GROUP_CONCAT(p.nome_prestador ORDER BY p.tempo_experiencia DESC SEPARATOR ', ') AS lista_prestadores
      FROM categorias c
      LEFT JOIN prestadores p ON c.id_categoria = p.id_categoria
      GROUP BY c.id_categoria, c.nome_categoria
      HAVING total_prestadores > 0
      ORDER BY total_prestadores DESC, media_experiencia DESC
    `);

    res.json({
      message: "Análise de prestadores por categoria gerada com sucesso",
      total_categorias: results.length,
      dados: results,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao gerar análise de prestadores",
      error: error.message,
    });
  }
};

// CONSULTA 3: Ranking de prestadores com estatísticas (2 tabelas)
export const rankingPrestadores = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        p.codigo_prestador,
        p.nome_prestador,
        p.tempo_experiencia,
        COUNT(s.id_servico) AS total_servicos,
        COALESCE(AVG(s.vlr_servico), 0) AS valor_medio_servico,
        COALESCE(SUM(
          CASE 
            WHEN p.tempo_experiencia = 3 THEN s.vlr_servico * 1.30
            WHEN p.tempo_experiencia > 3 AND p.tempo_experiencia <= 5 THEN s.vlr_servico * 1.50
            WHEN p.tempo_experiencia > 5 THEN s.vlr_servico * 1.75
            ELSE s.vlr_servico
          END
        ), 0) AS valor_total_servicos,
        CASE 
          WHEN p.tempo_experiencia <= 3 THEN 'Júnior'
          WHEN p.tempo_experiencia > 3 AND p.tempo_experiencia <= 5 THEN 'Pleno'
          ELSE 'Sênior'
        END AS nivel_experiencia
      FROM prestadores p
      LEFT JOIN servicos s ON p.codigo_prestador = s.codigo_prestador
      GROUP BY p.codigo_prestador, p.nome_prestador, p.tempo_experiencia
      ORDER BY total_servicos DESC, valor_total_servicos DESC
    `);

    res.json({
      message: "Ranking de prestadores gerado com sucesso",
      total: results.length,
      dados: results,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao gerar ranking de prestadores",
      error: error.message,
    });
  }
};

// =============================================
// VIEWS
// =============================================

// VIEW 1: servicos Premium (experiência > 5 anos)
export const listarServicosPremium = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT * FROM vw_servicos_premium
    `);

    res.json({
      message: "servicos premium listados com sucesso",
      total: results.length,
      dados: results,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao listar servicos premium",
      error: error.message,
    });
  }
};

// VIEW 2: Dashboard de Categorias
export const dashboardCategorias = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT * FROM vw_dashboard_categorias
    `);

    res.json({
      message: "Dashboard de categorias gerado com sucesso",
      total_categorias: results.length,
      dados: results,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao gerar dashboard de categorias",
      error: error.message,
    });
  }
};

// =============================================
// STORED PROCEDURE
// =============================================

// Cadastrar servico usando Stored Procedure
export const cadastrarServicoCompleto = async (req, res) => {
  try {
    const { nome_servico, codigo_prestador, vlr_servico } = req.body;

    if (!nome_servico || !codigo_prestador) {
      return res.status(400).json({
        message: "Os campos 'nome_servico' e 'codigo_prestador' são obrigatórios.",
      });
    }

    const valorServico = vlr_servico || 80.0;

    // Chama a stored procedure usando template string com valores escapados
    const nomeEscapado = db.escape(nome_servico);
    const codigoEscapado = db.escape(codigo_prestador);
    const valorEscapado = db.escape(valorServico);

    await db.query(
      `CALL sp_cadastrar_servico_completo(${nomeEscapado}, ${codigoEscapado}, ${valorEscapado}, @id_servico, @vlr_final, @tempo_experiencia, @mensagem)`
    );

    // Recupera os valores de saída
    const [output] = await db.query(`
      SELECT 
        @id_servico AS id_servico,
        @vlr_final AS valor_final,
        @tempo_experiencia AS tempo_experiencia,
        @mensagem AS mensagem
    `);

    const resultado = output[0];

    if (resultado.id_servico === null) {
      return res.status(404).json({
        message: resultado.mensagem,
      });
    }

    res.status(201).json({
      message: resultado.mensagem,
      servico: {
        id_servico: resultado.id_servico,
        nome_servico: nome_servico,
        codigo_prestador: codigo_prestador,
        vlr_servico: valorServico,
        vlr_final: parseFloat(resultado.valor_final),
        tempo_experiencia: resultado.tempo_experiencia,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao cadastrar servico via stored procedure",
      error: error.message,
    });
  }
};

// Relatório de prestadores por categoria usando Stored Procedure
export const relatorioPrestadoresCategoria = async (req, res) => {
  try {
    const { id_categoria } = req.params;
    const categoriaId = id_categoria === "todos" ? null : parseInt(id_categoria);

    const results = await db.query(
      `CALL sp_relatorio_prestadores_categoria(${categoriaId})`
    );
    res.json({
      message: "Relatório de prestadores gerado com sucesso",
      categoria_filtrada: categoriaId ? `ID ${categoriaId}` : "Todas",
      dados: results,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao gerar relatório de prestadores",
      error: error.message,
    });
  }
};

// =============================================
// ENDPOINTS AUXILIARES
// =============================================

// Informações sobre o trigger (apenas informativo)
export const infoTrigger = async (req, res) => {
  try {
    res.json({
      message: "Informações sobre o Trigger de Auditoria",
      trigger: {
        nome: "trg_auditoria_servico_update",
        tabela: "servicos",
        evento: "BEFORE UPDATE",
        descricao: "Atualiza automaticamente o campo updatedAt quando um servico é modificado",
        funcionamento: [
          "Monitora alterações na tabela servicos",
          "Atualiza o timestamp updatedAt automaticamente",
          "Registra quando o valor do servico (vlr_servico) é alterado",
        ],
      },
      exemplo: {
        acao: "UPDATE servicos SET vlr_servico = 100 WHERE id_servico = 1",
        resultado: "O trigger atualizará automaticamente o campo updatedAt para NOW()",
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao obter informações do trigger",
      error: error.message,
    });
  }
};

// Listar todos os relatórios disponíveis
export const listarRelatoriosDisponiveis = async (req, res) => {
  try {
    res.json({
      message: "Relatórios e recursos SQL avançados disponíveis",
      consultas_complexas: [
        {
          nome: "Relatório Completo de servicos",
          endpoint: "GET /api/relatorios/servicos-completo",
          descricao: "Lista todos os servicos com prestador, categoria e valor final calculado (3 tabelas)",
        },
        {
          nome: "Análise de Prestadores por Categoria",
          endpoint: "GET /api/relatorios/analise-prestadores",
          descricao: "Estatísticas de prestadores agrupados por categoria (2 tabelas)",
        },
        {
          nome: "Ranking de Prestadores",
          endpoint: "GET /api/relatorios/ranking-prestadores",
          descricao: "Ranking com total de servicos e receita por prestador (2 tabelas)",
        },
      ],
      views: [
        {
          nome: "servicos Premium",
          endpoint: "GET /api/relatorios/views/servicos-premium",
          descricao: "servicos de prestadores com mais de 5 anos de experiência",
        },
        {
          nome: "Dashboard de Categorias",
          endpoint: "GET /api/relatorios/views/dashboard-categorias",
          descricao: "Visão consolidada de métricas por categoria",
        },
      ],
      stored_procedures: [
        {
          nome: "Cadastrar servico Completo",
          endpoint: "POST /api/relatorios/sp/cadastrar-servico",
          descricao: "Cadastra servico e retorna valor final calculado automaticamente",
        },
        {
          nome: "Relatório de Prestadores por Categoria",
          endpoint: "GET /api/relatorios/sp/prestadores-categoria/:id_categoria",
          descricao: "Gera relatório detalhado de prestadores (use 'todos' para todas as categorias)",
        },
      ],
      trigger: {
        nome: "Trigger de Auditoria",
        endpoint: "GET /api/relatorios/trigger/info",
        descricao: "Informações sobre o trigger que monitora alterações em servicos",
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao listar relatórios",
      error: error.message,
    });
  }
};
