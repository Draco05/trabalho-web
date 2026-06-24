require('dotenv').config();
const express       = require('express');
const session       = require('express-session');
const cors          = require('cors');
const path          = require('path');
const { sequelize } = require('./models');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares globais ───────────────────────────────────────
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'chave-padrao-insegura',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 8,
  },
}));

// ── Servir arquivos estáticos do front-end ───────────────────
app.use(express.static(path.join(__dirname, '..', 'public')));

// ── Rotas da API ─────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/receitas',  require('./routes/receitas'));
app.use('/api/favoritos', require('./routes/favoritos'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

app.get('/api/ping', (req, res) => res.json({ ok: true }));

// ── Retry de conexão ─────────────────────────────────────────
// Necessário quando o Node sobe antes do PostgreSQL estar pronto
// (situação comum no Docker Compose).
async function conectarComRetry(tentativas = 10, intervalo = 2000) {
  for (let i = 1; i <= tentativas; i++) {
    try {
      await sequelize.authenticate();
      return;
    } catch (err) {
      console.log(`⏳ Aguardando o banco... tentativa ${i}/${tentativas}`);
      if (i === tentativas) throw err;
      await new Promise((r) => setTimeout(r, intervalo));
    }
  }
}

// ── Inicialização ─────────────────────────────────────────────
async function iniciar() {
  try {
    await conectarComRetry();
    console.log('✅ Conexão com o PostgreSQL estabelecida.');

    // O banco.sql já cria as tabelas na primeira vez via Docker;
    // o sync serve como garantia extra em outros ambientes.
    await sequelize.sync({ force: false });
    console.log('✅ Modelos sincronizados com o banco.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erro ao iniciar o servidor:', err);
    process.exit(1);
  }
}

iniciar();
