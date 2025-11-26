import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script para criar o banco de dados automaticamente
 * Compatível com MySQL e MariaDB
 */

const setupDatabase = async () => {
  let connection;
  
  try {
    console.log('🔄 Iniciando setup do banco de dados...');
    console.log(`📍 Host: ${process.env.DB_HOST}`);
    console.log(`👤 Usuário: ${process.env.DB_USER}`);
    console.log(`🗄️  Banco: ${process.env.DB_NAME}`);
    
    // Conecta no MariaDB/MySQL SEM especificar o banco
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Conexão com MariaDB estabelecida!');

    // Cria o banco de dados se não existir
    const dbName = process.env.DB_NAME || 'prestadores_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✅ Banco de dados "${dbName}" criado/verificado com sucesso!`);

    // Usa o banco criado
    await connection.query(`USE \`${dbName}\``);
    console.log(`✅ Banco de dados "${dbName}" selecionado!`);

    // Verifica se o banco está usando UTF-8
    await connection.query(
      `ALTER DATABASE \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log('✅ Charset UTF-8 configurado!');

    console.log('\n🎉 Setup concluído com sucesso!');
    console.log('➡️  Agora você pode rodar: npm run dev\n');

  } catch (error) {
    console.error('\n❌ Erro no setup do banco de dados:');
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('🔒 Erro de autenticação! Verifique usuário e senha no arquivo .env');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🔌 MariaDB não está rodando! Inicie o serviço MariaDB.');
    } else {
      console.error(error.message);
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

// Executa o setup
setupDatabase();