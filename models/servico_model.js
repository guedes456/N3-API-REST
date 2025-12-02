import { DataTypes } from "sequelize";
import db from "../config/database.js";
import Prestador from "./prestador_model.js";

// Modelo do Serviço
const Servico = db.define(
  "Servico",
  {
    id_servico: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome_servico: {
      type: DataTypes.STRING(150),
      validate: {
        notEmpty: {
          msg: "Nome do serviço não pode ser vazio",
        },
      },
    },
    vlr_servico: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 80.0,
    },
    codigo_prestador: {
      type: DataTypes.INTEGER,
      references: {
        model: "prestadores",
        key: "codigo_prestador",
      },
    },
    vlr_final: {
      type: DataTypes.VIRTUAL,
      get() {
        const valorBase = parseFloat(this.vlr_servico);
        const prestador = this.prestador;

        if (!prestador) return valorBase;

        const experiencia = prestador.tempo_experiencia;
        let acrescimo = 0;

        if (experiencia === 3) {
          acrescimo = 0.3; // 30%
        } else if (experiencia > 3 && experiencia <= 5) {
          acrescimo = 0.5; // 50%
        } else if (experiencia > 5) {
          acrescimo = 0.75; // 75%
        }

        return (valorBase + valorBase * acrescimo).toFixed(2);
      },
    },
  },
  {
    tableName: "servicos",
    timestamps: true,
  }
);

// Relacionamento: Serviço pertence a um Prestador
Servico.belongsTo(Prestador, {
  foreignKey: "codigo_prestador",
  as: "prestador",
});

Prestador.hasMany(Servico, {
  foreignKey: "codigo_prestador",
  as: "servicos",
});

export default Servico;
