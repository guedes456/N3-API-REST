# 🚀 Guia Rápido - Setup dos Endpoints de Relatórios N3

## ⚡ Passos Rápidos

### 1️⃣ Execute o Script SQL
```bash
# No terminal/CMD, navegue até a pasta do projeto
cd C:\Users\Pichau\Desktop\N3-API-REST

# Execute o script SQL no MySQL
mysql -u root -p prestadores_db < consultas-avancadas-n3.sql
```

**OU** copie e cole o conteúdo do arquivo `consultas-avancadas-n3.sql` diretamente no MySQL Workbench.

---

### 2️⃣ Verifique se tudo foi criado corretamente

Abra o MySQL e execute:

```sql
USE prestadores_db;

-- Verificar views
SHOW FULL TABLES WHERE TABLE_TYPE LIKE 'VIEW';
-- Deve mostrar: vw_servicos_premium, vw_dashboard_categorias

-- Verificar trigger
SHOW TRIGGERS WHERE `Table` = 'servicos';
-- Deve mostrar: trg_auditoria_servico_update

-- Verificar stored procedures
SHOW PROCEDURE STATUS WHERE Db = 'prestadores_db';
-- Deve mostrar: sp_cadastrar_servico_completo, sp_relatorio_prestadores_categoria
```

---

### 3️⃣ Inicie o Servidor
```bash
npm start
```

Você deve ver:
```
🚀 Servidor rodando na porta 3000
📍 URL: http://localhost:3000
📚 Endpoint teste: http://localhost:3000/api/categorias
```

---

### 4️⃣ Teste Rapidamente

Abra o navegador ou use cURL:

```
http://localhost:3000/api/relatorios
```

Você verá a lista completa de todos os endpoints disponíveis!

---

## 📋 Endpoints Principais

### Consultas Complexas:
- `GET /api/relatorios/servicos-completo` - 3 tabelas
- `GET /api/relatorios/analise-prestadores` - 2 tabelas
- `GET /api/relatorios/ranking-prestadores` - 2 tabelas

### Views:
- `GET /api/relatorios/views/servicos-premium`
- `GET /api/relatorios/views/dashboard-categorias`

### Stored Procedures:
- `POST /api/relatorios/sp/cadastrar-servico`
- `GET /api/relatorios/sp/prestadores-categoria/:id_categoria`

### Trigger:
- `GET /api/relatorios/trigger/info` (informações)
- O trigger funciona automaticamente ao atualizar um serviço

---

## 🧪 Teste Rápido no Navegador

1. Abra: `http://localhost:3000/api/relatorios/servicos-completo`
2. Você deve ver um JSON com todos os serviços e cálculos!

---

## 📁 Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| `consultas-avancadas-n3.sql` | Script SQL completo (views, trigger, procedures) |
| `controllers/relatoriosController.js` | Controller com todas as funções |
| `routes/relatoriosRoutes.js` | Rotas dos endpoints |
| `RELATORIOS-README.md` | Documentação completa |
| `TESTES-EXEMPLOS.md` | Exemplos de testes |
| `GUIA-RAPIDO.md` | Este arquivo |

---

## ✅ Checklist Rápido

- [ ] Script SQL executado
- [ ] Views criadas (2)
- [ ] Trigger criado (1)
- [ ] Stored Procedures criadas (2)
- [ ] Servidor iniciado
- [ ] Endpoint `/api/relatorios` respondendo
- [ ] Testes básicos funcionando

---

## ❓ Problemas Comuns

### Erro: "View already exists"
**Solução:** O script já faz DROP VIEW IF EXISTS, mas se persistir:
```sql
DROP VIEW IF EXISTS vw_servicos_premium;
DROP VIEW IF EXISTS vw_dashboard_categorias;
```

### Erro: "Procedure already exists"
**Solução:** O script já faz DROP PROCEDURE IF EXISTS, mas se persistir:
```sql
DROP PROCEDURE IF EXISTS sp_cadastrar_servico_completo;
DROP PROCEDURE IF EXISTS sp_relatorio_prestadores_categoria;
```

### Erro: "Cannot import relatoriosRoutes"
**Solução:** Verifique se o arquivo foi criado corretamente em `routes/relatoriosRoutes.js`

---

## 📚 Documentação Completa

Para mais detalhes, veja:
- `RELATORIOS-README.md` - Documentação completa de todos os endpoints
- `TESTES-EXEMPLOS.md` - Exemplos práticos de testes

---

## 🎯 Requisitos do N3 - Status

✅ **Três Consultas SQL Complexas**
- Consulta 1: 3 tabelas (servicos, prestadores, categorias)
- Consulta 2: 2 tabelas (prestadores, categorias)
- Consulta 3: 2 tabelas (prestadores, servicos)

✅ **Duas Views**
- vw_servicos_premium
- vw_dashboard_categorias

✅ **Um Trigger**
- trg_auditoria_servico_update (BEFORE UPDATE)

✅ **Uma Stored Procedure**
- sp_cadastrar_servico_completo (com parâmetros IN e OUT)

✅ **Bônus**
- Stored Procedure adicional
- Endpoints completos na API
- Documentação detalhada

---

**🎉 Tudo pronto! Boa sorte no N3!**
