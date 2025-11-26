import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';

// Importar modelos para sincronização
import Categoria from './models/Categoria.js';
import Prestador from './models/Prestador.js';
import Servico from './models/Servico.js';
import Usuario from './models/Usuario.js';

// Importar rotas
import authRoutes from './routes/authRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import prestadorRoutes from './routes/prestadorRoutes.js';
import servicoRoutes from './routes/servicoRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Habilita CORS para qualquer origem
app.use(express.json()); // Parser JSON
app.use(express.urlencoded({ extended: true })); // Parser URL-encoded

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'API Prestadores de Serviço - N3',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      categorias: '/api/categorias',
      prestadores: '/api/prestadores',
      servicos: '/api/servicos'
    },
    documentacao: {
      login: 'POST /api/auth/login',
      registrar: 'POST /api/auth/registrar',
      logout: 'POST /api/auth/logout'
    }
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/prestadores', prestadorRoutes);
app.use('/api/servicos', servicoRoutes);

// Middleware de erro 404
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Sincronizar banco de dados e iniciar servidor
const iniciarServidor = async () => {
  try {
    // Sincroniza os modelos com o banco (cria tabelas se não existirem)
    // force: false - não apaga dados existentes
    // alter: true - atualiza estrutura das tabelas
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Modelos sincronizados com o banco de dados!');

    // Inicia o servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`📚 Documentação: http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

iniciarServidor();