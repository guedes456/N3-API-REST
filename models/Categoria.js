import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// Modelo da Categoria (carpintaria, eletricista, encanador, etc)
const Categoria = sequelize.define('Categoria', {
  id_categoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome_categoria: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Nome da categoria não pode ser vazio'
      }
    }
  }
}, {
  tableName: 'categorias',
  timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

export default Categoria;