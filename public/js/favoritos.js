/**
 * js/favoritos.js
 * Gerencia a seção "Receitas favoritas" em minhas-receitas.html.
 * Carrega os dados da API REST de forma assíncrona.
 */

(function () {
  'use strict';

  var listaEl = document.getElementById('lista-favoritos');
  var vazioEl = document.getElementById('vazio-favoritos');

  async function init() {
    if (!listaEl) return;
    await renderFavoritos();
  }

  async function renderFavoritos() {
    if (!window.RF || !RF.storage) return;

    var receitas;
    try {
      receitas = await RF.storage.obterFavoritos();
    } catch (err) {
      console.error('[Favoritos]', err);
      receitas = [];
    }

    listaEl.innerHTML = '';

    if (!receitas || receitas.length === 0) {
      vazioEl.style.display = 'block';
      return;
    }
    vazioEl.style.display = 'none';

    receitas.forEach(function (receita) {
      var li = document.createElement('li');
      li.innerHTML =
        '<div style="flex:1;">' +
          '<a href="receita.html?id=' + esc(receita.id) + '">' + esc(receita.nome) + '</a>' +
          (receita.categoria
            ? '<div style="font-size:0.8rem;color:var(--texto-suave);margin-top:0.1rem;">' + esc(receita.categoria) + '</div>'
            : '') +
        '</div>' +
        '<button class="remover-fav btn-remover-fav" data-id="' + esc(receita.id) + '" title="Remover dos favoritos">✕</button>';
      listaEl.appendChild(li);
    });

    listaEl.querySelectorAll('.btn-remover-fav').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        try {
          await RF.storage.removerFavorito(this.dataset.id);
          await renderFavoritos();
        } catch (err) {
          console.error('[Remover favorito]', err);
        }
      });
    });
  }

  function esc(str) {
    return String(str || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  init();
})();
