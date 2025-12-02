import Categoria from "../models/categoria_model.js";
import Prestador from "../models/prestador_model.js";

// CREATE - Criar categoria
export const criarCategoria = async (req, res) => {
  try {
    const { nome_categoria } = req.body;

    const categoria = await Categoria.create({ nome_categoria });

    res.status(201).json({
      message: "Categoria criada com sucesso",
      categoria,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao criar categoria",
      error: error.message,
    });
  }
};

// READ - Listar todas categorias
export const listarCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll({
      include: [
        {
          model: Prestador,
          as: "prestadores",
          attributes: ["codigo_prestador", "nome_prestador", "tempo_experiencia"],
        },
      ],
    });

    res.json(categorias);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao listar categorias",
      error: error.message,
    });
  }
};

// READ - Buscar categoria por ID
export const buscarCategoriaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await Categoria.findByPk(id, {
      include: [
        {
          model: Prestador,
          as: "prestadores",
        },
      ],
    });

    if (!categoria) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    res.json(categoria);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar categoria",
      error: error.message,
    });
  }
};

// UPDATE - Atualizar categoria
export const atualizarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome_categoria } = req.body;

    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    await categoria.update({ nome_categoria });

    res.json({
      message: "Categoria atualizada com sucesso",
      categoria,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar categoria",
      error: error.message,
    });
  }
};

// DELETE - Deletar categoria
export const deletarCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    await categoria.destroy();

    res.json({ message: "Categoria deletada com sucesso" });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao deletar categoria",
      error: error.message,
    });
  }
};
