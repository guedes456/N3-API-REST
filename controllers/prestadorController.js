import Prestador from "../models/prestador_model.js";
import Categoria from "../models/categoria_model.js";
import Servico from "../models/servico_model.js";

// CREATE - Criar prestador
export const criarPrestador = async (req, res) => {
  try {
    const { nome_prestador, tempo_experiencia, id_categoria } = req.body;
    if (!nome_prestador || !tempo_experiencia || !id_categoria) {
      return res.status(400).json({ message: "nome_prestador, tempo_experiencia e id_categoria são obrigatórios" });
    }
    // Verifica se a categoria existe
    const categoria = await Categoria.findByPk(id_categoria);
    if (!categoria) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    const prestador = await Prestador.create({
      nome_prestador,
      tempo_experiencia,
      id_categoria,
    });

    // Retorna prestador com categoria
    const prestadorCompleto = await Prestador.findByPk(prestador.codigo_prestador, {
      include: [{ model: Categoria, as: "categoria" }],
    });

    res.status(201).json({
      message: "Prestador criado com sucesso",
      prestador: prestadorCompleto,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao criar prestador",
      error: error.message,
    });
  }
};

// READ - Listar todos prestadores
export const listarPrestadores = async (req, res) => {
  try {
    const prestadores = await Prestador.findAll({
      include: [
        {
          model: Categoria,
          as: "categoria",
          attributes: ["id_categoria", "nome_categoria"],
        },
        {
          model: Servico,
          as: "servicos",
          attributes: ["id_servico", "nome_servico", "vlr_servico"],
        },
      ],
    });

    res.json(prestadores);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao listar prestadores",
      error: error.message,
    });
  }
};

// READ - Buscar prestador por ID
export const buscarPrestadorPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const prestador = await Prestador.findByPk(id, {
      include: [
        { model: Categoria, as: "categoria" },
        { model: Servico, as: "servicos" },
      ],
    });

    if (!prestador) {
      return res.status(404).json({ message: "Prestador não encontrado" });
    }

    res.json(prestador);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar prestador",
      error: error.message,
    });
  }
};

// READ - Buscar prestadores por categoria (REQUISITO DO TRABALHO)
export const buscarPrestadoresPorCategoria = async (req, res) => {
  try {
    const { id_categoria } = req.params;

    const prestadores = await Prestador.findAll({
      where: { id_categoria },
      include: [
        { model: Categoria, as: "categoria" },
        { model: Servico, as: "servicos" },
      ],
    });

    if (prestadores.length === 0) {
      return res.status(404).json({
        message: "Nenhum prestador encontrado para esta categoria",
      });
    }

    res.json(prestadores);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar prestadores por categoria",
      error: error.message,
    });
  }
};

// READ - Buscar prestadores por serviço (REQUISITO DO TRABALHO)
export const buscarPrestadoresPorServico = async (req, res) => {
  try {
    const { id_servico } = req.params;

    const prestadores = await Prestador.findAll({
      include: [
        {
          model: Servico,
          as: "servicos",
          where: { id_servico },
        },
      ],
    });

    if (prestadores.length === 0) {
      return res.status(404).json({
        message: "Nenhum prestador encontrado para este serviço",
      });
    }

    res.json(prestadores);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar prestadores por serviço",
      error: error.message,
    });
  }
};

// UPDATE - Atualizar prestador
export const atualizarPrestador = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome_prestador, tempo_experiencia, id_categoria } = req.body;

    const prestador = await Prestador.findByPk(id);

    if (!prestador) {
      return res.status(404).json({ message: "Prestador não encontrado" });
    }

    // Se mudou categoria, verifica se existe
    if (id_categoria && id_categoria !== prestador.id_categoria) {
      const categoria = await Categoria.findByPk(id_categoria);
      if (!categoria) {
        return res.status(404).json({ message: "Categoria não encontrada" });
      }
    }

    await prestador.update({ nome_prestador, tempo_experiencia, id_categoria });

    const prestadorAtualizado = await Prestador.findByPk(id, {
      include: [{ model: Categoria, as: "categoria" }],
    });

    res.json({
      message: "Prestador atualizado com sucesso",
      prestador: prestadorAtualizado,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar prestador",
      error: error.message,
    });
  }
};

// DELETE - Deletar prestador
export const deletarPrestador = async (req, res) => {
  try {
    const { id } = req.params;

    const prestador = await Prestador.findByPk(id);

    if (!prestador) {
      return res.status(404).json({ message: "Prestador não encontrado" });
    }

    await prestador.destroy();

    res.json({ message: "Prestador deletado com sucesso" });
  } catch (error) {
    // Erro de serviços vinculados ao prestador
    if (
      error.name === "SequelizeForeignKeyConstraintError" ||error.original?.errno === 1451 ||
      error.parent?.errno === 1451
    ) {
      return res.status(400).json({
        message: "Não é possível deletar o prestador pois existem serviços vinculados a ele.",
      });
    }
    res.status(500).json({
      message: "Erro ao deletar prestador",
      error: error.message,
    });
  }
};
