# 🧪 Exemplos de Testes - Endpoints de Relatórios N3

## 📋 Preparação

### 1. Execute o script SQL:
```bash
mysql -u root -p prestadores_db < consultas-avancadas-n3.sql
```

### 2. Inicie o servidor:
```bash
npm start
```

---

## 🔍 TESTES DAS CONSULTAS COMPLEXAS

### Teste 1: Relatório Completo de Serviços (3 tabelas)
```bash
curl http://localhost:3000/api/relatorios/servicos-completo
```

**Resultado Esperado:**
- Status: 200 OK
- Lista com todos os serviços incluindo:
  - Nome do serviço
  - Prestador e tempo de experiência
  - Categoria
  - Valor base e valor final calculado
  - Percentual de acréscimo

---

### Teste 2: Análise de Prestadores por Categoria (2 tabelas)
```bash
curl http://localhost:3000/api/relatorios/analise-prestadores
```

**Resultado Esperado:**
- Status: 200 OK
- Estatísticas por categoria:
  - Total de prestadores
  - Média de experiência
  - Menor e maior experiência
  - Lista de prestadores

---

### Teste 3: Ranking de Prestadores (2 tabelas)
```bash
curl http://localhost:3000/api/relatorios/ranking-prestadores
```

**Resultado Esperado:**
- Status: 200 OK
- Ranking com:
  - Total de serviços por prestador
  - Valor médio dos serviços
  - Receita total estimada
  - Nível de experiência (Júnior/Pleno/Sênior)

---

## 👁️ TESTES DAS VIEWS

### Teste 4: View - Serviços Premium
```bash
curl http://localhost:3000/api/relatorios/views/servicos-premium
```

**Resultado Esperado:**
- Status: 200 OK
- Apenas serviços de prestadores com experiência > 5 anos
- Valores premium calculados (acréscimo de 75%)

---

### Teste 5: View - Dashboard de Categorias
```bash
curl http://localhost:3000/api/relatorios/views/dashboard-categorias
```

**Resultado Esperado:**
- Status: 200 OK
- Métricas consolidadas por categoria:
  - Total de prestadores e serviços
  - Média de experiência
  - Receita total estimada
  - Nível de demanda

---

## 🔧 TESTES DAS STORED PROCEDURES

### Teste 6: Cadastrar Serviço Completo (Sucesso)
```bash
curl -X POST http://localhost:3000/api/relatorios/sp/cadastrar-servico \
  -H "Content-Type: application/json" \
  -d '{
    "nome_servico": "Instalação de Sistema de Segurança",
    "codigo_prestador": 6,
    "vlr_servico": 120.00
  }'
```

**Resultado Esperado:**
- Status: 201 Created
- Serviço cadastrado com sucesso
- Valor final calculado automaticamente: R$ 210.00 (120 × 1.75)
- Tempo de experiência: 8 anos

---

### Teste 7: Cadastrar Serviço (Erro - Prestador Inexistente)
```bash
curl -X POST http://localhost:3000/api/relatorios/sp/cadastrar-servico \
  -H "Content-Type: application/json" \
  -d '{
    "nome_servico": "Serviço Teste",
    "codigo_prestador": 999,
    "vlr_servico": 80.00
  }'
```

**Resultado Esperado:**
- Status: 404 Not Found
- Mensagem: "ERRO: Prestador não encontrado"

---

### Teste 8: Relatório de Prestadores por Categoria Específica
```bash
# Categoria Eletricista (ID 2)
curl http://localhost:3000/api/relatorios/sp/prestadores-categoria/2
```

**Resultado Esperado:**
- Status: 200 OK
- Lista apenas prestadores da categoria Eletricista
- Informações detalhadas de cada prestador

---

### Teste 9: Relatório de Todas as Categorias
```bash
curl http://localhost:3000/api/relatorios/sp/prestadores-categoria/todos
```

**Resultado Esperado:**
- Status: 200 OK
- Lista prestadores de todas as categorias

---

## ⚡ TESTE DO TRIGGER

### Teste 10: Verificar Trigger em Ação

**Passo 1:** Obtenha um token de autenticação:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Passo 2:** Veja o `updatedAt` atual do serviço:
```bash
curl http://localhost:3000/api/servicos/1
```

**Passo 3:** Atualize o valor do serviço:
```bash
curl -X PUT http://localhost:3000/api/servicos/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "vlr_servico": 95.00
  }'
```

**Passo 4:** Verifique que o `updatedAt` foi atualizado automaticamente:
```bash
curl http://localhost:3000/api/servicos/1
```

**Resultado Esperado:**
- O campo `updatedAt` deve ter sido atualizado automaticamente pelo trigger
- Mesmo que você não tenha passado esse campo no body

---

## 📑 TESTE DO ENDPOINT DE LISTA

### Teste 11: Listar Todos os Relatórios Disponíveis
```bash
curl http://localhost:3000/api/relatorios
```

