-- ============================================================
--  banco.sql — Criação das tabelas do ReceitaFácil
--  Execute no psql ou em qualquer cliente PostgreSQL:
--    psql -U postgres -d receita_facil -f banco.sql
-- ============================================================

-- ------------------------------------------------------------
-- 0. Crie o banco antes de executar este script (uma única vez)
-- ------------------------------------------------------------
-- CREATE DATABASE receita_facil;

-- ------------------------------------------------------------
-- 1. Usuários
--    Armazena credenciais e dados de perfil.
--    username e email são únicos (não pode repetir).
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id           SERIAL        PRIMARY KEY,
  username     VARCHAR(50)   NOT NULL UNIQUE,
  email        VARCHAR(150)  NOT NULL UNIQUE,
  senha_hash   TEXT          NOT NULL,
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 2. Receitas
--    usuario_id = NULL  → receita da base global (visível a todos)
--    usuario_id = X     → receita do usuário X   (visível só a ele)
--
--    ingredientes e etapas são guardados como JSONB:
--      ingredientes: [{"nome":"farinha","quantidade":"2 xícaras"}, ...]
--      etapas:       [{"numero":1,"descricao":"..."}, ...]
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS receitas (
  id            SERIAL        PRIMARY KEY,
  usuario_id    INTEGER       REFERENCES usuarios(id) ON DELETE CASCADE,
  nome          VARCHAR(150)  NOT NULL,
  descricao     TEXT,
  categoria     VARCHAR(50),
  tempo_preparo INTEGER,                   -- em minutos
  porcoes       INTEGER,
  imagem_url    TEXT,                      -- URL ou base64
  ingredientes  JSONB         NOT NULL DEFAULT '[]',
  etapas        JSONB         NOT NULL DEFAULT '[]',
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Índice para acelerar a busca "receitas globais + minhas receitas"
CREATE INDEX IF NOT EXISTS idx_receitas_usuario
  ON receitas (usuario_id);

-- Índice GIN para pesquisas dentro do JSONB de ingredientes
CREATE INDEX IF NOT EXISTS idx_receitas_ingredientes
  ON receitas USING GIN (ingredientes);

-- ------------------------------------------------------------
-- 3. Favoritos
--    Relaciona usuários com as receitas que favoritaram.
--    A restrição UNIQUE impede favoritar a mesma receita duas vezes.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS favoritos (
  id          SERIAL      PRIMARY KEY,
  usuario_id  INTEGER     NOT NULL REFERENCES usuarios(id)  ON DELETE CASCADE,
  receita_id  INTEGER     NOT NULL REFERENCES receitas(id)  ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (usuario_id, receita_id)
);

-- ------------------------------------------------------------
-- 4. Dados iniciais — receitas da base global
--    (usuario_id = NULL significa que são públicas para todos)
-- ------------------------------------------------------------
INSERT INTO receitas (usuario_id, nome, descricao, categoria, tempo_preparo, porcoes, ingredientes, etapas)
VALUES
  (NULL, 'Bruschetta de Tomate',
   'Torrada crocante com tomate fresco, alho e manjericão.',
   'Entrada', 15, 4,
   '[
     {"nome":"pão italiano","quantidade":"1 unidade"},
     {"nome":"tomate","quantidade":"3 unidades"},
     {"nome":"alho","quantidade":"2 dentes"},
     {"nome":"manjericão fresco","quantidade":"1 maço"},
     {"nome":"azeite","quantidade":"3 colheres de sopa"},
     {"nome":"sal","quantidade":"a gosto"}
   ]',
   '[
     {"numero":1,"descricao":"Corte o pão em fatias e toste no forno a 200 °C por 5 minutos."},
     {"numero":2,"descricao":"Pique o tomate em cubos e misture com sal, azeite e manjericão."},
     {"numero":3,"descricao":"Esfregue o alho nas fatias de pão tostadas."},
     {"numero":4,"descricao":"Distribua a mistura de tomate sobre o pão e sirva imediatamente."}
   ]'
  ),

  (NULL, 'Bolo de Banana Simples',
   'Receita clássica para aproveitar bananas maduras.',
   'Sobremesa', 50, 8,
   '[
     {"nome":"banana madura","quantidade":"3 unidades"},
     {"nome":"farinha de trigo","quantidade":"2 xícaras"},
     {"nome":"açúcar","quantidade":"1 xícara"},
     {"nome":"ovos","quantidade":"2 unidades"},
     {"nome":"óleo","quantidade":"1/2 xícara"},
     {"nome":"fermento em pó","quantidade":"1 colher de sopa"},
     {"nome":"sal","quantidade":"1 pitada"}
   ]',
   '[
     {"numero":1,"descricao":"Preaqueça o forno a 180 °C e unte uma forma."},
     {"numero":2,"descricao":"Amasse as bananas com um garfo até formar um purê."},
     {"numero":3,"descricao":"Misture o purê com ovos e óleo até incorporar."},
     {"numero":4,"descricao":"Adicione o açúcar e misture."},
     {"numero":5,"descricao":"Peneire a farinha com o fermento e o sal; mexa até obter massa lisa."},
     {"numero":6,"descricao":"Despeje na forma e leve ao forno por 35 minutos."},
     {"numero":7,"descricao":"Palito limpo indica que está pronto. Espere esfriar para desenformar."}
   ]'
  ),

  (NULL, 'Omelete de Queijo e Presunto',
   'Café da manhã ou lanche rápido e proteico.',
   'Prato Principal', 10, 1,
   '[
     {"nome":"ovos","quantidade":"3 unidades"},
     {"nome":"queijo muçarela","quantidade":"50g"},
     {"nome":"presunto","quantidade":"2 fatias"},
     {"nome":"sal","quantidade":"a gosto"},
     {"nome":"manteiga","quantidade":"1 colher de chá"}
   ]',
   '[
     {"numero":1,"descricao":"Bata os ovos com sal em um recipiente."},
     {"numero":2,"descricao":"Derreta a manteiga em frigideira antiaderente em fogo médio."},
     {"numero":3,"descricao":"Despeje os ovos e deixe firmar levemente nas bordas."},
     {"numero":4,"descricao":"Adicione queijo e presunto em metade da omelete."},
     {"numero":5,"descricao":"Dobre ao meio, tampe e aguarde 1 minuto. Sirva quente."}
   ]'
  )
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------
-- Resumo das tabelas criadas:
--   usuarios  — perfis de usuário
--   receitas  — receitas globais (usuario_id NULL) e do usuário
--   favoritos — relacionamento usuário ↔ receita favoritada
-- ------------------------------------------------------------
