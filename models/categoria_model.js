import { DataTypes } from 'sequelize';
import db from '../config/database.js';

// Modelo da Categoria (carpintaria, eletricista, encanador, etc)
const Categoria = db.define('Categoria', {
  id_categoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome_categoria: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Nome da categoria não pode ser vazio'
      }
    }
  }
}, {
  tableName: 'categorias',
});

export default Categoria;