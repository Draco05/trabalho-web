/**
 * js/recomendacoes.js
 * Gera a seção "Receitas recomendadas para você" na página principal.
 * Carrega receitas e favoritos da API de forma assíncrona.
 */

(function () {
  'use strict';

  var MAX_RECOMENDACOES = 6;

  async function init() {
    if (!window.RF || !RF.storage) return;

    var todasReceitas, favoritos;
    try {
      [todasReceitas, favoritos] = await Promise.all([
        RF.storage.buscarReceitas(),
        RF.storage.obterFavoritos(),
      ]);
    } catch (err) {
      console.error('[Recomendacoes]', err);
      return;
    }

    var favIds           = favoritos.map(function (r) { return String(r.id); });
    var categoriasFreq   = RF.storage.obterCategoriasFrequentes();
    var ingsFreq         = RF.storage.obterIngredientesFrequentes();
    var receitasAcessadas= RF.storage.obterReceitasAcessadas();

    var dispensa = [];
    try { dispensa = JSON.parse(sessionStorage.getItem('dispensaUsuario') || '[]'); } catch (_) {}

    var pontuacoes = {};

    todasReceitas.forEach(function (receita) {
      var pts = 0;
      var rid = String(receita.id);

      if (favIds.includes(rid)) pts += 40;

      var idxCat = categoriasFreq.indexOf(receita.categoria);
      if      (idxCat === 0) pts += 30;
      else if (idxCat === 1) pts += 20;
      else if (idxCat >= 2)  pts += 10;

      if (ingsFreq.length > 0 && receita.ingredientes) {
        receita.ingredientes.forEach(function (ing) {
          if (ingsFreq.some(function (freq) {
            return RF.busca
              ? RF.busca.ingredientesCompatíveis(ing.nome, freq)
              : normalizar(ing.nome).includes(normalizar(freq));
          })) pts += 5;
        });
      }

      if (dispensa.length > 0 && RF.busca && receita.ingredientes) {
        var res = RF.busca.calcularScore(receita, dispensa);
        pts += Math.round(res.scoreFinal * 0.3);
      }

      var idxAcesso = receitasAcessadas.indexOf(rid);
      if (idxAcesso >= 0 && idxAcesso < 5) pts += 10;

      pontuacoes[rid] = { receita: receita, pts: pts };
    });

    var recomendacoes = Object.values(pontuacoes)
      .filter(function (p) { return p.pts > 0; })
      .sort(function (a, b) { return b.pts - a.pts; })
      .slice(0, MAX_RECOMENDACOES)
      .map(function (p) { return p.receita; });

    renderSecao(recomendacoes);
  }

  function renderSecao(receitas) {
    var main = document.querySelector('main.conteudo');
    if (!main) return;

    var secao = document.createElement('section');
    secao.id = 'secao-recomendacoes';
    secao.style.marginTop = '2.5rem';

    if (receitas.length === 0) {
      secao.innerHTML =
        '<p class="section-label">Receitas recomendadas para você</p>' +
        '<p style="color:var(--texto-suave);font-size:0.9rem;">' +
          'Use o sistema algumas vezes para receber sugestões personalizadas. ' +
          '<a href="buscar-receita.html">Buscar receitas</a>' +
        '</p>';
    } else {
      var cards = receitas.map(function (r) {
        var tempo = r.tempo_preparo || r.tempoPreparo;
        var tempoStr = '';
        if (tempo && tempo > 0) {
          tempoStr = tempo < 60 ? tempo + ' min' : Math.floor(tempo / 60) + 'h';
        }
        return '<a href="receita.html?id=' + esc(r.id) + '" class="card-recomendacao">' +
          '<span class="rec-nome">' + esc(r.nome) + '</span>' +
          '<span class="rec-meta">' + tempoStr + '</span>' +
          (r.categoria ? '<span class="rec-badge">' + esc(r.categoria) + '</span>' : '') +
        '</a>';
      }).join('');

      secao.innerHTML =
        '<p class="section-label">Receitas recomendadas para você</p>' +
        '<div class="recomendacoes-grade">' + cards + '</div>';
    }

    main.appendChild(secao);
  }

  function normalizar(str) {
    return String(str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  function esc(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  init();
})();
