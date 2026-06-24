/**
 * js/storage.js — Camada de persistência via API REST
 * ─────────────────────────────────────────────────────
 * Substitui a versão anterior baseada em localStorage.
 * A interface pública (window.RF.storage) é mantida idêntica,
 * mas todas as funções agora retornam Promises que chamam a API.
 *
 * URL base da API: /api  (mesmo host que o front-end)
 */

(function (global) {
  'use strict';

  var BASE = '/api';

  // ── Auxiliar de fetch ─────────────────────────────────────

  /**
   * Faz uma requisição fetch e retorna o JSON da resposta.
   * Em caso de erro HTTP, lança um Error com a mensagem da API.
   */
  async function _req(method, path, body) {
    var opcoes = {
      method:      method,
      credentials: 'include',      // envia o cookie de sessão
      headers:     { 'Content-Type': 'application/json' },
    };
    if (body !== undefined) {
      opcoes.body = JSON.stringify(body);
    }

    var resp = await fetch(BASE + path, opcoes);

    // Redireciona para login se a sessão expirou
    if (resp.status === 401) {
      window.location.href = 'login.html';
      return;
    }

    var json = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      throw new Error(json.erro || 'Erro ' + resp.status);
    }

    return json;
  }

  // ══════════════════════════════════════════════════
  // AUTENTICAÇÃO
  // ══════════════════════════════════════════════════

  /** Cria conta. Retorna { usuario } ou lança erro. */
  async function cadastrar(username, email, senha) {
    return _req('POST', '/auth/cadastro', { username, email, senha });
  }

  /** Faz login. Retorna { usuario } ou lança erro. */
  async function login(username, senha) {
    return _req('POST', '/auth/login', { username, senha });
  }

  /** Encerra a sessão. */
  async function logout() {
    return _req('POST', '/auth/logout');
  }

  /** Retorna os dados do perfil do usuário logado. */
  async function obterPerfil() {
    return _req('GET', '/auth/perfil');
  }

  /** Exclui a conta do usuário logado. */
  async function deletarConta() {
    return _req('DELETE', '/auth/conta');
  }

  // ══════════════════════════════════════════════════
  // RECEITAS
  // ══════════════════════════════════════════════════

  /**
   * Retorna todas as receitas visíveis ao usuário:
   * receitas da base global + receitas que ele mesmo cadastrou.
   */
  async function buscarReceitas() {
    return _req('GET', '/receitas');
  }

  /** Busca uma receita pelo ID. */
  async function buscarReceitaPorId(id) {
    return _req('GET', '/receitas/' + id);
  }

  /**
   * Cria uma nova receita para o usuário logado.
   * @param {Object} dados - { nome, descricao, categoria, tempo_preparo, porcoes, imagem_url, ingredientes, etapas }
   */
  async function salvarReceita(dados) {
    if (dados.id) {
      // Se já tem ID, é uma atualização
      return _req('PUT', '/receitas/' + dados.id, dados);
    }
    return _req('POST', '/receitas', dados);
  }

  /** Exclui uma receita do usuário logado pelo ID. */
  async function excluirReceita(id) {
    return _req('DELETE', '/receitas/' + id);
  }

  // ══════════════════════════════════════════════════
  // FAVORITOS
  // ══════════════════════════════════════════════════

  /** Retorna as receitas favoritadas pelo usuário logado. */
  async function obterFavoritos() {
    return _req('GET', '/favoritos');
  }

  /** Adiciona uma receita aos favoritos. */
  async function adicionarFavorito(receita_id) {
    return _req('POST', '/favoritos', { receita_id });
  }

  /** Remove uma receita dos favoritos. */
  async function removerFavorito(receita_id) {
    return _req('DELETE', '/favoritos/' + receita_id);
  }

  /** Verifica se uma receita é favorita. Retorna boolean. */
  async function ehFavorito(receita_id) {
    var favs = await obterFavoritos();
    return favs.some(function (r) { return r.id === receita_id || r.id === Number(receita_id); });
  }

  // ══════════════════════════════════════════════════
  // HISTÓRICO e MÉTRICAS (mantidos em sessionStorage
  // pois são dados efêmeros de UX, não de negócio)
  // ══════════════════════════════════════════════════

  var MAX_HISTORICO = 10;

  function obterHistorico() {
    try { return JSON.parse(sessionStorage.getItem('historicoBusca') || '[]'); }
    catch (_) { return []; }
  }

  function salvarHistorico(termo) {
    if (!termo || !termo.trim()) return;
    var hist = obterHistorico().filter(function (t) {
      return t.toLowerCase() !== termo.toLowerCase();
    });
    hist.unshift(termo.trim());
    sessionStorage.setItem('historicoBusca', JSON.stringify(hist.slice(0, MAX_HISTORICO)));
  }

  function registrarAcessoReceita(id) {
    var acessos = JSON.parse(sessionStorage.getItem('receitasAcessadas') || '[]');
    acessos = acessos.filter(function (a) { return a !== id; });
    acessos.unshift(id);
    sessionStorage.setItem('receitasAcessadas', JSON.stringify(acessos.slice(0, 50)));
  }

  function registrarAcessoCategoria(categoria) {
    if (!categoria) return;
    var cats = JSON.parse(sessionStorage.getItem('categoriasAcessadas') || '{}');
    cats[categoria] = (cats[categoria] || 0) + 1;
    sessionStorage.setItem('categoriasAcessadas', JSON.stringify(cats));
  }

  function obterCategoriasFrequentes() {
    var cats = JSON.parse(sessionStorage.getItem('categoriasAcessadas') || '{}');
    return Object.entries(cats)
      .sort(function (a, b) { return b[1] - a[1]; })
      .map(function (e) { return e[0]; });
  }

  function obterIngredientesFrequentes() {
    var hist = obterHistorico();
    var freq = {};
    hist.forEach(function (busca) {
      busca.split(',').forEach(function (ing) {
        var k = ing.trim().toLowerCase();
        if (k) freq[k] = (freq[k] || 0) + 1;
      });
    });
    return Object.entries(freq)
      .sort(function (a, b) { return b[1] - a[1]; })
      .map(function (e) { return e[0]; });
  }

  function obterReceitasAcessadas() {
    return JSON.parse(sessionStorage.getItem('receitasAcessadas') || '[]');
  }

  // ══════════════════════════════════════════════════
  // EXPORTAÇÃO
  // ══════════════════════════════════════════════════

  global.RF = global.RF || {};
  global.RF.storage = {
    // Auth
    cadastrar,
    login,
    logout,
    obterPerfil,
    deletarConta,
    // Receitas
    buscarReceitas,
    buscarReceitaPorId,
    salvarReceita,
    excluirReceita,
    // Favoritos
    obterFavoritos,
    adicionarFavorito,
    removerFavorito,
    ehFavorito,
    // Histórico / métricas (síncronos)
    obterHistorico,
    salvarHistorico,
    registrarAcessoReceita,
    registrarAcessoCategoria,
    obterCategoriasFrequentes,
    obterIngredientesFrequentes,
    obterReceitasAcessadas,
  };

})(window);
