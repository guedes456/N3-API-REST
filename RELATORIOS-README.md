# 📊 Documentação dos Endpoints de Relatórios - N3

## 🚀 Como Usar

### 1. Execute o script SQL primeiro:
```bash
mysql -u root -p prestadores_db < consultas-avancadas-n3.sql
```

### 2. Inicie o servidor:
```bash
npm start
```

### 3. Acesse a lista de relatórios disponíveis:
```
GET http://localhost:3000/api/relatorios
```

---

## 📋 Endpoints Disponíveis

### 🔍 **CONSULTAS COMPLEXAS**

#### 1. Relatório Completo de Serviços (3 tabelas)
```http
GET /api/relatorios/servicos-completo
```

**Descrição:** Lista todos os serviços com informações de prestador, categoria e valor final calculado.

**Tabelas envolvidas:** `servicos`, `prestadores`, `categorias`

**Exemplo de Response:**
```json
{
  "message": "Relatório completo de serviços gerado com sucesso",
  "total": 18,
  "dados": [
    {
      "id_servico": 8,
      "nome_servico": "Projeto Elétrico Industrial",
      "valor_base": "80.00",
      "codigo_prestador": 6,
      "nome_prestador": "Carlos Eduardo",
      "tempo_experiencia": 8,
      "id_categoria": 2,
      "nome_categoria": "Eletricista",
      "valor_final": "140.00",
      "percentual_acrescimo": "75%",
      "data_criacao_servico": "2024-12-09T..."
    }
  ]
}
```

---

#### 2. Análise de Prestadores por Categoria (2 tabelas)
```http
GET /api/relatorios/analise-prestadores
```

**Descrição:** Estatísticas de prestadores agrupados por categoria.

**Tabelas envolvidas:** `prestadores`, `categorias`

**Exemplo de Response:**
```json
{
  "message": "Análise de prestadores por categoria gerada com sucesso",
  "total_categorias": 5,
  "dados": [
    {
      "id_categoria": 2,
      "nome_categoria": "Eletricista",
      "total_prestadores": 3,
      "media_experiencia": 5.6667,
      "menor_experiencia": 4,
      "maior_experiencia": 8,
      "lista_prestadores": "Carlos Eduardo, Ana Costa, Maria Santos"
    }
  ]
}
```

---

#### 3. Ranking de Prestadores (2 tabelas)
```http
GET /api/relatorios/ranking-prestadores
```

**Descrição:** Ranking com total de serviços e receita por prestador.

**Tabelas envolvidas:** `prestadores`, `servicos`

**Exemplo de Response:**
```json
{
  "message": "Ranking de prestadores gerado com sucesso",
  "total": 12,
  "dados": [
    {
      "codigo_prestador": 1,
      "nome_prestador": "João Silva",
      "tempo_experiencia": 3,
      "total_servicos": 4,
      "valor_medio_servico": 80.00,
      "valor_total_servicos": 416.00,
      "nivel_experiencia": "Júnior"
    }
  ]
}
```

---

### 👁️ **VIEWS**

#### 1. Serviços Premium
```http
GET /api/relatorios/views/servicos-premium
```

**Descrição:** Lista serviços de prestadores com mais de 5 anos de experiência.

**Exemplo de Response:**
```json
{
  "message": "Serviços premium listados com sucesso",
  "total": 8,
  "dados": [
    {
      "id_servico": 4,
      "nome_servico": "Construção de Deck",
      "nome_prestador": "Lucas Martins",
      "tempo_experiencia": 6,
      "nome_categoria": "Carpintaria",
      "valor_base": "80.00",
      "valor_premium": "140.00",
      "valor_formatado": "R$ 140.00",
      "data_cadastro": "2024-12-09T..."
    }
  ]
}
```

---

#### 2. Dashboard de Categorias
```http
GET /api/relatorios/views/dashboard-categorias
```

