/**
 * middleware/auth.js
 * Protege rotas que exigem login.
 * Se o usuário não estiver autenticado, retorna 401.
 */
function autenticar(req, res, next) {
  if (req.session && req.session.usuarioId) {
    return next();
  }
  return res.status(401).json({ erro: 'Não autenticado. Faça login para continuar.' });
}

module.exports = { autenticar };
