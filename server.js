import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/database.js';

// Importar rotas
import authRoutes from './routes/authRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import prestadorRoutes from './routes/prestadorRoutes.js';
import servicoRoutes from './routes/servicoRoutes.js';

dotenv.config();

const server = express();
const PORT = process.env.PORT || 3000;

// Middlewares
server.use(cors()); // Habilita CORS para qualquer origem
server.use(express.json()); // Parser JSON
server.use(express.urlencoded({ extended: true })); // Parser URL-encoded

// Rota raiz
server.get('/', (req, res) => {
  res.json({
    message: '🚀 Servidor rodando!'
  });
});

// Rotas da API
server.use('/api/auth', authRoutes);
server.use('/api/categorias', categoriaRoutes);
server.use('/api/prestadores', prestadorRoutes);
server.use('/api/servicos', servicoRoutes);

// Middleware de erro 404
server.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Sincronizar banco de dados e iniciar servidor
const iniciarServidor = async () => {
  try {
    // Sincroniza os modelos com o banco (cria tabelas se não existirem)
    // force: false - não apaga dados existentes
    // alter: true - atualiza estrutura das tabelas
    await db.sync({ force: false, alter: true });
    // console.log('✅ Modelos sincronizados com o banco de dados!');

    // Inicia o servidor
    server.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`📚 Endpoint teste: http://localhost:${PORT}/api/categorias`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

iniciarServidor();