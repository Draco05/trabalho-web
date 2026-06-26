/**
 * js/buscar-receita.js
 * Gerencia a página de busca de ingredientes.
 * A dispensa (lista de ingredientes do usuário) é mantida em
 * sessionStorage — é um dado efêmero de UX, não de negócio.
 * A chamada à API só ocorre no momento da busca (resultados.js).
 */

(function () {
  'use strict';

  var CHAVE_DISPENSA = 'dispensaUsuario';

  var dispensa    = [];
  var editandoIdx = null;

  var inputNome = document.getElementById('ing-nome');
  var inputQtd  = document.getElementById('ing-qtd');
  var inputVal  = document.getElementById('ing-val');
  var btnAdd    = document.querySelector('#form-add .btn');
  var listaEl   = document.getElementById('lista-ingredientes');
  var vazioEl   = document.getElementById('vazio');
  var erroEl    = document.getElementById('erro-add');
  var btnBuscar = document.querySelector('#secao-buscar .btn');

  function init() {
    carregarDispensa();
    renderLista();

    btnAdd.addEventListener('click', onAddOuEditar);

    [inputNome, inputQtd, inputVal].forEach(function (el) {
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); onAddOuEditar(); }
      });
    });

    if (btnBuscar) btnBuscar.addEventListener('click', onBuscar);
  }

  // ── Persistência da dispensa (sessionStorage — dado local de UX) ──
  function carregarDispensa() {
    try {
      dispensa = JSON.parse(sessionStorage.getItem(CHAVE_DISPENSA) || '[]');
    } catch (_) { dispensa = []; }
  }

  function salvarDispensa() {
    sessionStorage.setItem(CHAVE_DISPENSA, JSON.stringify(dispensa));
  }

  // ── Adicionar / editar ────────────────────────────────────
  function onAddOuEditar() {
    var nome = inputNome.value.trim();
    var qtd  = inputQtd.value.trim();
    var val  = inputVal.value;

    erroEl.style.display = 'none';

    if (!nome) {
      mostrarErro('Informe o nome do ingrediente.');
      inputNome.focus();
      return;
    }

    var jaExiste = dispensa.some(function (item, idx) {
      return idx !== editandoIdx && normalizar(item.nome) === normalizar(nome);
    });

    if (jaExiste) {
      mostrarErro('Este ingrediente já foi adicionado.');
      inputNome.focus();
      return;
    }

    var item = { nome: nome, quantidade: qtd || 'a gosto', validade: val || '' };

    if (editandoIdx !== null) {
      dispensa[editandoIdx] = item;
      editandoIdx = null;
      btnAdd.textContent = '+ Adicionar';
    } else {
      dispensa.push(item);
    }

    salvarDispensa();
    limparForm();
    renderLista();
  }

  function removerItem(idx) {
    dispensa.splice(idx, 1);
    salvarDispensa();
    if (editandoIdx === idx) {
      editandoIdx = null;
      btnAdd.textContent = '+ Adicionar';
      limparForm();
    }
    renderLista();
  }

  function editarItem(idx) {
    var item = dispensa[idx];
    inputNome.value = item.nome;
    inputQtd.value  = item.quantidade !== 'a gosto' ? item.quantidade : '';
    inputVal.value  = item.validade || '';
    editandoIdx = idx;
    btnAdd.textContent = '✔ Salvar edição';
    inputNome.focus();
    inputNome.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // ── Render ───────────────────────────────────────────────
  function renderLista() {
    listaEl.innerHTML = '';

    if (dispensa.length === 0) {
      vazioEl.style.display = 'block';
      var secao = document.getElementById('secao-buscar');
      if (secao) secao.style.display = 'none';
      return;
    }

    vazioEl.style.display = 'none';
    var secao = document.getElementById('secao-buscar');
    if (secao) secao.style.display = 'block';

    dispensa.forEach(function (item, idx) {
      var dias = RF.busca ? RF.busca.diasRestantes(item.validade) : null;
      var classeVal = '';
      var textoVal  = '';

      if (item.validade) {
        var partes = item.validade.split('-');
        if (partes.length === 3) {
          textoVal = 'Val: ' + partes[2] + '/' + partes[1] + '/' + partes[0];
        } else {
          textoVal = 'Val: ' + (partes[1] || '') + '/' + (partes[0] || '');
        }
        if      (dias === null) classeVal = '';
        else if (dias < 0)     classeVal = 'vencido';
        else if (dias <= 7)    classeVal = 'vencendo';
      }

      var li = document.createElement('li');
      li.className = 'item-ingrediente';
      li.innerHTML =
        '<span class="nome-ing">' + esc(item.nome) + '</span>' +
        '<span class="qtd-ing">'  + esc(item.quantidade) + '</span>' +
        '<span class="val-ing ' + classeVal + '">' +
          (textoVal || '<span style="visibility:hidden">—</span>') +
        '</span>' +
        '<div class="acoes">' +
          '<button class="btn-icone btn-editar-ing" title="Editar" data-idx="' + idx + '">' +
            '<img src="imgs/edit-3-svgrepo-com.svg">' +
          '</button>' +
          '<button class="btn-icone remover-fav btn-remover-ing" title="Remover" data-idx="' + idx + '">✕</button>' +
        '</div>';

      listaEl.appendChild(li);
    });

    listaEl.querySelectorAll('.btn-editar-ing').forEach(function (btn) {
      btn.addEventListener('click', function () { editarItem(Number(this.dataset.idx)); });
    });
    listaEl.querySelectorAll('.btn-remover-ing').forEach(function (btn) {
      btn.addEventListener('click', function () { removerItem(Number(this.dataset.idx)); });
    });
  }

  // ── Buscar ───────────────────────────────────────────────
  function onBuscar(e) {
    e.preventDefault();

    if (dispensa.length === 0) {
      mostrarErro('Adicione pelo menos um ingrediente antes de buscar.');
      return;
    }

    // Salva termos no histórico (sessionStorage — síncrono)
    var termos = dispensa.map(function (i) { return i.nome; }).join(', ');
    if (window.RF && RF.storage) RF.storage.salvarHistorico(termos);

    // Passa dispensa para a página de resultados via sessionStorage
    sessionStorage.setItem('dispensaBusca', JSON.stringify(dispensa));
    window.location.href = 'resultados.html';
  }

  // ── Utilitários ──────────────────────────────────────────
  function mostrarErro(msg) {
    erroEl.textContent   = msg;
    erroEl.style.display = 'block';
  }

  function limparForm() {
    inputNome.value      = '';
    inputQtd.value       = '';
    inputVal.value       = '';
    erroEl.style.display = 'none';
    inputNome.focus();
  }

  function normalizar(str) {
    return String(str || '').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  function esc(str) {
    return String(str || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  init();
})();
