const sequelize = require('../config/database');
const Usuario  = require('./Usuario');
const Receita  = require('./Receita');
const Favorito = require('./Favorito');

// ── Associações ───────────────────────────────────────────────
// Um usuário possui muitas receitas (as que ele cadastrou)
Usuario.hasMany(Receita, { foreignKey: 'usuario_id', as: 'minhasReceitas' });
Receita.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'autor' });

// Um usuário possui muitos favoritos; uma receita pode ser favoritada por muitos
Usuario.hasMany(Favorito, { foreignKey: 'usuario_id', as: 'favoritos' });
Favorito.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Receita.hasMany(Favorito, { foreignKey: 'receita_id' });
Favorito.belongsTo(Receita, { foreignKey: 'receita_id', as: 'receita' });

// Atalho many-to-many para buscar receitas favoritadas de um usuário
Usuario.belongsToMany(Receita, {
  through: Favorito,
  foreignKey: 'usuario_id',
  otherKey: 'receita_id',
  as: 'receitasFavoritas',
});
Receita.belongsToMany(Usuario, {
  through: Favorito,
  foreignKey: 'receita_id',
  otherKey: 'usuario_id',
  as: 'usuariosQueFavoritaram',
});

module.exports = { sequelize, Usuario, Receita, Favorito };
