/**
 * js/busca.js — Motor de Busca e Algoritmo de Recomendação
 * ──────────────────────────────────────────────────────────
 * Implementa a pontuação em três fatores:
 *   70% compatibilidade de ingredientes
 *   20% compatibilidade de quantidades
 *   10% prioridade por validade (anti-desperdício)
 *
 * Depende de: storage.js
 * Exporta: window.RF.busca
 */

(function (global) {
  'use strict';

  // ══════════════════════════════════════════════════
  // NORMALIZAÇÃO DE TEXTO
  // Garante comparação robusta ignorando acentos,
  // maiúsculas e espaços extras.
  // ══════════════════════════════════════════════════

  /**
   * Normaliza uma string para comparação:
   * minúsculas, sem acentos, sem espaços duplos.
   * @param {string} str
   * @returns {string}
   */
  function normalizar(str) {
    return String(str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')  // remove diacríticos
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Verifica se dois nomes de ingredientes se referem
   * ao mesmo item (correspondência parcial bidirecional).
   * Ex: "ovo" ↔ "ovo de galinha" → true
   * @param {string} a
   * @param {string} b
   * @returns {boolean}
   */
  function ingredientesCompatíveis(a, b) {
    var na = normalizar(a);
    var nb = normalizar(b);
    return na === nb || na.includes(nb) || nb.includes(na);
  }

  // ══════════════════════════════════════════════════
  // PARSE DE QUANTIDADE
  // Extrai o valor numérico de strings como "500g",
  // "2 xícaras", "3 unidades", "1/2 colher".
  // ══════════════════════════════════════════════════

  /**
   * Converte uma string de quantidade em número puro.
   * Frações ("1/2", "3/4") são suportadas.
   * Retorna null se não for possível extrair.
   * @param {string} qtdStr
   * @returns {number|null}
   */
  function parsearQuantidade(qtdStr) {
    if (!qtdStr) return null;
    var s = String(qtdStr).trim();

    // Suporte a frações: "1/2", "3/4"
    var fracMatch = s.match(/^(\d+)\/(\d+)/);
    if (fracMatch) {
      return parseInt(fracMatch[1], 10) / parseInt(fracMatch[2], 10);
    }

    // Número + possível unidade: "500g", "2 unidades", "1,5 kg"
    var numMatch = s.replace(',', '.').match(/^[\d.]+/);
    if (numMatch) return parseFloat(numMatch[0]);

    return null;
  }

  /**
   * Calcula a compatibilidade de quantidade entre o que
   * o usuário tem e o que a receita precisa.
   * Resultado entre 0 e 1 (limitado a 1 = 100%).
   *
   * @param {string} qtdUsuario   ex: "1000 ml"
   * @param {string} qtdReceita   ex: "500 ml"
   * @returns {number} 0–1
   */
  function compatibilidadeQtd(qtdUsuario, qtdReceita) {
    var u = parsearQuantidade(qtdUsuario);
    var r = parsearQuantidade(qtdReceita);

    // Se não conseguimos extrair os números, assumimos 100%
    // (não penaliza quando a unidade não é comparável)
    if (u === null || r === null || r === 0) return 1;

    return Math.min(1, u / r);
  }

  // ══════════════════════════════════════════════════
  // SCORE DE VALIDADE
  // Ingredientes próximos do vencimento aumentam a
  // relevância da receita (anti-desperdício).
  // ══════════════════════════════════════════════════

  /**
   * Converte string de validade em dias restantes.
   * Formatos aceitos:
   *   "YYYY-MM-DD" (input type=date — formato principal)
   *   "YYYY-MM"    (input type=month — legado, assume último dia do mês)
   * @param {string} validade
   * @returns {number|null}
   */
  function diasRestantes(validade) {
    if (!validade) return null;

    var data;
    var partes = validade.split('-');

    if (partes.length === 3) {
      // Formato "YYYY-MM-DD" (input type=date)
      data = new Date(
        parseInt(partes[0], 10),
        parseInt(partes[1], 10) - 1,
        parseInt(partes[2], 10)
      );
    } else if (partes.length === 2) {
      // Formato "YYYY-MM" (legado — último dia do mês)
      data = new Date(parseInt(partes[0], 10), parseInt(partes[1], 10), 0);
    } else {
      data = new Date(validade);
    }

    if (isNaN(data.getTime())) return null;

    var hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    data.setHours(0, 0, 0, 0);

    return Math.floor((data - hoje) / (1000 * 60 * 60 * 24));
  }

  /**
   * Retorna o score de validade (0–1) para um ingrediente.
   * Quanto menor o prazo, maior o score.
   * @param {number|null} dias
   * @returns {number} 0–1
   */
  function scoreValidade(dias) {
    if (dias === null) return 0;    // sem validade informada → não contribui
    if (dias < 0)      return 0;    // vencido → não conta (não recomenda usar)
    if (dias <= 3)     return 1.00;
    if (dias <= 7)     return 0.75;
    if (dias <= 15)    return 0.50;
    if (dias <= 30)    return 0.25;
    return 0;
  }

  // ══════════════════════════════════════════════════
  // ALGORITMO PRINCIPAL
  // ══════════════════════════════════════════════════

  /**
   * Calcula o score completo de uma receita em relação
   * à dispensa do usuário.
   *
   * @param {Object}   receita   Objeto no formato padrão
   * @param {Object[]} dispensa  Array de { nome, quantidade, validade }
   * @returns {Object} resultado com score e detalhes
   */
  function calcularScore(receita, dispensa) {
    var totalIng      = receita.ingredientes.length;
    var encontrados   = [];  // ingredientes que o usuário tem
    var faltantes     = [];  // ingredientes que o usuário não tem
    var scoreQtdTotal = 0;
    var scoreValidadeTotal = 0;
    var ingredientesVencendo = [];

    receita.ingredientes.forEach(function (ingReceita) {
      // Procurar na dispensa do usuário
      var match = null;
      dispensa.forEach(function (ingUsuario) {
        if (!match && ingredientesCompatíveis(ingReceita.nome, ingUsuario.nome)) {
          match = ingUsuario;
        }
      });

      if (match) {
        // ── Compatibilidade de quantidade ─────────────
        var pctQtd = compatibilidadeQtd(match.quantidade, ingReceita.quantidade);
        scoreQtdTotal += pctQtd;

        // ── Validade ──────────────────────────────────
        var dias = diasRestantes(match.validade);
        var sv   = scoreValidade(dias);
        scoreValidadeTotal += sv;

        // Marcar ingredientes que vencem em breve
        if (dias !== null && dias >= 0 && dias <= 7) {
          ingredientesVencendo.push({
            nome: ingReceita.nome,
            dias: dias,
            texto: dias === 0
              ? 'vence hoje'
              : dias === 1
                ? 'vence amanhã'
                : 'vence em ' + dias + ' dias'
          });
        }

        encontrados.push({
          nome:          ingReceita.nome,
          quantReceita:  ingReceita.quantidade,
          quantUsuario:  match.quantidade,
          pctQtd:        Math.round(pctQtd * 100),
          dias:          dias
        });
      } else {
        faltantes.push(ingReceita.nome);
      }
    });

    var numEncontrados = encontrados.length;

    // ── Cálculo de cada fator (0–100) ─────────────────
    var scoreIngredientes = totalIng > 0
      ? (numEncontrados / totalIng) * 100
      : 0;

    var scoreQuantidades = numEncontrados > 0
      ? (scoreQtdTotal / numEncontrados) * 100
      : 0;

    var scoreValidadeFinal = numEncontrados > 0
      ? (scoreValidadeTotal / numEncontrados) * 100
      : 0;

    // ── Score final ponderado ─────────────────────────
    //   70% ingredientes + 20% quantidades + 10% validade
    var scoreFinal =
      0.70 * scoreIngredientes +
      0.20 * scoreQuantidades  +
      0.10 * scoreValidadeFinal;

    // ── Bônus de urgência (anti-desperdício) ──────────
    // Receitas que usam ingredientes da dispensa próximos
    // de vencer recebem um bônus de até 15 pontos.
    // Usa o menor prazo de validade entre os ingredientes
    // encontrados para calcular a urgência.
    var menorDias = null;
    encontrados.forEach(function (e) {
      if (e.dias !== null && e.dias >= 0) {
        if (menorDias === null || e.dias < menorDias) {
          menorDias = e.dias;
        }
      }
    });

    var urgencyBonus = 0;
    if (menorDias !== null) {
      if      (menorDias <= 1)  urgencyBonus = 15;
      else if (menorDias <= 3)  urgencyBonus = 12;
      else if (menorDias <= 7)  urgencyBonus = 8;
      else if (menorDias <= 15) urgencyBonus = 4;
      else if (menorDias <= 30) urgencyBonus = 2;
    }

    scoreFinal = Math.min(100, scoreFinal + urgencyBonus);

    return {
      receita:              receita,
      scoreFinal:           Math.round(scoreFinal * 10) / 10,
      scoreIngredientes:    Math.round(scoreIngredientes * 10) / 10,
      scoreQuantidades:     Math.round(scoreQuantidades * 10) / 10,
      scoreValidade:        Math.round(scoreValidadeFinal * 10) / 10,
      urgencyBonus:         urgencyBonus,
      menorDiasValidade:    menorDias,
      numEncontrados:       numEncontrados,
      totalIngredientes:    totalIng,
      numFaltantes:         faltantes.length,
      encontrados:          encontrados,
      faltantes:            faltantes,
      ingredientesVencendo: ingredientesVencendo
    };
  }

  /**
   * Executa a busca completa: calcula scores, aplica filtros
   * e ordena resultados.
   *
   * @param {Object[]} dispensa      Ingredientes do usuário
   * @param {Object}   filtros       { categoria, tempo, minEncontrados }
   * @returns {Object[]} resultados ordenados
   */
  function executarBusca(dispensa, filtros) {
    filtros = filtros || {};

    if (!dispensa || dispensa.length === 0) return [];

    var todasReceitas = (global.RF && global.RF.storage)
      ? global.RF.storage.buscarReceitas()
      : [];

    // Filtrar receitas vencidas (que pedem ingrediente vencido como ÚNICO disponível)
    // e calcular o score
    var resultados = [];

    todasReceitas.forEach(function (receita) {
      // Pular receitas sem ingredientes
      if (!receita.ingredientes || receita.ingredientes.length === 0) return;

      var res = calcularScore(receita, dispensa);

      // Só exibir receitas onde o usuário tem pelo menos 1 ingrediente
      if (res.numEncontrados === 0) return;

      // ── Aplicar filtros ─────────────────────────────
      if (filtros.categoria && filtros.categoria !== 'Todas') {
        if (receita.categoria !== filtros.categoria) return;
      }

      if (filtros.tempo) {
        var t = parseInt(filtros.tempo, 10);
        if (!isNaN(t) && receita.tempoPreparo > t) return;
      }

      if (filtros.minEncontrados) {
        var min = parseInt(filtros.minEncontrados, 10);
        if (!isNaN(min) && res.numEncontrados < min) return;
      }

      resultados.push(res);
    });

    // ── Ordenação ────────────────────────────────────
    // 1. Score final (maior primeiro — já inclui o bônus de urgência)
    // 2. Bônus de urgência (desempate — prioriza anti-desperdício)
    // 3. Menor prazo de validade (ingrediente mais urgente primeiro)
    // 4. Menos faltantes
    // 5. Menor tempo de preparo
    resultados.sort(function (a, b) {
      if (b.scoreFinal !== a.scoreFinal)         return b.scoreFinal - a.scoreFinal;
      if (b.urgencyBonus !== a.urgencyBonus)     return b.urgencyBonus - a.urgencyBonus;
      var da = a.menorDiasValidade !== null ? a.menorDiasValidade : 9999;
      var db = b.menorDiasValidade !== null ? b.menorDiasValidade : 9999;
      if (da !== db)                             return da - db;
      if (a.numFaltantes !== b.numFaltantes)     return a.numFaltantes - b.numFaltantes;
      return (a.receita.tempoPreparo || 999) - (b.receita.tempoPreparo || 999);
    });

    return resultados;
  }

  // ══════════════════════════════════════════════════
  // EXPORTAÇÃO
  // ══════════════════════════════════════════════════

  /**
   * Versão que recebe o array de receitas já carregado externamente (async).
   * Usada por resultados.js após buscar receitas da API.
   */
  function executarBuscaEmReceitas(todasReceitas, dispensa, filtros) {
    filtros = filtros || {};
    if (!dispensa || dispensa.length === 0) return [];

    var resultados = [];

    todasReceitas.forEach(function (receita) {
      var ingredientes = receita.ingredientes || [];
      if (ingredientes.length === 0) return;

      var res = calcularScore(receita, dispensa);
      if (res.numEncontrados === 0) return;

      if (filtros.categoria && filtros.categoria !== 'Todas') {
        if (receita.categoria !== filtros.categoria) return;
      }
      if (filtros.tempo) {
        var t = parseInt(filtros.tempo, 10);
        var tempo = receita.tempo_preparo || receita.tempoPreparo || 0;
        if (!isNaN(t) && tempo > t) return;
      }
      if (filtros.minEncontrados) {
        var min = parseInt(filtros.minEncontrados, 10);
        if (!isNaN(min) && res.numEncontrados < min) return;
      }

      resultados.push(res);
    });

    resultados.sort(function (a, b) {
      if (b.scoreFinal !== a.scoreFinal)         return b.scoreFinal - a.scoreFinal;
      if (b.urgencyBonus !== a.urgencyBonus)     return b.urgencyBonus - a.urgencyBonus;
      var da = a.menorDiasValidade !== null ? a.menorDiasValidade : 9999;
      var db = b.menorDiasValidade !== null ? b.menorDiasValidade : 9999;
      if (da !== db)                             return da - db;
      if (a.numFaltantes !== b.numFaltantes)     return a.numFaltantes - b.numFaltantes;
      var ta = a.receita.tempo_preparo || a.receita.tempoPreparo || 999;
      var tb = b.receita.tempo_preparo || b.receita.tempoPreparo || 999;
      return ta - tb;
    });

    return resultados;
  }

  global.RF = global.RF || {};
  global.RF.busca = {
    executarBusca,
    executarBuscaEmReceitas,
    calcularScore,
    normalizar,
    ingredientesCompatíveis,
    diasRestantes,
    scoreValidade,
    parsearQuantidade
  };

})(window);
