/**
 * js/cadastro-receita.js
 * Gerencia o formulário de cadastro de nova receita.
 * Salva via API REST em vez de localStorage.
 */

(function () {
  'use strict';

  let ingredientes  = [];
  let etapas        = [];
  let imagemBase64  = '';

  const nomeInput       = document.getElementById('nome-receita');
  const descInput       = document.getElementById('descricao-receita');
  const tempoInput      = document.getElementById('tempo-preparo');
  const porcoesInput    = document.getElementById('porcoes');
  const categoriaInput  = document.getElementById('categoria');
  const imagemInput     = document.getElementById('imagem-receita');
  const previewImg      = document.getElementById('preview-imagem');
  const labelUpload     = document.getElementById('label-upload');

  const ingNomeInput      = document.getElementById('ing-nome');
  const ingQtdInput       = document.getElementById('ing-qtd');
  const btnAddIng         = document.getElementById('btn-add-ingrediente');
  const listaIngredientes = document.getElementById('lista-ingredientes');
  const vazioIngredientes = document.getElementById('vazio-ingredientes');

  const etapaDescInput  = document.getElementById('etapa-descricao');
  const btnAddEtapa     = document.getElementById('btn-add-etapa');
  const listaEtapas     = document.getElementById('lista-etapas');
  const vazioEtapas     = document.getElementById('vazio-etapas');

  const btnSalvar       = document.getElementById('btn-salvar');
  const mensagemGlobal  = document.getElementById('mensagem-global');
  const mensagemSucesso = document.getElementById('mensagem-sucesso');

  // ── Helpers ──────────────────────────────────────────────
  function mostrarErro(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent    = msg;
    el.style.display  = msg ? 'block' : 'none';
  }

  function limparErros() {
    ['erro-nome','erro-descricao','erro-ingrediente',
     'erro-lista-ingredientes','erro-etapa','erro-lista-etapas'].forEach(id => mostrarErro(id, ''));
    mensagemGlobal.style.display  = 'none';
    mensagemSucesso.style.display = 'none';
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── Preview de imagem ────────────────────────────────────
  imagemInput.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      imagemBase64 = e.target.result;
      previewImg.src          = imagemBase64;
      previewImg.style.display = 'block';
      labelUpload.textContent  = '✔ Imagem selecionada — clique para trocar';
    };
    reader.readAsDataURL(file);
  });

  // ── Ingredientes ─────────────────────────────────────────
  function renderIngredientes() {
    listaIngredientes.innerHTML = '';
    if (ingredientes.length === 0) { vazioIngredientes.style.display = 'block'; return; }
    vazioIngredientes.style.display = 'none';

    ingredientes.forEach(function (ing, idx) {
      const li = document.createElement('li');
      li.className = 'item-dinamico';
      li.innerHTML =
        '<div class="item-info">' +
          '<div class="item-nome">'    + escapeHtml(ing.nome)       + '</div>' +
          '<div class="item-detalhe">' + escapeHtml(ing.quantidade) + '</div>' +
        '</div>' +
        '<button class="btn-icone remover-fav" title="Remover ingrediente" data-idx="' + idx + '">✕</button>';
      listaIngredientes.appendChild(li);
    });

    listaIngredientes.querySelectorAll('[data-idx]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        ingredientes.splice(Number(this.dataset.idx), 1);
        renderIngredientes();
      });
    });
  }

  btnAddIng.addEventListener('click', function () {
    const nome = ingNomeInput.value.trim();
    const qtd  = ingQtdInput.value.trim();
    mostrarErro('erro-ingrediente', '');

    if (!nome) { mostrarErro('erro-ingrediente', 'Informe o nome do ingrediente.'); ingNomeInput.focus(); return; }
    if (!qtd)  { mostrarErro('erro-ingrediente', 'Informe a quantidade.');          ingQtdInput.focus();  return; }

    ingredientes.push({ nome, quantidade: qtd });
    ingNomeInput.value = '';
    ingQtdInput.value  = '';
    ingNomeInput.focus();
    mostrarErro('erro-lista-ingredientes', '');
    renderIngredientes();
  });

  [ingNomeInput, ingQtdInput].forEach(el =>
    el.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); btnAddIng.click(); } })
  );

  // ── Etapas ───────────────────────────────────────────────
  function renderEtapas() {
    listaEtapas.innerHTML = '';
    if (etapas.length === 0) { vazioEtapas.style.display = 'block'; return; }
    vazioEtapas.style.display = 'none';

    etapas.forEach(function (etapa, idx) {
      const li = document.createElement('li');
      li.className = 'item-dinamico';
      li.innerHTML =
        '<div class="numero-etapa">' + etapa.numero + '</div>' +
        '<div class="item-info"><div class="item-nome">' + escapeHtml(etapa.descricao) + '</div></div>' +
        '<button class="btn-icone remover-fav" title="Remover etapa" data-idx="' + idx + '">✕</button>';
      listaEtapas.appendChild(li);
    });

    listaEtapas.querySelectorAll('[data-idx]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        etapas.splice(Number(this.dataset.idx), 1);
        etapas = etapas.map((e, i) => ({ numero: i + 1, descricao: e.descricao }));
        renderEtapas();
      });
    });
  }

  btnAddEtapa.addEventListener('click', function () {
    const desc = etapaDescInput.value.trim();
    mostrarErro('erro-etapa', '');
    if (!desc) { mostrarErro('erro-etapa', 'Informe a descrição da etapa.'); etapaDescInput.focus(); return; }
    etapas.push({ numero: etapas.length + 1, descricao: desc });
    etapaDescInput.value = '';
    etapaDescInput.focus();
    mostrarErro('erro-lista-etapas', '');
    renderEtapas();
  });

  etapaDescInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); btnAddEtapa.click(); }
  });

  // ── Validação ────────────────────────────────────────────
  function validar() {
    let ok = true;
    if (!nomeInput.value.trim())   { mostrarErro('erro-nome',              'O nome da receita é obrigatório.'); ok = false; }
    if (!descInput.value.trim())   { mostrarErro('erro-descricao',         'A descrição é obrigatória.');       ok = false; }
    if (ingredientes.length === 0) { mostrarErro('erro-lista-ingredientes','Adicione pelo menos um ingrediente.'); ok = false; }
    if (etapas.length === 0)       { mostrarErro('erro-lista-etapas',      'Adicione pelo menos uma etapa.');   ok = false; }
    return ok;
  }

  // ── Salvar via API ───────────────────────────────────────
  btnSalvar.addEventListener('click', async function () {
    limparErros();
    if (!validar()) {
      mensagemGlobal.textContent   = 'Por favor, corrija os erros antes de salvar.';
      mensagemGlobal.style.display = 'block';
      mensagemGlobal.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    btnSalvar.disabled = true;

    const dados = {
      nome:         nomeInput.value.trim(),
      descricao:    descInput.value.trim(),
      categoria:    categoriaInput.value,
      tempo_preparo: Number(tempoInput.value)    || null,
      porcoes:       Number(porcoesInput.value)  || null,
      imagem_url:   imagemBase64 || null,
      ingredientes: ingredientes.slice(),
      etapas:       etapas.slice(),
    };

    try {
      await RF.storage.salvarReceita(dados);

      mensagemSucesso.textContent   = '✔ Receita salva com sucesso! Redirecionando...';
      mensagemSucesso.style.display = 'block';
      mensagemSucesso.scrollIntoView({ behavior: 'smooth', block: 'center' });

      setTimeout(() => { window.location.href = 'minhas-receitas.html'; }, 2000);

    } catch (err) {
      mensagemGlobal.textContent   = 'Erro ao salvar receita: ' + (err.message || 'tente novamente.');
      mensagemGlobal.style.display = 'block';
      btnSalvar.disabled = false;
    }
  });

  renderIngredientes();
  renderEtapas();
})();