**Descrição:** Visão consolidada de métricas por categoria.

**Exemplo de Response:**
```json
{
  "message": "Dashboard de categorias gerado com sucesso",
  "total_categorias": 5,
  "dados": [
    {
      "id_categoria": 2,
      "nome_categoria": "Eletricista",
      "total_prestadores": 3,
      "total_servicos": 4,
      "experiencia_media": 5.6667,
      "valor_medio_base": 80.0000,
      "receita_total_estimada": 520.00,
      "nivel_demanda": "Baixa Demanda"
    }
  ]
}
```

---

### 🔧 **STORED PROCEDURES**

#### 1. Cadastrar Serviço Completo
```http
POST /api/relatorios/sp/cadastrar-servico
```

**Descrição:** Cadastra um novo serviço e retorna o valor final calculado automaticamente.

**Body (JSON):**
```json
{
  "nome_servico": "Manutenção Preventiva",
  "codigo_prestador": 6,
  "vlr_servico": 150.00
}
```

**Exemplo de Response:**
```json
{
  "message": "Serviço cadastrado com sucesso!",
  "servico": {
    "id_servico": 19,
    "nome_servico": "Manutenção Preventiva",
    "codigo_prestador": 6,
    "vlr_servico": 150,
    "vlr_final": 262.5,
    "tempo_experiencia": 8
  }
}
```

**Erro (Prestador não encontrado):**
```json
{
  "message": "ERRO: Prestador não encontrado"
}
```

---

#### 2. Relatório de Prestadores por Categoria
```http
GET /api/relatorios/sp/prestadores-categoria/:id_categoria
```

**Descrição:** Gera relatório detalhado de prestadores por categoria.

**Parâmetros:**
- `:id_categoria` - ID da categoria (use `"todos"` para listar todas)

**Exemplos:**
```http
GET /api/relatorios/sp/prestadores-categoria/2
GET /api/relatorios/sp/prestadores-categoria/todos
```

**Exemplo de Response:**
```json
{
  "message": "Relatório de prestadores gerado com sucesso",
  "categoria_filtrada": "ID 2",
  "total": 3,
  "dados": [
    {
      "codigo_prestador": 6,
      "nome_prestador": "Carlos Eduardo",
      "tempo_experiencia": 8,
      "nome_categoria": "Eletricista",
      "total_servicos": 1,
      "valor_medio_servico": 80.0000,
      "nivel_profissional": "Sênior",
      "data_cadastro": "2024-12-09T..."
    }
  ]
}
```

---

### ⚡ **TRIGGER**

#### Informações sobre o Trigger
```http
GET /api/relatorios/trigger/info
```

**Descrição:** Retorna informações sobre o trigger de auditoria.

**Exemplo de Response:**
```json
{
  "message": "Informações sobre o Trigger de Auditoria",
  "trigger": {
    "nome": "trg_auditoria_servico_update",
    "tabela": "servicos",
    "evento": "BEFORE UPDATE",
    "descricao": "Atualiza automaticamente o campo updatedAt quando um serviço é modificado",
    "funcionamento": [
      "Monitora alterações na tabela servicos",
      "Atualiza o timestamp updatedAt automaticamente",
      "Registra quando o valor do serviço (vlr_servico) é alterado"
    ]
  },
  "exemplo": {
    "acao": "UPDATE servicos SET vlr_servico = 100 WHERE id_servico = 1",
    "resultado": "O trigger atualizará automaticamente o campo updatedAt para NOW()"
  }
}
```

**Como testar o trigger:**
1. Atualize um serviço usando o endpoint PUT normal:
```http
PUT /api/servicos/1
Content-Type: application/json
Authorization: Bearer {seu_token}

{
  "vlr_servico": 100.00
}
```

2. O campo `updatedAt` será atualizado automaticamente pelo trigger!

---

### 📑 **ENDPOINT DE LISTA**

