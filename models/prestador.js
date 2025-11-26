import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Categoria from './Categoria.js';

// Modelo do Prestador de Serviço
const Prestador = sequelize.define('Prestador', {
  codigo_prestador: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome_prestador: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Nome do prestador não pode ser vazio'
      }
    }
  },
  tempo_experiencia: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'Tempo de experiência deve ser maior ou igual a 0'
      }
    },
    comment: 'Tempo de experiência em anos'
  },
  id_categoria: {
    type: DataTypes.INTEGER,
    allowNull: false,
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