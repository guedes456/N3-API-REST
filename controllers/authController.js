import jwt from "jsonwebtoken";
import Usuario from "../models/usuario_model.js";
import dotenv from "dotenv";

dotenv.config();

// Registrar novo usuário
export const registrar = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validação básica
    if (!username || !password) {
      return res.status(400).json({
        message: "Username e password são obrigatórios",
      });
    }

    // Verifica se usuário já existe
    const usuarioExistente = await Usuario.findOne({ where: { username } });
    if (usuarioExistente) {
      return res.status(400).json({
        message: "Usuário já existe",
      });
    }

    // Cria novo usuário (senha será criptografada automaticamente pelo hook)
    const novoUsuario = await Usuario.create({ username, password });

    res.status(201).json({
      message: "Usuário registrado com sucesso",
      usuario: {
        id: novoUsuario.id_usuario,
        username: novoUsuario.username,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao registrar usuário",
      error: error.message,
    });
  }
};

// Login - gera token JWT
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validação básica
    if (!username || !password) {
      return res.status(400).json({
        message: "Username e password são obrigatórios",
      });
    }

    // Busca usuário
    const usuario = await Usuario.findOne({ where: { username } });

    if (!usuario) {
      return res.status(401).json({
        auth: false,
        message: "Credenciais inválidas",
      });
    }

    // Verifica senha
    const senhaValida = await usuario.comparePassword(password);

    if (!senhaValida) {
      return res.status(401).json({
        auth: false,
        message: "Credenciais inválidas",
      });
    }

    // Gera token JWT
    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        username: usuario.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      }
    );

    res.json({
      auth: true,
      message: "Login realizado com sucesso",
      token: token,
      usuario: {
        id: usuario.id_usuario,
        username: usuario.username,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao fazer login",
      error: error.message,
    });
  }
};

// Logout
export const logout = (req, res) => {
  res.json({
    auth: false,
    token: null,
    message: "Logout realizado com sucesso",
  });
};
