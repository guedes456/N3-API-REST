import Servico from "../models/servico_model.js";
import Prestador from "../models/prestador_model.js";
import Categoria from "../models/categoria_model.js";

// CREATE - Criar serviço
export const criarServico = async (req, res) => {
  try {
    const { nome_servico, codigo_prestador, vlr_servico } = req.body;

    // Verifica se o prestador existe
    const prestador = await Prestador.findByPk(codigo_prestador);
    if (!prestador) {
      return res.status(404).json({ message: "Prestador não encontrado" });
    }

    const servico = await Servico.create({
      nome_servico,
      codigo_prestador,
      vlr_servico: vlr_servico || 80.0, // Valor padrão R$ 80,00
    });

    // Retorna serviço com prestador para calcular vlr_final
    const servicoCompleto = await Servico.findByPk(servico.id_servico, {
      include: [
        {
          model: Prestador,
          as: "prestador",
          include: [{ model: Categoria, as: "categoria" }],
        },
      ],
    });

    res.status(201).json({
      message: "Serviço criado com sucesso",
      servico: {
        ...servicoCompleto.toJSON(),
        vlr_final: servicoCompleto.vlr_final,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao criar serviço",
      error: error.message,
    });
  }
};

// READ - Listar todos serviços
export const listarServicos = async (req, res) => {
  try {
    const servicos = await Servico.findAll({
      include: [
        {
          model: Prestador,
          as: "prestador",
          include: [{ model: Categoria, as: "categoria" }],
        },
      ],
    });

    // Adiciona vlr_final calculado em cada serviço
    const servicosComValorFinal = servicos.map((servico) => ({
      ...servico.toJSON(),
      vlr_final: servico.vlr_final,
    }));

    res.json(servicosComValorFinal);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao listar serviços",
      error: error.message,
    });
  }
};

// READ - Buscar serviço por ID
export const buscarServicoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const servico = await Servico.findByPk(id, {
      include: [
        {
          model: Prestador,
          as: "prestador",
          include: [{ model: Categoria, as: "categoria" }],
        },
      ],
    });

    if (!servico) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }

    res.json({
      ...servico.toJSON(),
      vlr_final: servico.vlr_final,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar serviço",
      error: error.message,
    });
  }
};

// READ - Buscar serviços por prestador (REQUISITO DO TRABALHO)
export const buscarServicosPorPrestador = async (req, res) => {
  try {
    const { codigo_prestador } = req.params;

    const servicos = await Servico.findAll({
      where: { codigo_prestador },
      include: [
        {
          model: Prestador,
          as: "prestador",
          include: [{ model: Categoria, as: "categoria" }],
        },
      ],
    });

    if (servicos.length === 0) {
      return res.status(404).json({
        message: "Nenhum serviço encontrado para este prestador",
      });
    }

    const servicosComValorFinal = servicos.map((servico) => ({
      ...servico.toJSON(),
      vlr_final: servico.vlr_final,
    }));

    res.json(servicosComValorFinal);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar serviços por prestador",
      error: error.message,
    });
  }
};

// UPDATE - Atualizar serviço
export const atualizarServico = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome_servico, codigo_prestador, vlr_servico } = req.body;

    const servico = await Servico.findByPk(id);

    if (!servico) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }

    // Se mudou prestador, verifica se existe
    if (codigo_prestador && codigo_prestador !== servico.codigo_prestador) {
      const prestador = await Prestador.findByPk(codigo_prestador);
      if (!prestador) {
        return res.status(404).json({ message: "Prestador não encontrado" });
      }
    }

    await servico.update({ nome_servico, codigo_prestador, vlr_servico });

    const servicoAtualizado = await Servico.findByPk(id, {
      include: [
        {
          model: Prestador,
          as: "prestador",
          include: [{ model: Categoria, as: "categoria" }],
        },
      ],
    });

    res.json({
      message: "Serviço atualizado com sucesso",
      servico: {
        ...servicoAtualizado.toJSON(),
        vlr_final: servicoAtualizado.vlr_final,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar serviço",
      error: error.message,
    });
  }
};

// DELETE - Deletar serviço
export const deletarServico = async (req, res) => {
  try {
    const { id } = req.params;

    const servico = await Servico.findByPk(id);

    if (!servico) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }

    await servico.destroy();

    res.json({ message: "Serviço deletado com sucesso" });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao deletar serviço",
      error: error.message,
    });
  }
};
