import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Middleware para verificar JWT
export const verificarToken = (req, res, next) => {
  // Busca o token no header 'x-access-token' ou 'authorization'
  const token = req.headers['x-access-token'] || req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ 
      auth: false, 
      message: 'Token não fornecido. Acesso negado.' 
    });
  }

  try {
    // Remove 'Bearer ' se existir
    const tokenLimpo = token.startsWith('Bearer ') ? token.slice(7) : token;
    
    // Verifica e decodifica o token
    const decoded = jwt.verify(tokenLimpo, process.env.JWT_SECRET);
    
    // Adiciona informações do usuário na requisição
    req.userId = decoded.id;
    req.username = decoded.username;
    
    next();
  } catch (error) {
    return res.status(403).json({ 
      auth: false, 
      message: 'Token inválido ou expirado.',
      error: error.message 
    });
  }
};

export default verificarToken;