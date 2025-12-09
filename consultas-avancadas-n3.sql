-- =============================================
-- SCRIPT SQL COMPLETO - N3
-- Sistema de Prestadores de Serviços
-- =============================================

USE prestadores_db;

-- =============================================
-- PARTE 1: TRÊS CONSULTAS COMPLEXAS
-- =============================================

-- CONSULTA 1: Relatório completo de serviços com informações de prestador, categoria e cálculo de valor final
-- Envolve 3 tabelas: servicos, prestadores, categorias
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
ORDER BY valor_final DESC, c.nome_categoria;


-- CONSULTA 2: Análise de prestadores por categoria com estatísticas de serviços
-- Envolve 2 tabelas: prestadores, categorias
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
ORDER BY total_prestadores DESC, media_experiencia DESC;


-- CONSULTA 3: Ranking de prestadores com quantidade e valor total de serviços
-- Envolve 2 tabelas: prestadores, servicos
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
ORDER BY total_servicos DESC, valor_total_servicos DESC;


-- =============================================
-- PARTE 2: DUAS VIEWS
-- =============================================

-- VIEW 1: Visão simplificada de serviços premium (experiência > 5 anos)
DROP VIEW IF EXISTS vw_servicos_premium;

CREATE VIEW vw_servicos_premium AS
SELECT 
    s.id_servico,
    s.nome_servico,
    p.nome_prestador,
    p.tempo_experiencia,
    c.nome_categoria,
    s.vlr_servico AS valor_base,
    ROUND(s.vlr_servico * 1.75, 2) AS valor_premium,
    CONCAT('R$ ', ROUND(s.vlr_servico * 1.75, 2)) AS valor_formatado,
    s.createdAt AS data_cadastro
FROM servicos s
INNER JOIN prestadores p ON s.codigo_prestador = p.codigo_prestador
INNER JOIN categorias c ON p.id_categoria = c.id_categoria
WHERE p.tempo_experiencia > 5
ORDER BY p.tempo_experiencia DESC, s.nome_servico;


-- VIEW 2: Dashboard de categorias com métricas consolidadas
DROP VIEW IF EXISTS vw_dashboard_categorias;

CREATE VIEW vw_dashboard_categorias AS
SELECT 
    c.id_categoria,
    c.nome_categoria,
    COUNT(DISTINCT p.codigo_prestador) AS total_prestadores,
    COUNT(s.id_servico) AS total_servicos,
    COALESCE(AVG(p.tempo_experiencia), 0) AS experiencia_media,
    COALESCE(AVG(s.vlr_servico), 0) AS valor_medio_base,
    COALESCE(SUM(
        CASE 
            WHEN p.tempo_experiencia = 3 THEN s.vlr_servico * 1.30
            WHEN p.tempo_experiencia > 3 AND p.tempo_experiencia <= 5 THEN s.vlr_servico * 1.50
            WHEN p.tempo_experiencia > 5 THEN s.vlr_servico * 1.75
            ELSE s.vlr_servico
        END
    ), 0) AS receita_total_estimada,
    CASE 
        WHEN COUNT(DISTINCT p.codigo_prestador) = 0 THEN 'Sem Prestadores'
        WHEN COUNT(DISTINCT p.codigo_prestador) BETWEEN 1 AND 3 THEN 'Baixa Demanda'
        WHEN COUNT(DISTINCT p.codigo_prestador) BETWEEN 4 AND 6 THEN 'Média Demanda'
        ELSE 'Alta Demanda'
    END AS nivel_demanda
FROM categorias c
LEFT JOIN prestadores p ON c.id_categoria = p.id_categoria
LEFT JOIN servicos s ON p.codigo_prestador = s.codigo_prestador
GROUP BY c.id_categoria, c.nome_categoria
ORDER BY total_prestadores DESC, receita_total_estimada DESC;


-- =============================================
-- PARTE 3: UM TRIGGER
-- =============================================

-- TRIGGER: Atualiza automaticamente campos de auditoria quando um serviço é modificado
DROP TRIGGER IF EXISTS trg_auditoria_servico_update;

DELIMITER $$

CREATE TRIGGER trg_auditoria_servico_update
BEFORE UPDATE ON servicos
FOR EACH ROW
BEGIN
    -- Atualiza o timestamp da última modificação
    SET NEW.updatedAt = CURRENT_TIMESTAMP;
    
    -- Se o valor do serviço foi alterado, garante que updatedAt seja atualizado
    IF OLD.vlr_servico != NEW.vlr_servico THEN
        SET NEW.updatedAt = CURRENT_TIMESTAMP;
    END IF;
END$$

DELIMITER ;


-- =============================================
-- PARTE 4: UMA STORED PROCEDURE
-- =============================================

-- PROCEDURE 1: Cadastra um novo serviço e retorna o valor final calculado
DROP PROCEDURE IF EXISTS sp_cadastrar_servico_completo;

DELIMITER $$

