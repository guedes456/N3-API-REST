import { DataTypes } from 'sequelize';
import db from '../config/database.js';
import bcrypt from 'bcryptjs';

// Modelo de Usuário para autenticação JWT
const Usuario = db.define('Usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Username não pode ser vazio'
      },
      len: {
        args: [3, 50],
        msg: 'Username deve ter entre 3 e 50 caracteres'
      }
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Senha não pode ser vazia'
      }
    }
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
  hooks: {
    // Hook para criptografar senha antes de salvar
    beforeCreate: async (usuario) => {
      if (usuario.password) {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
      }
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
      }
    }
  }
});

// Método para comparar senha
Usuario.prototype.comparePassword = async function(senhaInformada) {
  return await bcrypt.compare(senhaInformada, this.password);
};

export default Usuario;