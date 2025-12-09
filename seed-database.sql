-- Script para Popular o Banco de Dados com Dados de Teste
-- Execute este script DEPOIS de iniciar o servidor pela primeira vez

USE prestadores_db;

-- Limpar dados existentes
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE servicos;
TRUNCATE TABLE prestadores;
TRUNCATE TABLE categorias;
TRUNCATE TABLE usuarios;
SET FOREIGN_KEY_CHECKS = 1;

-- Inserir Categorias
INSERT INTO categorias (id_categoria, nome_categoria) VALUES
(1, 'Carpintaria'),
(2, 'Eletricista'),
(3, 'Encanador'),
(4, 'Pintor'),
(5, 'Pedreiro');

-- Inserir Prestadores
INSERT INTO prestadores (codigo_prestador, nome_prestador, tempo_experiencia, id_categoria) VALUES
-- Carpintaria
(1, 'Joao Silva', 3, 1),          -- 3 anos = +30%
(2, 'Pedro Alves', 2, 1),         -- 2 anos = 0%
(3, 'Lucas Martins', 6, 1),       -- 6 anos = +75%

-- Eletricista
(4, 'Maria Santos', 4, 2),        -- 4 anos = +50%
(5, 'Ana Costa', 5, 2),           -- 5 anos = +50%
(6, 'Carlos Eduardo', 8, 2),      -- 8 anos = +75%

-- Encanador
(7, 'Jose Oliveira', 3, 3),       -- 3 anos = +30%
(8, 'Roberto Lima', 7, 3),        -- 7 anos = +75%

-- Pintor
(9, 'Fernando Souza', 4, 4),      -- 4 anos = +50%
(10, 'Ricardo Gomes', 10, 4),     -- 10 anos = +75%

-- Pedreiro
(11, 'Antônio Dias', 3, 5),       -- 3 anos = +30%
(12, 'Marcos Pereira', 6, 5);     -- 6 anos = +75%

-- Inserir Servicos
-- Nota: vlr_servico padrao e R$ 80,00
-- O valor final será calculado automaticamente pela API
INSERT INTO servicos (id_servico, nome_servico, vlr_servico, codigo_prestador) VALUES
-- Servicos de Carpintaria
(1, 'Instalacao de Porta', 80.00, 1),
(2, 'Fabricacao de Móvel Planejado', 80.00, 1),
(3, 'Reparo em Janela', 80.00, 2),
(4, 'Construcao de Deck', 80.00, 3),

-- Servicos de Eletricista
(5, 'Instalacao Eletrica Residencial', 80.00, 4),
(6, 'Manutencao de Quadro Eletrico', 80.00, 4),
(7, 'Instalacao de Ar Condicionado', 80.00, 5),
(8, 'Projeto Eletrico Industrial', 80.00, 6),

-- Servicos de Encanador
(9, 'Reparo de Vazamento', 80.00, 7),
(10, 'Instalacao de Sistema Hidráulico', 80.00, 7),
(11, 'Desentupimento', 80.00, 8),
(12, 'Instalacao de Aquecedor', 80.00, 8),

-- Servicos de Pintor
(13, 'Pintura Residencial', 80.00, 9),
(14, 'Pintura Comercial', 80.00, 9),
(15, 'Textura e Grafiato', 80.00, 10),

-- Servicos de Pedreiro
(16, 'Construcao de Muro', 80.00, 11),
(17, 'Assentamento de Piso', 80.00, 11),
(18, 'Reforma Estrutural', 80.00, 12);