CREATE PROCEDURE sp_cadastrar_servico_completo(
    IN p_nome_servico VARCHAR(150),
    IN p_codigo_prestador INT,
    IN p_vlr_servico DECIMAL(5,2),
    OUT p_id_servico INT,
    OUT p_vlr_final DECIMAL(10,2),
    OUT p_tempo_experiencia INT,
    OUT p_mensagem VARCHAR(255)
)
BEGIN
    DECLARE v_tempo_experiencia INT;
    DECLARE v_existe_prestador INT;
    
    -- Verifica se o prestador existe
    SELECT COUNT(*) INTO v_existe_prestador
    FROM prestadores
    WHERE codigo_prestador = p_codigo_prestador;
    
    IF v_existe_prestador = 0 THEN
        SET p_mensagem = 'ERRO: Prestador não encontrado';
        SET p_id_servico = NULL;
        SET p_vlr_final = NULL;
        SET p_tempo_experiencia = NULL;
    ELSE
        -- Busca tempo de experiência do prestador
        SELECT tempo_experiencia INTO v_tempo_experiencia
        FROM prestadores
        WHERE codigo_prestador = p_codigo_prestador;
        
        -- Insere o serviço
        INSERT INTO servicos (nome_servico, codigo_prestador, vlr_servico, createdAt, updatedAt)
        VALUES (p_nome_servico, p_codigo_prestador, p_vlr_servico, NOW(), NOW());
        
        -- Retorna o ID do serviço criado
        SET p_id_servico = LAST_INSERT_ID();
        
        -- Calcula o valor final baseado na experiência
        SET p_tempo_experiencia = v_tempo_experiencia;
        
        IF v_tempo_experiencia = 3 THEN
            SET p_vlr_final = ROUND(p_vlr_servico * 1.30, 2);
        ELSEIF v_tempo_experiencia > 3 AND v_tempo_experiencia <= 5 THEN
            SET p_vlr_final = ROUND(p_vlr_servico * 1.50, 2);
        ELSEIF v_tempo_experiencia > 5 THEN
            SET p_vlr_final = ROUND(p_vlr_servico * 1.75, 2);
        ELSE
            SET p_vlr_final = p_vlr_servico;
        END IF;
        
        SET p_mensagem = 'Serviço cadastrado com sucesso!';
    END IF;
END$$

DELIMITER ;


-- =============================================
-- STORED PROCEDURE ADICIONAL (BÔNUS)
-- =============================================

-- PROCEDURE 2: Relatório de prestadores por categoria
DROP PROCEDURE IF EXISTS sp_relatorio_prestadores_categoria;

DELIMITER $$

CREATE PROCEDURE sp_relatorio_prestadores_categoria(
    IN p_id_categoria INT
)
BEGIN
    SELECT 
        p.codigo_prestador,
        p.nome_prestador,
        p.tempo_experiencia,
        c.nome_categoria,
        COUNT(s.id_servico) AS total_servicos,
        COALESCE(AVG(s.vlr_servico), 0) AS valor_medio_servico,
        CASE 
            WHEN p.tempo_experiencia <= 3 THEN 'Júnior'
            WHEN p.tempo_experiencia > 3 AND p.tempo_experiencia <= 5 THEN 'Pleno'
            ELSE 'Sênior'
        END AS nivel_profissional,
        p.createdAt AS data_cadastro
    FROM prestadores p
    INNER JOIN categorias c ON p.id_categoria = c.id_categoria
    LEFT JOIN servicos s ON p.codigo_prestador = s.codigo_prestador
    WHERE p.id_categoria = p_id_categoria OR p_id_categoria IS NULL
    GROUP BY p.codigo_prestador, p.nome_prestador, p.tempo_experiencia, c.nome_categoria, p.createdAt
    ORDER BY p.tempo_experiencia DESC, total_servicos DESC;
END$$

DELIMITER ;


-- =============================================
-- EXEMPLOS DE USO
-- =============================================

-- Para testar a VIEW 1 (Serviços Premium):
-- SELECT * FROM vw_servicos_premium;

-- Para testar a VIEW 2 (Dashboard de Categorias):
-- SELECT * FROM vw_dashboard_categorias;

-- Para testar a Stored Procedure de cadastro:
-- CALL sp_cadastrar_servico_completo('Instalação Elétrica Residencial', 1, 80.00, @id, @vlr_final, @exp, @msg);
-- SELECT @id AS id_servico, @vlr_final AS valor_final, @exp AS experiencia, @msg AS mensagem;

-- Para testar a Stored Procedure de relatório:
-- CALL sp_relatorio_prestadores_categoria(1); -- Para uma categoria específica
-- CALL sp_relatorio_prestadores_categoria(NULL); -- Para todas as categorias

-- Para testar o Trigger:
-- UPDATE servicos SET vlr_servico = 100.00 WHERE id_servico = 1;
-- SELECT updatedAt FROM servicos WHERE id_servico = 1; -- Verá que foi atualizado automaticamente


-- =============================================
-- VERIFICAÇÕES
-- =============================================

-- Verificar se as views foram criadas:
SHOW FULL TABLES WHERE TABLE_TYPE LIKE 'VIEW';

-- Verificar se o trigger foi criado:
SHOW TRIGGERS WHERE `Table` = 'servicos';

-- Verificar se as stored procedures foram criadas:
SHOW PROCEDURE STATUS WHERE Db = 'prestadores_db';