#### Listar Todos os Relatórios Disponíveis
```http
GET /api/relatorios
```

**Descrição:** Lista todos os endpoints de relatórios, views, stored procedures e trigger disponíveis.

---

## 🧪 **Testando os Endpoints**

### Usando cURL:

```bash
# Relatório completo de serviços
curl http://localhost:3000/api/relatorios/servicos-completo

# View de serviços premium
curl http://localhost:3000/api/relatorios/views/servicos-premium

# Cadastrar serviço via stored procedure
curl -X POST http://localhost:3000/api/relatorios/sp/cadastrar-servico \
  -H "Content-Type: application/json" \
  -d '{"nome_servico": "Teste", "codigo_prestador": 1, "vlr_servico": 80}'

# Relatório por categoria
curl http://localhost:3000/api/relatorios/sp/prestadores-categoria/todos
```

### Usando Thunder Client / Postman:

1. Importe a coleção ou crie manualmente as requisições
2. Para endpoints GET, basta fazer a requisição
3. Para POST (cadastrar serviço), adicione o body JSON

---

## 📊 **Estrutura dos Dados**

### Cálculo do Valor Final:
- **3 anos de experiência**: +30% (valor × 1.30)
- **4-5 anos de experiência**: +50% (valor × 1.50)
- **Mais de 5 anos**: +75% (valor × 1.75)
- **Menos de 3 anos**: Sem acréscimo

### Classificação de Nível:
- **Júnior**: 0-3 anos
- **Pleno**: 4-5 anos
- **Sênior**: Mais de 5 anos

### Nível de Demanda:
- **Sem Prestadores**: 0 prestadores
- **Baixa Demanda**: 1-3 prestadores
- **Média Demanda**: 4-6 prestadores
- **Alta Demanda**: Mais de 6 prestadores

---

## ✅ **Checklist de Implementação**

- [x] ✅ **3 Consultas Complexas** (1 com 3 tabelas, 2 com 2 tabelas cada)
- [x] ✅ **2 Views** (vw_servicos_premium, vw_dashboard_categorias)
- [x] ✅ **1 Trigger** (trg_auditoria_servico_update)
- [x] ✅ **1 Stored Procedure** (sp_cadastrar_servico_completo)
- [x] ✅ **Bônus**: Stored Procedure adicional (sp_relatorio_prestadores_categoria)
- [x] ✅ **Endpoints da API** para todas as funcionalidades
- [x] ✅ **Documentação completa**

---

## 🎯 **Requisitos do Trabalho N3 - Atendidos**

1. ✅ **Três Consultas Complexas**:
   - Consulta 1: `servicos_completo` (3 tabelas)
   - Consulta 2: `analise_prestadores` (2 tabelas)
   - Consulta 3: `ranking_prestadores` (2 tabelas)

2. ✅ **Duas Views**:
   - View 1: `vw_servicos_premium`
   - View 2: `vw_dashboard_categorias`

3. ✅ **Um Trigger**:
   - `trg_auditoria_servico_update` (BEFORE UPDATE)

4. ✅ **Uma Stored Procedure**:
   - `sp_cadastrar_servico_completo` (com parâmetros IN e OUT)

---

## 🚀 **Próximos Passos**

1. Execute o script SQL: `consultas-avancadas-n3.sql`
2. Inicie o servidor: `npm start`
3. Teste os endpoints usando Thunder Client, Postman ou cURL
4. Documente seus testes e resultados

---

## 📝 **Observações**

- Todos os endpoints de relatórios estão sob `/api/relatorios`
- As consultas são executadas diretamente no banco de dados via `db.query()`
- As views são tabelas virtuais que podem ser consultadas como tabelas normais
- O trigger é executado automaticamente pelo MySQL, sem necessidade de chamada manual
- As stored procedures encapsulam lógica complexa e podem ser reutilizadas

---

**Desenvolvido para o Trabalho N3 - Banco de Dados**
