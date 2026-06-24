/**
 * js/receita.js
 * Carrega e exibe uma receita (base ou do usuário) via API REST.
 * Também gerencia o botão de favoritos de forma assíncrona.
 */

(function () {
  'use strict';

  async function init() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');

    if (!id) { mostrarErro('Nenhuma receita especificada.'); return; }
    if (!window.RF || !RF.storage) { mostrarErro('Erro ao carregar o sistema.'); return; }

    var receita;
    try {
      receita = await RF.storage.buscarReceitaPorId(id);
    } catch (err) {
      mostrarErro('Receita não encontrada ou acesso negado.');
      return;
    }

    if (!receita) { mostrarErro('Receita não encontrada.'); return; }

    RF.storage.registrarAcessoReceita(id);
    if (receita.categoria) RF.storage.registrarAcessoCategoria(receita.categoria);

    renderReceita(receita);
    configurarFavorito(receita.id);
  }

  // ── Renderizar ───────────────────────────────────────────
  function renderReceita(receita) {
    document.title = receita.nome + ' — ReceitaFácil';

    // Imagem (o banco usa imagem_url; fallback para o campo "imagem" do front antigo)
    var imgEl = document.querySelector('.receita-imagem');
    var imgSrc = receita.imagem_url || receita.imagem || '';
    if (imgEl) {
      if (imgSrc) {
        imgEl.src = imgSrc;
        imgEl.alt = 'Foto de ' + receita.nome;
        imgEl.style.display = '';
      } else {
        var placeholder = document.createElement('div');
        placeholder.className = receita.nome;
        placeholder.style.cssText = 'display:flex;align-items:center;justify-content:center;font-size:4rem;';
        placeholder.textContent = '🍽️';
        imgEl.parentNode.replaceChild(placeholder, imgEl);
      }
    }

    var h1  = document.querySelector('.receita-info h1');
    var desc = document.querySelector('.receita-info p');
    if (h1)   h1.textContent   = receita.nome;
    if (desc) desc.textContent = receita.descricao || '';

    var receitaInfo = document.querySelector('.receita-info');
    if (receitaInfo) {
      if (receita.categoria) {
        var badge = document.createElement('div');
        badge.className = 'badge-categoria';
        badge.textContent = receita.categoria;
        badge.style.cssText = 'display:inline-block;background:var(--laranja-palido,#fdf3e7);color:var(--laranja-escuro,#b45309);border-radius:20px;padding:3px 12px;font-size:0.82rem;font-weight:600;margin-bottom:0.6rem;';
        receitaInfo.insertBefore(badge, h1);
      }

      // tempo_preparo (API) ou tempoPreparo (formato antigo)
      var tempo = receita.tempo_preparo || receita.tempoPreparo;
      var porcoes = receita.porcoes;
      if (tempo || porcoes) {
        var meta = document.createElement('div');
        meta.style.cssText = 'display:flex;gap:1.5rem;flex-wrap:wrap;font-size:0.88rem;color:var(--texto-suave);margin-bottom:1rem;';
        if (tempo)   meta.innerHTML += '<span>⏱️ ' + formatarMinutos(tempo) + '</span>';
        if (porcoes) meta.innerHTML += '<span>🍽️ ' + porcoes + ' porção(ões)</span>';
        if (desc) desc.insertAdjacentElement('afterend', meta);
      }
    }

    // Ingredientes
    var listaIng = document.getElementById('lista-ingredientes-receita')
                || document.querySelector('.receita-ingredientes');
    if (listaIng && receita.ingredientes) {
      listaIng.innerHTML = '';
      receita.ingredientes.forEach(function (ing) {
        var li = document.createElement('li');
        li.innerHTML = '<span>' + esc(ing.nome) + '</span><strong>' + esc(ing.quantidade) + '</strong>';
        listaIng.appendChild(li);
      });
    }

    // Etapas
    var olEl = document.getElementById('lista-etapas-receita')
            || document.querySelector('.receita-preparo ol');
    if (olEl && receita.etapas) {
      olEl.innerHTML = '';
      receita.etapas.forEach(function (etapa) {
        var li = document.createElement('li');
        li.textContent = etapa.descricao;
        olEl.appendChild(li);
      });
    }

    // Botão de edição (só aparece se for receita do próprio usuário)
    if (receita.usuario_id !== null && receita.usuario_id !== undefined) {
      var btnFav = document.getElementById('btn-favorito');
      if (btnFav) {
        var btnEditar = document.createElement('a');
        btnEditar.href = 'editar-receita.html?id=' + encodeURIComponent(receita.id);
        btnEditar.className = 'btn btn-secundario btn-pequeno';
        btnEditar.style.cssText = 'width:auto;margin-bottom:1rem;display:inline-flex;margin-left:0.5rem;';
        btnEditar.textContent = '✏️ Editar receita';
        btnFav.insertAdjacentElement('afterend', btnEditar);
      }
    }
  }

  // ── Favorito ─────────────────────────────────────────────
  async function configurarFavorito(id) {
    var btn = document.getElementById('btn-favorito');
    if (!btn) return;

    await atualizarBtnFavorito(btn, id);

    btn.addEventListener('click', async function () {
      try {
        var fav = await RF.storage.ehFavorito(id);
        if (fav) {
          await RF.storage.removerFavorito(id);
        } else {
          await RF.storage.adicionarFavorito(id);
        }
        await atualizarBtnFavorito(btn, id);
      } catch (err) {
        console.error('[Favorito]', err);
      }
    });
  }

  async function atualizarBtnFavorito(btn, id) {
    var fav = await RF.storage.ehFavorito(id);

    var icone = btn.querySelector('.fav-icone');
    if (!icone) {
      btn.innerHTML =
        '<span class="fav-icone" aria-hidden="true"></span>' +
        '<span class="fav-texto"></span>';
      icone = btn.querySelector('.fav-icone');
    }

    icone.textContent = fav ? '\u2605' : '\u2606';
    btn.querySelector('.fav-texto').textContent = fav ? 'Remover dos favoritos' : 'Salvar nos favoritos';
    btn.classList.toggle('ativo', fav);
    btn.title = fav ? 'Remover dos favoritos' : 'Salvar nos favoritos';
  }

  // ── Helpers ──────────────────────────────────────────────
  function mostrarErro(msg) {
    var main = document.querySelector('main.conteudo');
    if (!main) return;
    var div = document.createElement('div');
    div.className = 'mensagem-erro';
    div.style.marginTop = '1rem';
    div.textContent = msg;
    var voltar = main.querySelector('div:first-child');
    if (voltar) voltar.insertAdjacentElement('afterend', div);
    else main.insertBefore(div, main.firstChild);
  }

  function formatarMinutos(min) {
    if (!min || min <= 0) return '';
    if (min < 60) return min + ' min';
    var h = Math.floor(min / 60);
    var m = min % 60;
    return h + 'h' + (m > 0 ? ' ' + m + 'min' : '');
  }

  function esc(str) {
    return String(str || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  init();
})();
