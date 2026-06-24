/**
 * js/historico.js
 * Renderiza o histórico de buscas em perfil.html.
 * O histórico é mantido em sessionStorage (dado efêmero de UX).
 */

(function () {
  'use strict';

  function init() {
    injetarSecaoHistorico();
  }

  function injetarSecaoHistorico() {
    var card = document.querySelector('.card');
    if (!card || !window.RF || !RF.storage) return;

    var hist = RF.storage.obterHistorico();

    var secao = document.createElement('div');
    secao.className = 'card';
    secao.style.cssText = 'max-width:500px;margin-top:1.5rem;margin-left:auto;margin-right:auto;';

    if (hist.length === 0) {
      secao.innerHTML =
        '<h3 style="margin-bottom:0.5rem;">Pesquisas recentes</h3>' +
        '<p style="font-size:0.88rem;">Nenhuma pesquisa realizada ainda. ' +
        '<a href="buscar-receita.html">Buscar receitas</a></p>';
    } else {
      var itens = hist.map(function (termos) {
        return '<li>' +
          '<span class="hist-termos">🔍 ' + esc(termos) + '</span>' +
          '<button class="btn btn-secundario btn-pequeno btn-repetir" ' +
            'data-termos="' + esc(termos) + '" style="width:auto;flex-shrink:0;">Repetir</button>' +
        '</li>';
      }).join('');

      secao.innerHTML =
        '<h3 style="margin-bottom:0.75rem;">Pesquisas recentes</h3>' +
        '<ul class="historico-lista">' + itens + '</ul>' +
        '<button class="btn btn-perigo btn-pequeno" id="btn-limpar-hist" ' +
          'style="width:auto;margin-top:0.75rem;">Limpar histórico</button>';
    }

    card.insertAdjacentElement('afterend', secao);

    secao.querySelectorAll('.btn-repetir').forEach(function (btn) {
      btn.addEventListener('click', function () {
        repetirBusca(this.dataset.termos);
      });
    });

    var btnLimpar = secao.querySelector('#btn-limpar-hist');
    if (btnLimpar) {
      btnLimpar.addEventListener('click', function () {
        sessionStorage.removeItem('historicoBusca');
        secao.remove();
        injetarSecaoHistorico();
      });
    }
  }

  function repetirBusca(termos) {
    var dispensa = termos.split(',').map(function (t) {
      return { nome: t.trim(), quantidade: '', validade: '' };
    }).filter(function (i) { return i.nome; });

    sessionStorage.setItem('dispensaBusca', JSON.stringify(dispensa));
    window.location.href = 'resultados.html';
  }

  function esc(str) {
    return String(str || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  init();
})();
