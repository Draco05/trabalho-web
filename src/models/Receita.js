const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/*
 * Ingredientes e etapas são armazenados como JSONB:
 *
 * ingredientes: [{ nome: string, quantidade: string }]
 * etapas:       [{ numero: number, descricao: string }]
 *
 * Isso evita tabelas extra para um projeto didático e
 * mantém a estrutura idêntica à usada no front-end.
 */
const Receita = sequelize.define('Receita', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: true,   // NULL = receita da base global; preenchido = receita do usuário
    references: {
      model: 'usuarios',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  nome: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: { notEmpty: true },
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  categoria: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  tempo_preparo: {
    type: DataTypes.INTEGER,   // minutos
    allowNull: true,
  },
  porcoes: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  imagem_url: {
    type: DataTypes.TEXT,      // URL ou base64
    allowNull: true,
  },
  ingredientes: {
    type: DataTypes.JSONB,     // [{ nome, quantidade }]
    allowNull: false,
    defaultValue: [],
  },
  etapas: {
    type: DataTypes.JSONB,     // [{ numero, descricao }]
    allowNull: false,
    defaultValue: [],
  },
}, {
  tableName: 'receitas',
  timestamps: true,
  underscored: true,
});

module.exports = Receita;
