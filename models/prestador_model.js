import { DataTypes } from 'sequelize';
import db from '../config/database.js';
import Categoria from './categoria_model.js';

// Modelo do Prestador de Serviço
const Prestador = db.define('Prestador', {
  codigo_prestador: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome_prestador: {
    type: DataTypes.STRING(150),
    validate: {
      notEmpty: {
        msg: 'Nome do prestador não pode ser vazio'
      }
    }
  },
  tempo_experiencia: {
    type: DataTypes.INTEGER,
    validate: {
      min: {
        args: [0],
        msg: 'Tempo de experiência deve ser maior ou igual a 0'
      }
    },
  },
  id_categoria: {
    type: DataTypes.INTEGER,
    references: {
      model: 'categorias',
      key: 'id_categoria'
    }
  }
}, {
  tableName: 'prestadores',
  timestamps: true
});

// Relacionamento: Prestador pertence a uma Categoria
Prestador.belongsTo(Categoria, {
  foreignKey: 'id_categoria',
  as: 'categoria'
});

Categoria.hasMany(Prestador, {
  foreignKey: 'id_categoria',
  as: 'prestadores'
});

export default Prestador;