**Resultado Esperado:**
- Status: 200 OK
- Lista completa de todos os endpoints disponíveis
- Descrição de cada endpoint

---

## 🧪 TESTES DIRETOS NO MYSQL

### Verificar as Views criadas:
```sql
USE prestadores_db;

-- Ver serviços premium
SELECT * FROM vw_servicos_premium;

-- Ver dashboard
SELECT * FROM vw_dashboard_categorias;
```

### Testar a Stored Procedure no MySQL:
```sql
-- Cadastrar um novo serviço
CALL sp_cadastrar_servico_completo(
  'Consultoria Técnica', 
  4, 
  150.00, 
  @id, 
  @vlr_final, 
  @exp, 
  @msg
);

-- Ver o resultado
SELECT 
  @id AS id_servico, 
  @vlr_final AS valor_final, 
  @exp AS experiencia, 
  @msg AS mensagem;
```

### Testar o Trigger no MySQL:
```sql
-- Ver updatedAt antes
SELECT id_servico, vlr_servico, updatedAt 
FROM servicos 
WHERE id_servico = 1;

-- Esperar alguns segundos e atualizar
UPDATE servicos 
SET vlr_servico = 85.00 
WHERE id_servico = 1;

-- Ver updatedAt depois (foi atualizado automaticamente!)
SELECT id_servico, vlr_servico, updatedAt 
FROM servicos 
WHERE id_servico = 1;
```

---

## 📊 TESTES DE VALIDAÇÃO

### Teste 12: Campos Obrigatórios
```bash
# Tentar cadastrar sem nome_servico
curl -X POST http://localhost:3000/api/relatorios/sp/cadastrar-servico \
  -H "Content-Type: application/json" \
  -d '{
    "codigo_prestador": 1
  }'
```

**Resultado Esperado:**
- Status: 400 Bad Request
- Mensagem de erro sobre campos obrigatórios

---

### Teste 13: Verificar Cálculos

**Prestador com 3 anos (30% de acréscimo):**
```bash
curl -X POST http://localhost:3000/api/relatorios/sp/cadastrar-servico \
  -H "Content-Type: application/json" \
  -d '{
    "nome_servico": "Teste 3 anos",
    "codigo_prestador": 1,
    "vlr_servico": 100.00
  }'
```
**Resultado esperado:** vlr_final = 130.00

**Prestador com 4-5 anos (50% de acréscimo):**
```bash
curl -X POST http://localhost:3000/api/relatorios/sp/cadastrar-servico \
  -H "Content-Type: application/json" \
  -d '{
    "nome_servico": "Teste 4-5 anos",
    "codigo_prestador": 4,
    "vlr_servico": 100.00
  }'
```
**Resultado esperado:** vlr_final = 150.00

**Prestador com +5 anos (75% de acréscimo):**
```bash
curl -X POST http://localhost:3000/api/relatorios/sp/cadastrar-servico \
  -H "Content-Type: application/json" \
  -d '{
    "nome_servico": "Teste +5 anos",
    "codigo_prestador": 6,
    "vlr_servico": 100.00
  }'
```
**Resultado esperado:** vlr_final = 175.00

---

## ✅ CHECKLIST DE TESTES

Execute cada teste e marque:

- [ ] Teste 1: Relatório Completo de Serviços ✅
- [ ] Teste 2: Análise de Prestadores ✅
- [ ] Teste 3: Ranking de Prestadores ✅
- [ ] Teste 4: View Serviços Premium ✅
- [ ] Teste 5: View Dashboard Categorias ✅
- [ ] Teste 6: SP Cadastrar Serviço (Sucesso) ✅
- [ ] Teste 7: SP Cadastrar Serviço (Erro) ✅
- [ ] Teste 8: SP Relatório por Categoria ✅
- [ ] Teste 9: SP Relatório Todas Categorias ✅
- [ ] Teste 10: Trigger Auditoria ✅
- [ ] Teste 11: Lista de Relatórios ✅
- [ ] Teste 12: Validação de Campos ✅
- [ ] Teste 13: Verificar Cálculos ✅

---

## 🎯 RESULTADOS ESPERADOS FINAIS

Após executar todos os testes, você deve ter:

1. ✅ 3 consultas complexas funcionando
2. ✅ 2 views retornando dados corretamente
3. ✅ 1 trigger atualizando campos automaticamente
4. ✅ 1 stored procedure cadastrando com cálculos
5. ✅ Todos os endpoints respondendo corretamente
6. ✅ Validações de erro funcionando

---

## 📸 DICAS PARA DOCUMENTAÇÃO

1. Tire screenshots dos resultados de cada teste
2. Salve os JSONs de resposta
3. Documente qualquer erro encontrado
4. Anote o tempo de execução de cada consulta

---

**Boa sorte nos testes! 🚀**
