const { Favorito, Receita } = require('../models');
const { Op } = require('sequelize');

// ── GET /api/favoritos ────────────────────────────────────────
// Retorna as receitas favoritadas pelo usuário logado.
async function listar(req, res) {
  try {
    const favoritos = await Favorito.findAll({
      where: { usuario_id: req.session.usuarioId },
      include: [{ model: Receita, as: 'receita' }],
      order: [['created_at', 'DESC']],
    });

    const receitas = favoritos.map((f) => f.receita).filter(Boolean);
    return res.json(receitas);
  } catch (err) {
    console.error('[listar favoritos]', err);
    return res.status(500).json({ erro: 'Erro ao buscar favoritos.' });
  }
}

// ── POST /api/favoritos ───────────────────────────────────────
// Adiciona uma receita aos favoritos.
async function adicionar(req, res) {
  try {
    const { receita_id } = req.body;
    const usuarioId = req.session.usuarioId;

    if (!receita_id) {
      return res.status(400).json({ erro: 'Informe o ID da receita.' });
    }

    // Verifica se a receita existe e é acessível ao usuário
    const receita = await Receita.findByPk(receita_id);
    if (!receita) {
      return res.status(404).json({ erro: 'Receita não encontrada.' });
    }
    if (receita.usuario_id !== null && receita.usuario_id !== usuarioId) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }

    // findOrCreate evita duplicatas sem lançar erro
    const [favorito, criado] = await Favorito.findOrCreate({
      where: { usuario_id: usuarioId, receita_id },
    });

    if (!criado) {
      return res.status(409).json({ erro: 'Receita já está nos favoritos.' });
    }

    return res.status(201).json({ mensagem: 'Adicionado aos favoritos.', favorito });
  } catch (err) {
    console.error('[adicionar favorito]', err);
    return res.status(500).json({ erro: 'Erro ao adicionar favorito.' });
  }
}

// ── DELETE /api/favoritos/:receitaId ─────────────────────────
async function remover(req, res) {
  try {
    const excluidos = await Favorito.destroy({
      where: {
        usuario_id: req.session.usuarioId,
        receita_id: req.params.receitaId,
      },
    });

    if (excluidos === 0) {
      return res.status(404).json({ erro: 'Favorito não encontrado.' });
    }

    return res.json({ mensagem: 'Removido dos favoritos.' });
  } catch (err) {
    console.error('[remover favorito]', err);
    return res.status(500).json({ erro: 'Erro ao remover favorito.' });
  }
}

module.exports = { listar, adicionar, remover };
