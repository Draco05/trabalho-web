/**
 * js/minhas-receitas.js
 * Carrega as receitas cadastradas pelo usuário da API,
 * renderiza a lista e gerencia exclusões.
 */

(function () {
  'use strict';

  const listaCadastradas    = document.getElementById('lista-cadastradas');
  const vazioCadastradas    = document.getElementById('vazio-cadastradas');
  const contadorCadastradas = document.getElementById('contador-cadastradas');

  async function carregarReceitas() {
    var todasReceitas;
    try {
      todasReceitas = await RF.storage.buscarReceitas();
    } catch (err) {
      console.error('[MinhasReceitas]', err);
      todasReceitas = [];
    }

    // Filtra só as receitas do usuário (usuario_id preenchido)
    // A API já retorna apenas globais + próprias, então qualquer
    // receita com usuario_id não-nulo é do usuário logado.
    var minhasReceitas = todasReceitas.filter(function (r) {
      return r.usuario_id !== null && r.usuario_id !== undefined;
    });

    listaCadastradas.innerHTML = '';

    if (minhasReceitas.length === 0) {
      vazioCadastradas.style.display = 'block';
      if (contadorCadastradas) contadorCadastradas.textContent = '';
      return;
    }

    vazioCadastradas.style.display = 'none';
    if (contadorCadastradas) {
      contadorCadastradas.textContent = '(' + minhasReceitas.length + ')';
    }

    // Ordena da mais recente para a mais antiga
    minhasReceitas.sort(function (a, b) {
      return new Date(b.created_at || b.dataCriacao) - new Date(a.created_at || a.dataCriacao);
    });

    minhasReceitas.forEach(function (receita) {
      listaCadastradas.appendChild(criarItemReceita(receita));
    });
  }

  function criarItemReceita(receita) {
    const li = document.createElement('li');
    li.className = 'item-receita-cadastrada';
    li.dataset.id = receita.id;

    const tempo = formatarMinutos(receita.tempo_preparo || receita.tempoPreparo);
    const meta  = [receita.categoria, tempo].filter(Boolean).join(' · ');

    li.innerHTML =
      '<div class="receita-cadastrada-info">' +
        '<div class="receita-cadastrada-nome">' + escapeHtml(receita.nome) + '</div>' +
        (meta ? '<div class="receita-cadastrada-meta">' + escapeHtml(meta) + '</div>' : '') +
      '</div>' +
      '<div class="receita-cadastrada-acoes">' +
        '<a href="receita.html?id=' + encodeURIComponent(receita.id) + '&source=minhas-receitas" ' +
           'class="btn btn-secundario btn-pequeno" title="Visualizar receita">👁️ Ver</a>' +
        '<a href="editar-receita.html?id=' + encodeURIComponent(receita.id) + '" ' +
           'class="btn btn-secundario btn-pequeno" title="Editar receita">✏️ Editar</a>' +
        '<button class="btn btn-perigo btn-pequeno btn-excluir" ' +
                'data-id="' + escapeHtml(String(receita.id)) + '" ' +
                'title="Excluir receita">🗑️ Excluir</button>' +
      '</div>';

    li.querySelector('.btn-excluir').addEventListener('click', function () {
      abrirModalExcluir(receita.id, receita.nome);
    });

    return li;
  }

  // ── Modal de exclusão ────────────────────────────────────
  function abrirModalExcluir(id, nome) {
    const modal      = document.getElementById('modal-excluir');
    const textoModal = document.getElementById('texto-modal-excluir');

    if (textoModal) {
      textoModal.textContent = 'Tem certeza que deseja excluir "' + nome + '"? Esta ação não pode ser desfeita.';
    }

    modal.style.display = 'flex';

    document.getElementById('btn-cancelar-excluir').onclick = function () {
      modal.style.display = 'none';
    };

    document.getElementById('btn-confirmar-excluir').onclick = async function () {
      modal.style.display = 'none';
      try {
        await RF.storage.excluirReceita(id);
        await carregarReceitas();
      } catch (err) {
        alert('Erro ao excluir receita: ' + (err.message || err));
      }
    };
  }

  // Fechar modal ao clicar fora
  const modal = document.getElementById('modal-excluir');
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === this) this.style.display = 'none';
    });
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function formatarMinutos(min) {
    if (!min || min <= 0) return null;
    if (min < 60) return min + ' min';
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? h + 'h ' + m + 'min' : h + 'h';
  }

  carregarReceitas();
})();
