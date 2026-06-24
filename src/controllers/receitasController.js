const { Op } = require('sequelize');
const { Receita, Usuario } = require('../models');

// ── GET /api/receitas ─────────────────────────────────────────
// Retorna receitas da base global + receitas do usuário logado.
// Receitas de outros usuários NÃO são retornadas.
async function listar(req, res) {
  try {
    const usuarioId = req.session.usuarioId;

    const receitas = await Receita.findAll({
      where: {
        [Op.or]: [
          { usuario_id: null },         // receitas da base global
          { usuario_id: usuarioId },    // receitas do próprio usuário
        ],
      },
      attributes: { exclude: ['updated_at'] },
      order: [['created_at', 'DESC']],
    });

    return res.json(receitas);
  } catch (err) {
    console.error('[listar receitas]', err);
    return res.status(500).json({ erro: 'Erro ao buscar receitas.' });
  }
}

// ── GET /api/receitas/:id ─────────────────────────────────────
async function buscarPorId(req, res) {
  try {
    const usuarioId = req.session.usuarioId;
    const receita   = await Receita.findByPk(req.params.id);

    if (!receita) {
      return res.status(404).json({ erro: 'Receita não encontrada.' });
    }

    // Bloqueia acesso à receita de outro usuário
    if (receita.usuario_id !== null && receita.usuario_id !== usuarioId) {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }

    return res.json(receita);
  } catch (err) {
    console.error('[buscarPorId]', err);
    return res.status(500).json({ erro: 'Erro ao buscar receita.' });
  }
}

// ── POST /api/receitas ────────────────────────────────────────
async function criar(req, res) {
  try {
    const { nome, descricao, categoria, tempo_preparo, porcoes, imagem_url, ingredientes, etapas } = req.body;

    if (!nome || !ingredientes || !etapas) {
      return res.status(400).json({ erro: 'Nome, ingredientes e etapas são obrigatórios.' });
    }

    const receita = await Receita.create({
      usuario_id: req.session.usuarioId,
      nome,
      descricao,
      categoria,
      tempo_preparo,
      porcoes,
      imagem_url,
      ingredientes,
      etapas,
    });

    return res.status(201).json(receita);
  } catch (err) {
    console.error('[criar receita]', err);
    return res.status(500).json({ erro: 'Erro ao criar receita.' });
  }
}

// ── PUT /api/receitas/:id ─────────────────────────────────────
async function atualizar(req, res) {
  try {
    const receita = await Receita.findByPk(req.params.id);

    if (!receita) {
      return res.status(404).json({ erro: 'Receita não encontrada.' });
    }
    // Só o dono pode editar
    if (receita.usuario_id !== req.session.usuarioId) {
      return res.status(403).json({ erro: 'Você não tem permissão para editar esta receita.' });
    }

    const { nome, descricao, categoria, tempo_preparo, porcoes, imagem_url, ingredientes, etapas } = req.body;

    await receita.update({ nome, descricao, categoria, tempo_preparo, porcoes, imagem_url, ingredientes, etapas });

    return res.json(receita);
  } catch (err) {
    console.error('[atualizar receita]', err);
    return res.status(500).json({ erro: 'Erro ao atualizar receita.' });
  }
}

// ── DELETE /api/receitas/:id ──────────────────────────────────
async function excluir(req, res) {
  try {
    const receita = await Receita.findByPk(req.params.id);

    if (!receita) {
      return res.status(404).json({ erro: 'Receita não encontrada.' });
    }
    if (receita.usuario_id !== req.session.usuarioId) {
      return res.status(403).json({ erro: 'Você não tem permissão para excluir esta receita.' });
    }

    await receita.destroy();

    return res.json({ mensagem: 'Receita excluída com sucesso.' });
  } catch (err) {
    console.error('[excluir receita]', err);
    return res.status(500).json({ erro: 'Erro ao excluir receita.' });
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
