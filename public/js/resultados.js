/**
 * js/resultados.js
 * Lê a dispensa do sessionStorage, busca receitas na API,
 * roda o motor de busca local (RF.busca) e exibe os resultados.
 */

(function () {
  'use strict';

  var listaEl       = document.getElementById('lista-resultados');
  var subtituloEl   = document.getElementById('subtitulo-resultados');
  var vazioEl       = document.getElementById('mensagem-vazia');
  var painelFiltros = document.getElementById('painel-filtros');

  var selCategoria, selTempo, selMinIng;

  var dispensa      = [];
  var todasReceitas = [];   // carregadas da API uma única vez
  var resultadosRaw = [];

  // ── Init ─────────────────────────────────────────────────
  async function init() {
    try {
      dispensa = JSON.parse(sessionStorage.getItem('dispensaBusca') || '[]');
    } catch (_) { dispensa = []; }

    renderFiltros();

    // Salvar histórico (síncrono — sessionStorage)
    if (window.RF && RF.storage && dispensa.length) {
      var termos = dispensa.map(function (i) { return i.nome; }).join(', ');
      RF.storage.salvarHistorico(termos);
    }

    // Buscar receitas da API
    try {
      todasReceitas = await RF.storage.buscarReceitas();
    } catch (err) {
      console.error('[Resultados] Erro ao buscar receitas:', err);
      todasReceitas = [];
    }

    executarEExibir();
  }

  // ── Filtros ──────────────────────────────────────────────
  function renderFiltros() {
    if (!painelFiltros) return;

    painelFiltros.innerHTML =
      '<div class="form-grupo">' +
        '<label for="fil-categoria">Categoria</label>' +
        '<select id="fil-categoria">' +
          '<option value="">Todas</option>' +
          '<option>Entrada</option>' +
          '<option>Prato Principal</option>' +
          '<option>Sobremesa</option>' +
          '<option>Lanche</option>' +
          '<option>Bebida</option>' +
        '</select>' +
      '</div>' +
      '<div class="form-grupo">' +
        '<label for="fil-tempo">Tempo de preparo</label>' +
        '<select id="fil-tempo">' +
          '<option value="">Qualquer tempo</option>' +
          '<option value="15">Até 15 min</option>' +
          '<option value="30">Até 30 min</option>' +
          '<option value="60">Até 60 min</option>' +
        '</select>' +
      '</div>' +
      '<div class="form-grupo">' +
        '<label for="fil-min-ing">Mín. ingredientes encontrados</label>' +
        '<select id="fil-min-ing">' +
          '<option value="">Qualquer</option>' +
          '<option value="2">≥ 2 ingredientes</option>' +
          '<option value="3">≥ 3 ingredientes</option>' +
          '<option value="5">≥ 5 ingredientes</option>' +
        '</select>' +
      '</div>';

    selCategoria = document.getElementById('fil-categoria');
    selTempo     = document.getElementById('fil-tempo');
    selMinIng    = document.getElementById('fil-min-ing');

    [selCategoria, selTempo, selMinIng].forEach(function (el) {
      el.addEventListener('change', aplicarFiltrosUI);
    });
  }

  function getFiltrosUI() {
    return {
      categoria:      selCategoria ? selCategoria.value : '',
      tempo:          selTempo     ? selTempo.value      : '',
      minEncontrados: selMinIng    ? selMinIng.value     : '',
    };
  }

  // ── Busca (síncrona sobre os dados já carregados) ─────────
  function executarEExibir() {
    if (!window.RF || !RF.busca) {
      console.error('[Resultados] RF.busca não disponível');
      return;
    }

    // Passa o array já carregado para o motor de busca
    resultadosRaw = RF.busca.executarBuscaEmReceitas(todasReceitas, dispensa, getFiltrosUI());
    renderResultados(resultadosRaw);
  }

  function aplicarFiltrosUI() {
    var filtrados = RF.busca.executarBuscaEmReceitas(todasReceitas, dispensa, getFiltrosUI());
    renderResultados(filtrados);
  }

  // ── Renderização ─────────────────────────────────────────
  function renderResultados(resultados) {
    listaEl.innerHTML = '';

    var ingredientesStr = dispensa.map(function (i) { return i.nome; }).join(', ');
    subtituloEl.textContent = dispensa.length
      ? 'Buscando por: ' + ingredientesStr
      : 'Mostrando receitas com base nos seus ingredientes';

    if (resultados.length === 0) {
      vazioEl.style.display = 'block';
      return;
    }
    vazioEl.style.display = 'none';

    resultados.forEach(function (res) {
      listaEl.appendChild(criarCardResultado(res));
    });
  }

  function criarCardResultado(res) {
    var r     = res.receita;
    var score = res.scoreFinal;
    var classeScore = score >= 75 ? 'alto' : score >= 40 ? 'medio' : 'baixo';

    var tempoStr = '';
    if (r.tempo_preparo && r.tempo_preparo > 0) {
      tempoStr = r.tempo_preparo < 60
        ? r.tempo_preparo + ' min'
        : Math.floor(r.tempo_preparo / 60) + 'h' +
          (r.tempo_preparo % 60 > 0 ? ' ' + r.tempo_preparo % 60 + 'min' : '');
    }

    var chipsEncontrados = res.encontrados.map(function (ing) {
      var classe = ing.pctQtd >= 100 ? 'chip-ok' : 'chip-vencendo';
      var sufixo = ing.pctQtd < 100 ? ' (' + ing.pctQtd + '%)' : '';
      return '<span class="chip ' + classe + '">' + esc(ing.nome) + sufixo + '</span>';
    }).join('');

    var chipsFaltantes = res.faltantes.map(function (nome) {
      return '<span class="chip chip-faltante">' + esc(nome) + '</span>';
    }).join('');

    var alertasValidade = res.ingredientesVencendo.map(function (iv) {
      return '<span class="alerta-validade">⚠ ' + esc(iv.nome) + ' — ' + iv.texto + '</span>';
    }).join('');

    var li = document.createElement('li');

    li.innerHTML =
      '<div class="card-resultado">' +
        '<div class="card-resultado-topo">' +
          '<div class="card-resultado-score">' +
            '<div class="score-numero ' + classeScore + '">' + score.toFixed(0) + '%</div>' +
            '<small>compatibilidade</small>' +
            '<div class="score-bar-wrap" style="margin-top:0.4rem;">' +
              '<div class="score-bar-fill ' + classeScore + '" style="width:' + score + '%"></div>' +
            '</div>' +
          '</div>' +
          '<div class="card-resultado-info">' +
            '<h3><a href="receita.html?id=' + esc(r.id) + '">' + esc(r.nome) + '</a></h3>' +
            '<div class="card-resultado-meta">' +
              (r.categoria  ? '<span>🏷 ' + esc(r.categoria) + '</span>' : '') +
              (tempoStr     ? '<span>⏱ ' + tempoStr + '</span>'         : '') +
              '<span>🥘 ' + res.numEncontrados + ' de ' + res.totalIngredientes + ' ingredientes</span>' +
            '</div>' +
            '<p class="card-resultado-desc">' + esc(r.descricao) + '</p>' +
          '</div>' +
          '<button class="btn-icone btn-fav-resultado" data-id="' + esc(r.id) + '" title="Favoritar" style="flex-shrink:0;font-size:1.1rem;">☆</button>' +
        '</div>' +
        (res.encontrados.length > 0
          ? '<div class="resultado-ing-linha"><span class="rotulo">✓ Tenho:</span><div class="chips">' + chipsEncontrados + '</div></div>' : '') +
        (res.faltantes.length > 0
          ? '<div class="resultado-ing-linha"><span class="rotulo">✗ Falta:</span><div class="chips">' + chipsFaltantes + '</div></div>' : '') +
        (alertasValidade
          ? '<div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:0.4rem;">' + alertasValidade + '</div>' : '') +
      '</div>';

    // Inicializar botão de favorito
    var btnFav = li.querySelector('.btn-fav-resultado');
    atualizarBtnFavAsync(r.id, btnFav);

    btnFav.addEventListener('click', function () {
      toggleFavorito(r.id, btnFav);
    });

    return li;
  }

  // ── Favoritos (assíncronos) ───────────────────────────────
  async function atualizarBtnFavAsync(id, btn) {
    try {
      var fav = await RF.storage.ehFavorito(id);
      btn.textContent = fav ? '★' : '☆';
      btn.title       = fav ? 'Remover dos favoritos' : 'Favoritar';
    } catch (_) {}
  }

  async function toggleFavorito(id, btn) {
    try {
      var fav = await RF.storage.ehFavorito(id);
      if (fav) {
        await RF.storage.removerFavorito(id);
        btn.textContent = '☆';
        btn.title       = 'Favoritar';
      } else {
        await RF.storage.adicionarFavorito(id);
        btn.textContent = '★';
        btn.title       = 'Remover dos favoritos';
      }
    } catch (err) {
      console.error('[Favorito]', err);
    }
  }

  function esc(str) {
    return String(str || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  init();
})();
