/**
 * js/minha-receita.js
 * Exibe os detalhes de uma receita do usuário carregada da API.
 * URL esperada: minha-receita.html?id=123
 */

(function () {
  'use strict';

  function escapeHtml(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function formatarMinutos(min) {
    if (!min || min <= 0) return null;
    if (min < 60) return min + ' min';
    const h = Math.floor(min / 60), m = min % 60;
    return m > 0 ? h + 'h ' + m + 'min' : h + 'h';
  }

  function formatarData(iso) {
    try {
      return new Date(iso).toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' });
    } catch (_) { return ''; }
  }

  // ── Carregar da API ──────────────────────────────────────
  async function carregarReceita() {
    const params   = new URLSearchParams(window.location.search);
    const id       = params.get('id');
    const msgErro  = document.getElementById('msg-erro');
    const conteudo = document.getElementById('conteudo-receita');

    if (!id) {
      msgErro.textContent   = 'Nenhuma receita especificada.';
      msgErro.style.display = 'block';
      return;
    }

    var receita;
    try {
      receita = await RF.storage.buscarReceitaPorId(id);
    } catch (err) {
      msgErro.textContent   = 'Receita não encontrada ou acesso negado.';
      msgErro.style.display = 'block';
      return;
    }

    renderReceita(receita);
    conteudo.style.display = 'block';
  }

  function renderReceita(receita) {
    document.title = escapeHtml(receita.nome) + ' — ReceitaFácil';

    // Imagem
    const wrapperImagem = document.getElementById('wrapper-imagem');
    const imgSrc = receita.imagem_url || receita.imagem || '';
    if (wrapperImagem) {
      if (imgSrc) {
        const img = document.createElement('img');
        img.className = 'receita-imagem';
        img.src = imgSrc;
        img.alt = 'Foto de ' + escapeHtml(receita.nome);
        wrapperImagem.appendChild(img);
      } else {
        const ph = document.createElement('div');
        ph.className   = 'receita-imagem-placeholder';
        ph.textContent = '🍽️';
        wrapperImagem.appendChild(ph);
      }
    }

    // Categoria
    if (receita.categoria) {
      const badge = document.getElementById('badge-categoria');
      if (badge) { badge.textContent = receita.categoria; badge.style.display = 'inline-block'; }
    }

    // Nome e descrição
    const nomeEl = document.getElementById('receita-nome');
    const descEl = document.getElementById('receita-descricao');
    if (nomeEl) nomeEl.textContent = receita.nome;
    if (descEl) descEl.textContent = receita.descricao || '';

    // Meta
    const meta  = document.getElementById('receita-meta');
    const tempo = formatarMinutos(receita.tempo_preparo || receita.tempoPreparo);
    if (meta) {
      if (tempo)          meta.innerHTML += '<span>⏱️ ' + escapeHtml(tempo) + '</span>';
      if (receita.porcoes > 0) meta.innerHTML += '<span>🍽️ ' + receita.porcoes + ' porção(ões)</span>';
    }

    // Botão editar
    const btnEditar = document.getElementById('btn-editar');
    if (btnEditar) btnEditar.href = 'editar-receita.html?id=' + encodeURIComponent(receita.id);

    // Botão excluir
    const btnExcluir = document.getElementById('btn-excluir');
    if (btnExcluir) {
      btnExcluir.addEventListener('click', function () { abrirModalExcluir(receita.id); });
    }

    // Ingredientes
    const listaIng = document.getElementById('lista-ingredientes');
    if (listaIng && receita.ingredientes && receita.ingredientes.length > 0) {
      receita.ingredientes.forEach(function (ing) {
        const li = document.createElement('li');
        li.innerHTML = '<span>' + escapeHtml(ing.nome) + '</span><strong>' + escapeHtml(ing.quantidade) + '</strong>';
        listaIng.appendChild(li);
      });
    }

    // Etapas
    const listaEtapas = document.getElementById('lista-etapas');
    if (listaEtapas && receita.etapas && receita.etapas.length > 0) {
      receita.etapas.forEach(function (etapa) {
        const li = document.createElement('li');
        li.textContent = etapa.descricao;
        listaEtapas.appendChild(li);
      });
    }

    // Data de criação
    const dataCriacaoEl = document.getElementById('data-criacao');
    const dataStr = receita.created_at || receita.dataCriacao;
    if (dataCriacaoEl && dataStr) {
      dataCriacaoEl.textContent = 'Cadastrada em ' + formatarData(dataStr);
    }
  }

  // ── Modal de exclusão ────────────────────────────────────
  function abrirModalExcluir(id) {
    const modal = document.getElementById('modal-excluir');
    if (!modal) return;
    modal.style.display = 'flex';

    document.getElementById('btn-cancelar-excluir').onclick = () => { modal.style.display = 'none'; };
    document.getElementById('btn-confirmar-excluir').onclick = () => excluirReceita(id);
  }

  async function excluirReceita(id) {
    try {
      await RF.storage.excluirReceita(id);
      window.location.href = 'minhas-receitas.html';
    } catch (err) {
      alert('Erro ao excluir receita: ' + (err.message || err));
    }
  }

  const modal = document.getElementById('modal-excluir');
  if (modal) modal.addEventListener('click', function (e) { if (e.target === this) this.style.display = 'none'; });

  carregarReceita();
})();
