const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Favorito = sequelize.define('Favorito', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'usuarios', key: 'id' },
    onDelete: 'CASCADE',
  },
  receita_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'receitas', key: 'id' },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'favoritos',
  timestamps: true,
  underscored: true,
  indexes: [
    // Garante que o mesmo usuário não favorite a mesma receita duas vezes
    { unique: true, fields: ['usuario_id', 'receita_id'] },
  ],
});

module.exports = Favorito;
