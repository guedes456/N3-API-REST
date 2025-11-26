-- Script para Popular o Banco de Dados com Dados de Teste
-- Execute este script DEPOIS de iniciar o servidor pela primeira vez

USE prestadores_db;

-- Limpar dados existentes (cuidado em produção!)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE servicos;
TRUNCATE TABLE prestadores;
TRUNCATE TABLE categorias;
TRUNCATE TABLE usuarios;
SET FOREIGN_KEY_CHECKS = 1;

-- Inserir Categorias
INSERT INTO categorias (id_categoria, nome_categoria, createdAt, updatedAt) VALUES
(1, 'Carpintaria', NOW(), NOW()),
(2, 'Eletricista', NOW(), NOW()),
(3, 'Encanador', NOW(), NOW()),
(4, 'Pintor', NOW(), NOW()),
(5, 'Pedreiro', NOW(), NOW());

-- Inserir Prestadores
-- Nota: tempo_experiencia varia para testar os diferentes acréscimos
INSERT INTO prestadores (codigo_prestador, nome_prestador, tempo_experiencia, id_categoria, createdAt, updatedAt) VALUES
-- Carpintaria
(1, 'João Silva', 3, 1, NOW(), NOW()),          -- 3 anos = +30%
(2, 'Pedro Alves', 2, 1, NOW(), NOW()),         -- 2 anos = 0%
(3, 'Lucas Martins', 6, 1, NOW(), NOW()),       -- 6 anos = +75%

-- Eletricista
(4, 'Maria Santos', 4, 2, NOW(), NOW()),        -- 4 anos = +50%
(5, 'Ana Costa', 5, 2, NOW(), NOW()),           -- 5 anos = +50%
(6, 'Carlos Eduardo', 8, 2, NOW(), NOW()),      -- 8 anos = +75%

-- Encanador
(7, 'José Oliveira', 3, 3, NOW(), NOW()),       -- 3 anos = +30%
(8, 'Roberto Lima', 7, 3, NOW(), NOW()),        -- 7 anos = +75%

-- Pintor
(9, 'Fernando Souza', 4, 4, NOW(), NOW()),      -- 4 anos = +50%
(10, 'Ricardo Gomes', 10, 4, NOW(), NOW()),     -- 10 anos = +75%

-- Pedreiro
(11, 'Antônio Dias', 3, 5, NOW(), NOW()),       -- 3 anos = +30%
(12, 'Marcos Pereira', 6, 5, NOW(), NOW());     -- 6 anos = +75%

-- Inserir Serviços
-- Nota: vlr_servico padrão é R$ 80,00
-- O valor final será calculado automaticamente pela API
INSERT INTO servicos (id_servico, nome_servico, vlr_servico, codigo_prestador, createdAt, updatedAt) VALUES
-- Serviços de Carpintaria
(1, 'Instalação de Porta', 80.00, 1, NOW(), NOW()),
(2, 'Fabricação de Móvel Planejado', 80.00, 1, NOW(), NOW()),
(3, 'Reparo em Janela', 80.00, 2, NOW(), NOW()),
(4, 'Construção de Deck', 80.00, 3, NOW(), NOW()),

-- Serviços de Eletricista
(5, 'Instalação Elétrica Residencial', 80.00, 4, NOW(), NOW()),
(6, 'Manutenção de Quadro Elétrico', 80.00, 4, NOW(), NOW()),
(7, 'Instalação de Ar Condicionado', 80.00, 5, NOW(), NOW()),
(8, 'Projeto Elétrico Industrial', 80.00, 6, NOW(), NOW()),

-- Serviços de Encanador
(9, 'Reparo de Vazamento', 80.00, 7, NOW(), NOW()),
(10, 'Instalação de Sistema Hidráulico', 80.00, 7, NOW(), NOW()),
(11, 'Desentupimento', 80.00, 8, NOW(), NOW()),
(12, 'Instalação de Aquecedor', 80.00, 8, NOW(), NOW()),

-- Serviços de Pintor
(13, 'Pintura Residencial', 80.00, 9, NOW(), NOW()),
(14, 'Pintura Comercial', 80.00, 9, NOW(), NOW()),
(15, 'Textura e Grafiato', 80.00, 10, NOW(), NOW()),

-- Serviços de Pedreiro
(16, 'Construção de Muro', 80.00, 11, NOW(), NOW()),
(17, 'Assentamento de Piso', 80.00, 11, NOW(), NOW()),
(18, 'Reforma Estrutural', 80.00, 12, NOW(), NOW());

-- Inserir Usuário de Teste
-- Senha: admin123 (já hashada com bcrypt)
-- Para criar novos usuários, use a API em /api/auth/registrar
INSERT INTO usuarios (id_usuario, username, password, createdAt, updatedAt) VALUES
(1, 'admin', '$2a$10$X9K7YvPxQc0/9PfRxA8xKerXnXzKGZZQxqcGQpPHGU8j3OXY2mFl6', NOW(), NOW());

-- Verificar os dados inseridos
SELECT 'CATEGORIAS INSERIDAS:' AS '---';
SELECT * FROM categorias;

SELECT 'PRESTADORES INSERIDOS:' AS '---';
SELECT p.codigo_prestador, p.nome_prestador, p.tempo_experiencia, c.nome_categoria 
FROM prestadores p 
JOIN categorias c ON p.id_categoria = c.id_categoria;

SELECT 'SERVIÇOS INSERIDOS:' AS '---';
SELECT s.id_servico, s.nome_servico, s.vlr_servico, p.nome_prestador, p.tempo_experiencia
FROM servicos s 
JOIN prestadores p ON s.codigo_prestador = p.codigo_prestador;

SELECT 'CÁLCULO DE VALORES FINAIS:' AS '---';
SELECT 
    s.id_servico,
    s.nome_servico,
    p.nome_prestador,
    p.tempo_experiencia,
    s.vlr_servico AS valor_base,
    CASE 
        WHEN p.tempo_experiencia = 3 THEN CONCAT('R$ ', FORMAT(s.vlr_servico * 1.30, 2), ' (+30%)')
        WHEN p.tempo_experiencia > 3 AND p.tempo_experiencia <= 5 THEN CONCAT('R$ ', FORMAT(s.vlr_servico * 1.50, 2), ' (+50%)')
        WHEN p.tempo_experiencia > 5 THEN CONCAT('R$ ', FORMAT(s.vlr_servico * 1.75, 2), ' (+75%)')
        ELSE CONCAT('R$ ', FORMAT(s.vlr_servico, 2), ' (+0%)')
    END AS valor_final_calculado
FROM servicos s
JOIN prestadores p ON s.codigo_prestador = p.codigo_prestador
ORDER BY p.tempo_experiencia;