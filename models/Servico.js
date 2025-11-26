import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Prestador from './Prestador.js';

// Modelo do Serviço
const Servico = sequelize.define('Servico', {
  id_servico: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome_servico: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Nome do serviço não pode ser vazio'
      }
    }
  },
  vlr_servico: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 80.00,
    comment: 'Valor base por hora: R$ 80,00'
  },
  codigo_prestador: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'prestadores',
      key: 'codigo_prestador'
    }
  },
  vlr_final: {
    type: DataTypes.VIRTUAL,
    get() {
      // Calcula o valor final com base na experiência do prestador
      const valorBase = parseFloat(this.vlr_servico);
      const prestador = this.prestador;
      
      if (!prestador) return valorBase;
      
      const experiencia = prestador.tempo_experiencia;
      let acrescimo = 0;
      
      if (experiencia === 3) {
        acrescimo = 0.30; // 30%
      } else if (experiencia > 3 && experiencia <= 5) {
        acrescimo = 0.50; // 50%
      } else if (experiencia > 5) {
        acrescimo = 0.75; // 75%
      }
      
      return (valorBase + (valorBase * acrescimo)).toFixed(2);
    }
  }
}, {
  tableName: 'servicos',
  timestamps: true
});

// Relacionamento: Serviço pertence a um Prestador
Servico.belongsTo(Prestador, {
  foreignKey: 'codigo_prestador',
  as: 'prestador'
});

Prestador.hasMany(Servico, {
  foreignKey: 'codigo_prestador',
  as: 'servicos'
});

export default Servico;