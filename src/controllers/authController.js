const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');

// ── POST /api/auth/cadastro ───────────────────────────────────
async function cadastro(req, res) {
  try {
    const { username, email, senha } = req.body;

    if (!username || !email || !senha) {
      return res.status(400).json({ erro: 'Preencha username, email e senha.' });
    }
    if (senha.length < 6) {
      return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    // Verifica duplicatas de username ou email
    const jaExiste = await Usuario.findOne({
      where: { username },
    });
    if (jaExiste) {
      return res.status(409).json({ erro: 'Este username já está em uso.' });
    }
    const emailUsado = await Usuario.findOne({ where: { email } });
    if (emailUsado) {
      return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
    }

    const senha_hash = await bcrypt.hash(senha, 10);
    const usuario = await Usuario.create({ username, email, senha_hash });

    // Loga automaticamente após o cadastro
    req.session.usuarioId = usuario.id;
    req.session.username  = usuario.username;

    return res.status(201).json({
      mensagem: 'Conta criada com sucesso.',
      usuario: { id: usuario.id, username: usuario.username, email: usuario.email },
    });
  } catch (err) {
    console.error('[cadastro]', err);
    return res.status(500).json({ erro: 'Erro interno ao criar conta.' });
  }
}

// ── POST /api/auth/login ──────────────────────────────────────
async function login(req, res) {
  try {
    const { username, senha } = req.body;

    if (!username || !senha) {
      return res.status(400).json({ erro: 'Informe username e senha.' });
    }

    const usuario = await Usuario.findOne({ where: { username } });
    if (!usuario) {
      return res.status(401).json({ erro: 'Username ou senha incorretos.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Username ou senha incorretos.' });
    }

    req.session.usuarioId = usuario.id;
    req.session.username  = usuario.username;

    return res.json({
      mensagem: 'Login realizado com sucesso.',
      usuario: { id: usuario.id, username: usuario.username, email: usuario.email },
    });
  } catch (err) {
    console.error('[login]', err);
    return res.status(500).json({ erro: 'Erro interno ao fazer login.' });
  }
}

// ── POST /api/auth/logout ─────────────────────────────────────
function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao encerrar sessão.' });
    }
    res.clearCookie('connect.sid');
    return res.json({ mensagem: 'Sessão encerrada.' });
  });
}

// ── GET /api/auth/perfil ──────────────────────────────────────
async function perfil(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.session.usuarioId, {
      attributes: ['id', 'username', 'email', 'created_at'],
    });
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
    return res.json(usuario);
  } catch (err) {
    console.error('[perfil]', err);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

// ── DELETE /api/auth/conta ────────────────────────────────────
// Exclui a conta do usuário logado e todos os seus dados (CASCADE no banco)
async function deletarConta(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.session.usuarioId);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    await usuario.destroy();

    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      return res.json({ mensagem: 'Conta removida com sucesso.' });
    });
  } catch (err) {
    console.error('[deletarConta]', err);
    return res.status(500).json({ erro: 'Erro ao remover conta.' });
  }
}

module.exports = { cadastro, login, logout, perfil, deletarConta };
