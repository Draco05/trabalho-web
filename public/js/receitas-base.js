/**
 * js/receitas-base.js — Banco de receitas inicial
 * ─────────────────────────────────────────────────
 * Na primeira execução, carrega 30 receitas de exemplo
 * no localStorage (chave 'receitasBase').
 * Deve ser carregado APÓS storage.js.
 */

(function (global) {
  'use strict';

  // ══════════════════════════════════════════════════
  // RECEITAS DE EXEMPLO
  // ══════════════════════════════════════════════════

  var RECEITAS_BASE = [

    // ── ENTRADAS (6) ─────────────────────────────────

    {
      id: 'base_001',
      nome: 'Bruschetta de Tomate',
      descricao: 'Torrada crocante com tomate fresco, alho e manjericão. Clássico italiano como entrada.',
      categoria: 'Entrada',
      tempoPreparo: 15,
      porcoes: 4,
      imagem: '',
      ingredientes: [
        { nome: 'pão italiano', quantidade: '1 unidade' },
        { nome: 'tomate', quantidade: '3 unidades' },
        { nome: 'alho', quantidade: '2 dentes' },
        { nome: 'manjericão fresco', quantidade: '1 maço' },
        { nome: 'azeite', quantidade: '3 colheres de sopa' },
        { nome: 'sal', quantidade: 'a gosto' }
      ],
      etapas: [
        { numero: 1, descricao: 'Corte o pão em fatias e toste no forno a 200 °C por 5 minutos.' },
        { numero: 2, descricao: 'Pique o tomate em cubos pequenos e misture com sal, azeite e manjericão.' },
        { numero: 3, descricao: 'Esfregue o alho nas fatias de pão tostadas.' },
        { numero: 4, descricao: 'Distribua a mistura de tomate sobre o pão e sirva imediatamente.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    },

    {
      id: 'base_002',
      nome: 'Sopa de Cebola Gratinada',
      descricao: 'Sopa clássica francesa com cebolas caramelizadas, caldo e queijo gratinado.',
      categoria: 'Entrada',
      tempoPreparo: 50,
      porcoes: 4,
      imagem: '',
      ingredientes: [
        { nome: 'cebola', quantidade: '4 unidades grandes' },
        { nome: 'manteiga', quantidade: '3 colheres de sopa' },
        { nome: 'caldo de carne', quantidade: '1 litro' },
        { nome: 'farinha de trigo', quantidade: '1 colher de sopa' },
        { nome: 'queijo gruyère', quantidade: '150g' },
        { nome: 'pão francês', quantidade: '4 fatias' },
        { nome: 'sal', quantidade: 'a gosto' },
        { nome: 'pimenta-do-reino', quantidade: 'a gosto' }
      ],
      etapas: [
        { numero: 1, descricao: 'Fatie as cebolas finamente e caramelize na manteiga em fogo baixo por 30 minutos.' },
        { numero: 2, descricao: 'Polvilhe a farinha e misture bem; acrescente o caldo quente.' },
        { numero: 3, descricao: 'Cozinhe por 10 minutos, ajuste o sal e a pimenta.' },
        { numero: 4, descricao: 'Distribua em tigelas refratárias, coloque uma fatia de pão e cubra com queijo.' },
        { numero: 5, descricao: 'Gratine no forno a 220 °C por 5–8 minutos até dourar.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    },

    {
      id: 'base_003',
      nome: 'Salada Caprese',
      descricao: 'Salada refrescante de tomate, mozzarella e manjericão com fio de azeite.',
      categoria: 'Entrada',
      tempoPreparo: 10,
      porcoes: 2,
      imagem: '',
      ingredientes: [
        { nome: 'tomate', quantidade: '2 unidades' },
        { nome: 'mozzarella fresca', quantidade: '200g' },
        { nome: 'manjericão fresco', quantidade: '1 maço' },
        { nome: 'azeite extravirgem', quantidade: '2 colheres de sopa' },
        { nome: 'sal', quantidade: 'a gosto' },
        { nome: 'pimenta-do-reino', quantidade: 'a gosto' }
      ],
      etapas: [
        { numero: 1, descricao: 'Fatie o tomate e a mozzarella em rodelas de espessura similar.' },
        { numero: 2, descricao: 'Intercale as fatias no prato, alternando tomate e queijo.' },
        { numero: 3, descricao: 'Distribua as folhas de manjericão por cima.' },
        { numero: 4, descricao: 'Regue com azeite, sal e pimenta. Sirva imediatamente.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    },

    {
      id: 'base_004',
      nome: 'Guacamole Clássico',
      descricao: 'Pasta de abacate temperada com limão, coentro e pimenta. Ótima com nachos.',
      categoria: 'Entrada',
      tempoPreparo: 10,
      porcoes: 4,
      imagem: '',
      ingredientes: [
        { nome: 'abacate maduro', quantidade: '2 unidades' },
        { nome: 'limão', quantidade: '1 unidade' },
        { nome: 'coentro fresco', quantidade: '2 colheres de sopa' },
        { nome: 'cebola roxa', quantidade: '1/4 unidade' },
        { nome: 'tomate', quantidade: '1 unidade' },
        { nome: 'pimenta dedo-de-moça', quantidade: '1/2 unidade' },
        { nome: 'sal', quantidade: 'a gosto' }
      ],
      etapas: [
        { numero: 1, descricao: 'Amasse o abacate com um garfo até obter consistência cremosa.' },
        { numero: 2, descricao: 'Adicione o suco de limão e misture para evitar oxidação.' },
        { numero: 3, descricao: 'Pique finamente a cebola, o tomate e a pimenta; junte ao abacate.' },
        { numero: 4, descricao: 'Acrescente o coentro e o sal. Sirva com nachos ou torradas.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    },

    {
      id: 'base_005',
      nome: 'Caldo Verde',
      descricao: 'Sopa portuguesa de couve-manteiga com batatas e chouriço.',
      categoria: 'Entrada',
      tempoPreparo: 40,
      porcoes: 6,
      imagem: '',
      ingredientes: [
        { nome: 'batata', quantidade: '6 unidades médias' },
        { nome: 'couve-manteiga', quantidade: '4 folhas grandes' },
        { nome: 'chouriço', quantidade: '150g' },
        { nome: 'cebola', quantidade: '1 unidade' },
        { nome: 'alho', quantidade: '2 dentes' },
        { nome: 'azeite', quantidade: '3 colheres de sopa' },
        { nome: 'sal', quantidade: 'a gosto' },
        { nome: 'pimenta-do-reino', quantidade: 'a gosto' }
      ],
      etapas: [
        { numero: 1, descricao: 'Refogue a cebola e o alho no azeite até amolecer.' },
        { numero: 2, descricao: 'Adicione as batatas descascadas e cortadas; cubra com água e cozinhe por 20 min.' },
        { numero: 3, descricao: 'Bata com mixer até obter caldo homogêneo.' },
        { numero: 4, descricao: 'Junte a couve cortada em tiras finas e o chouriço; cozinhe por mais 5 min.' },
        { numero: 5, descricao: 'Acerte o sal e sirva com um fio de azeite.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    },

    {
      id: 'base_006',
      nome: 'Carpaccio de Abobrinha',
      descricao: 'Finas fatias de abobrinha crua marinadas no azeite com limão e parmesão.',
      categoria: 'Entrada',
      tempoPreparo: 15,
      porcoes: 2,
      imagem: '',
      ingredientes: [
        { nome: 'abobrinha', quantidade: '2 unidades' },
        { nome: 'azeite extravirgem', quantidade: '3 colheres de sopa' },
        { nome: 'limão', quantidade: '1 unidade' },
        { nome: 'queijo parmesão', quantidade: '50g' },
        { nome: 'sal', quantidade: 'a gosto' },
        { nome: 'pimenta-do-reino', quantidade: 'a gosto' }
      ],
      etapas: [
        { numero: 1, descricao: 'Fatie a abobrinha bem fina com mandoline ou faca afiada.' },
        { numero: 2, descricao: 'Disponha as fatias em prato e regue com azeite e limão.' },
        { numero: 3, descricao: 'Tempere com sal e pimenta; deixe marinar por 5 minutos.' },
        { numero: 4, descricao: 'Raspe o parmesão por cima com descascador e sirva.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    },

    // ── PRATOS PRINCIPAIS (9) ─────────────────────────

    {
      id: 'base_007',
      nome: 'Frango ao Limão com Ervas',
      descricao: 'Peitos de frango suculentos assados com ervas finas e limão siciliano.',
      categoria: 'Prato Principal',
      tempoPreparo: 45,
      porcoes: 4,
      imagem: '',
      ingredientes: [
        { nome: 'peito de frango', quantidade: '4 unidades' },
        { nome: 'limão siciliano', quantidade: '2 unidades' },
        { nome: 'alho', quantidade: '4 dentes' },
        { nome: 'azeite', quantidade: '4 colheres de sopa' },
        { nome: 'tomilho fresco', quantidade: '2 ramos' },
        { nome: 'alecrim', quantidade: '2 ramos' },
        { nome: 'sal', quantidade: 'a gosto' },
        { nome: 'pimenta-do-reino', quantidade: 'a gosto' }
      ],
      etapas: [
        { numero: 1, descricao: 'Misture o suco do limão, o alho amassado, o azeite e as ervas.' },
        { numero: 2, descricao: 'Marine o frango por pelo menos 30 minutos.' },
        { numero: 3, descricao: 'Preaqueça o forno a 200 °C.' },
        { numero: 4, descricao: 'Disponha o frango numa assadeira e despeje a marinada por cima.' },
        { numero: 5, descricao: 'Asse por 30–35 minutos até dourar. Sirva imediatamente.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    },

    {
      id: 'base_008',
      nome: 'Macarrão ao Molho Bolonhesa',
      descricao: 'Clássico italiano com carne moída, tomate e vinho tinto. Rende bem e agrada a todos.',
      categoria: 'Prato Principal',
      tempoPreparo: 60,
      porcoes: 6,
      imagem: '',
      ingredientes: [
        { nome: 'macarrão', quantidade: '500g' },
        { nome: 'carne moída', quantidade: '500g' },
        { nome: 'tomate pelado', quantidade: '400g' },
        { nome: 'cebola', quantidade: '1 unidade' },
        { nome: 'cenoura', quantidade: '1 unidade' },
        { nome: 'salsão', quantidade: '1 talo' },
        { nome: 'alho', quantidade: '3 dentes' },
        { nome: 'vinho tinto', quantidade: '100ml' },
        { nome: 'azeite', quantidade: '3 colheres de sopa' },
        { nome: 'sal', quantidade: 'a gosto' }
      ],
      etapas: [
        { numero: 1, descricao: 'Pique cebola, cenoura, salsão e alho finamente; refogue no azeite.' },
        { numero: 2, descricao: 'Acrescente a carne moída e doure em fogo alto.' },
        { numero: 3, descricao: 'Adicione o vinho e deixe evaporar; junte o tomate pelado esmagado.' },
        { numero: 4, descricao: 'Cozinhe em fogo baixo por 40 minutos, ajustando o sal.' },
        { numero: 5, descricao: 'Cozinhe o macarrão al dente e sirva com o molho.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    },

    {
      id: 'base_009',
      nome: 'Risoto de Cogumelos',
      descricao: 'Risoto cremoso com mix de cogumelos e queijo parmesão. Sofisticado e reconfortante.',
      categoria: 'Prato Principal',
      tempoPreparo: 40,
      porcoes: 4,
      imagem: '',
      ingredientes: [
        { nome: 'arroz arbóreo', quantidade: '300g' },
        { nome: 'cogumelo shitake', quantidade: '200g' },
        { nome: 'cogumelo champignon', quantidade: '200g' },
        { nome: 'caldo de legumes', quantidade: '1 litro' },
        { nome: 'cebola', quantidade: '1 unidade' },
        { nome: 'alho', quantidade: '2 dentes' },
        { nome: 'manteiga', quantidade: '50g' },
        { nome: 'queijo parmesão', quantidade: '80g' },
        { nome: 'vinho branco seco', quantidade: '100ml' },
        { nome: 'azeite', quantidade: '2 colheres de sopa' }
      ],
      etapas: [
        { numero: 1, descricao: 'Aqueça o caldo em panela separada (deve estar quente durante todo o preparo).' },
        { numero: 2, descricao: 'Refogue cebola e alho no azeite; adicione os cogumelos fatiados.' },
        { numero: 3, descricao: 'Acrescente o arroz e refogue por 2 minutos; regue com o vinho.' },
        { numero: 4, descricao: 'Adicione o caldo concha a concha, mexendo sempre, por 18–20 minutos.' },
        { numero: 5, descricao: 'Desligue, junte a manteiga e o parmesão, misture vigorosamente e sirva.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    },

    {
      id: 'base_010',
      nome: 'Moqueca de Peixe',
      descricao: 'Prato baiano aromático com peixe branco, leite de coco e azeite de dendê.',
      categoria: 'Prato Principal',
      tempoPreparo: 50,
      porcoes: 4,
      imagem: '',
      ingredientes: [
        { nome: 'peixe (robalo ou badejo)', quantidade: '800g' },
        { nome: 'leite de coco', quantidade: '400ml' },
        { nome: 'azeite de dendê', quantidade: '2 colheres de sopa' },
        { nome: 'tomate', quantidade: '3 unidades' },
        { nome: 'cebola', quantidade: '2 unidades' },
        { nome: 'pimentão vermelho', quantidade: '1 unidade' },
        { nome: 'pimentão amarelo', quantidade: '1 unidade' },
        { nome: 'coentro', quantidade: '1 maço' },
        { nome: 'limão', quantidade: '2 unidades' },
        { nome: 'sal', quantidade: 'a gosto' }
      ],
      etapas: [
        { numero: 1, descricao: 'Marine o peixe com limão e sal por 15 minutos.' },
        { numero: 2, descricao: 'Refogue cebola e tomate no dendê; adicione os pimentões fatiados.' },
        { numero: 3, descricao: 'Coloque o peixe sobre os legumes e despeje o leite de coco.' },
        { numero: 4, descricao: 'Tampe e cozinhe em fogo médio por 15 minutos.' },
        { numero: 5, descricao: 'Finalize com coentro picado e sirva com arroz e pirão.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    },

    {
      id: 'base_011',
      nome: 'Omelete de Queijo e Presunto',
      descricao: 'Omelete clássica, leve e rápida de preparar. Ótima para qualquer horário.',
      categoria: 'Prato Principal',
      tempoPreparo: 10,
      porcoes: 1,
      imagem: '',
      ingredientes: [
        { nome: 'ovo', quantidade: '3 unidades' },
        { nome: 'queijo mussarela', quantidade: '50g' },
        { nome: 'presunto', quantidade: '50g' },
        { nome: 'manteiga', quantidade: '1 colher de sopa' },
        { nome: 'sal', quantidade: 'a gosto' },
        { nome: 'pimenta-do-reino', quantidade: 'a gosto' }
      ],
      etapas: [
        { numero: 1, descricao: 'Bata os ovos com sal e pimenta.' },
        { numero: 2, descricao: 'Derreta a manteiga na frigideira em fogo médio-baixo.' },
        { numero: 3, descricao: 'Despeje os ovos e mexa suavemente até começar a coagular nas bordas.' },
        { numero: 4, descricao: 'Distribua o queijo e o presunto sobre metade da omelete.' },
        { numero: 5, descricao: 'Dobre ao meio, aguarde 30 segundos e sirva.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    },

    {
      id: 'base_012',
      nome: 'Arroz de Forno com Frango',
      descricao: 'Arroz cremoso assado com frango desfiado, milho e catupiry. Comfort food brasileiro.',
      categoria: 'Prato Principal',
      tempoPreparo: 55,
      porcoes: 6,
      imagem: '',
      ingredientes: [
        { nome: 'arroz cozido', quantidade: '3 xícaras' },
        { nome: 'frango cozido desfiado', quantidade: '400g' },
        { nome: 'milho verde', quantidade: '1 lata' },
        { nome: 'catupiry', quantidade: '200g' },
        { nome: 'leite', quantidade: '200ml' },
        { nome: 'caldo de frango', quantidade: '1 tablete' },
        { nome: 'queijo mussarela', quantidade: '150g' },
        { nome: 'sal', quantidade: 'a gosto' }
      ],
      etapas: [
        { numero: 1, descricao: 'Misture o arroz, frango, milho, leite e caldo dissolvido.' },
        { numero: 2, descricao: 'Distribua metade da mistura numa assadeira untada.' },
        { numero: 3, descricao: 'Espalhe o catupiry por cima e cubra com o restante do arroz.' },
        { numero: 4, descricao: 'Cubra com a mussarela e leve ao forno a 180 °C por 25 minutos.' },
        { numero: 5, descricao: 'Sirva ainda quente.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    },

    {
      id: 'base_013',
      nome: 'Feijão Tropeiro Mineiro',
      descricao: 'Prato típico de Minas Gerais com feijão, farinha, bacon, linguiça e couve.',
      categoria: 'Prato Principal',
      tempoPreparo: 30,
      porcoes: 6,
      imagem: '',
      ingredientes: [
        { nome: 'feijão cozido', quantidade: '2 xícaras' },
        { nome: 'farinha de mandioca', quantidade: '1 xícara' },
        { nome: 'bacon', quantidade: '100g' },
        { nome: 'linguiça calabresa', quantidade: '200g' },
        { nome: 'couve-manteiga', quantidade: '3 folhas' },
        { nome: 'ovo', quantidade: '3 unidades' },
        { nome: 'alho', quantidade: '3 dentes' },
        { nome: 'sal', quantidade: 'a gosto' }
      ],
      etapas: [
        { numero: 1, descricao: 'Frite o bacon e a linguiça em cubinhos até dourar; retire o excesso de gordura.' },
        { numero: 2, descricao: 'Refogue o alho na gordura que sobrou; acrescente o feijão escorrido.' },
        { numero: 3, descricao: 'Mexendo sempre, adicione a farinha aos poucos até a mistura ficar solta.' },
        { numero: 4, descricao: 'Abra espaço, frite os ovos mexidos e misture tudo.' },
        { numero: 5, descricao: 'Junte a couve picada bem fina e a carne frita. Ajuste o sal e sirva.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    },

    {
      id: 'base_014',
      nome: 'Strogonoff de Frango',
      descricao: 'Strogonoff cremoso e rápido, com creme de leite e ketchup. Clássico do cotidiano.',
      categoria: 'Prato Principal',
      tempoPreparo: 30,
      porcoes: 4,
      imagem: '',
      ingredientes: [
        { nome: 'peito de frango', quantidade: '500g' },
        { nome: 'creme de leite', quantidade: '1 caixa (200ml)' },
        { nome: 'ketchup', quantidade: '2 colheres de sopa' },
        { nome: 'mostarda', quantidade: '1 colher de sopa' },
        { nome: 'champignon fatiado', quantidade: '200g' },
        { nome: 'cebola', quantidade: '1 unidade' },
        { nome: 'alho', quantidade: '2 dentes' },
        { nome: 'azeite', quantidade: '2 colheres de sopa' },
        { nome: 'sal', quantidade: 'a gosto' }
      ],
      etapas: [
        { numero: 1, descricao: 'Corte o frango em tiras e tempere com sal.' },
        { numero: 2, descricao: 'Doure o frango no azeite; reserve.' },
        { numero: 3, descricao: 'Refogue cebola e alho na mesma panela; junte os champignons.' },
        { numero: 4, descricao: 'Adicione o ketchup, a mostarda e o creme de leite; misture.' },
        { numero: 5, descricao: 'Recoloque o frango, ajuste o sal e sirva com arroz e batata palha.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    },

    {
      id: 'base_015',
      nome: 'Lasanha à Bolonhesa',
      descricao: 'Lasanha em camadas com molho bolonhesa, bechamel e queijo. Prato para ocasiões especiais.',
      categoria: 'Prato Principal',
      tempoPreparo: 90,
      porcoes: 8,
      imagem: '',
      ingredientes: [
        { nome: 'massa para lasanha', quantidade: '250g' },
        { nome: 'carne moída', quantidade: '500g' },
        { nome: 'molho de tomate', quantidade: '500ml' },
        { nome: 'leite', quantidade: '500ml' },
        { nome: 'farinha de trigo', quantidade: '3 colheres de sopa' },
        { nome: 'manteiga', quantidade: '3 colheres de sopa' },
        { nome: 'queijo parmesão', quantidade: '100g' },
        { nome: 'queijo mussarela', quantidade: '200g' },
        { nome: 'cebola', quantidade: '1 unidade' },
        { nome: 'sal', quantidade: 'a gosto' }
      ],
      etapas: [
        { numero: 1, descricao: 'Prepare o bolonhesa: refogue cebola, doure a carne, junte o molho de tomate e cozinhe 20 min.' },
        { numero: 2, descricao: 'Prepare o bechamel: derreta a manteiga, adicione a farinha e o leite aos poucos, mexendo até engrossar.' },
        { numero: 3, descricao: 'Monte em assadeira: bechamel, massa, bolonhesa, mussarela. Repita as camadas.' },
        { numero: 4, descricao: 'Finalize com bechamel e parmesão; cubra com papel alumínio.' },
        { numero: 5, descricao: 'Asse a 180 °C por 35 min; remova o papel e gratine por mais 10 min.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    },

    // ── SOBREMESAS (7) ────────────────────────────────

    {
      id: 'base_016',
      nome: 'Petit Gâteau',
      descricao: 'Bolinho de chocolate com centro derretido. Servido quente com sorvete de creme.',
      categoria: 'Sobremesa',
      tempoPreparo: 25,
      porcoes: 6,
      imagem: '',
      ingredientes: [
        { nome: 'chocolate amargo', quantidade: '200g' },
        { nome: 'manteiga', quantidade: '100g' },
        { nome: 'ovo', quantidade: '2 unidades' },
        { nome: 'gema de ovo', quantidade: '2 unidades' },
        { nome: 'açúcar', quantidade: '80g' },
        { nome: 'farinha de trigo', quantidade: '40g' }
      ],
      etapas: [
        { numero: 1, descricao: 'Derreta o chocolate com a manteiga em banho-maria.' },
        { numero: 2, descricao: 'Bata os ovos, as gemas e o açúcar até triplicar de volume.' },
        { numero: 3, descricao: 'Incorpore o chocolate derretido e a farinha peneirada.' },
        { numero: 4, descricao: 'Distribua em forminhas untadas e leve à geladeira por 15 min.' },
        { numero: 5, descricao: 'Asse a 220 °C por 8–10 minutos. O centro deve ficar cremoso. Desenforme e sirva.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    },

    {
      id: 'base_017',
      nome: 'Mousse de Maracujá',
      descricao: 'Mousse leve e refrescante com polpa de maracujá e leite condensado.',
      categoria: 'Sobremesa',
      tempoPreparo: 20,
      porcoes: 6,
      imagem: '',
      ingredientes: [
        { nome: 'polpa de maracujá', quantidade: '1 xícara' },
        { nome: 'leite condensado', quantidade: '1 lata (395g)' },
        { nome: 'creme de leite', quantidade: '1 caixa (200ml)' },
        { nome: 'gelatina sem sabor', quantidade: '12g' },
        { nome: 'água', quantidade: '4 colheres de sopa' }
      ],
      etapas: [
        { numero: 1, descricao: 'Hidrate a gelatina na água por 5 minutos e dissolva em banho-maria.' },
        { numero: 2, descricao: 'Bata no liquidificador a polpa, o leite condensado e o creme de leite.' },
        { numero: 3, descricao: 'Com o liquidificador ligado, acrescente a gelatina dissolvida.' },
        { numero: 4, descricao: 'Despeje em taças e leve à geladeira por pelo menos 2 horas.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    },

    {
      id: 'base_018',
      nome: 'Bolo de Cenoura com Cobertura de Chocolate',
      descricao: 'Bolo fofinho de cenoura com calda de chocolate quente. O queridinho do lanche.',
      categoria: 'Sobremesa',
      tempoPreparo: 60,
      porcoes: 10,
      imagem: '',
      ingredientes: [
        { nome: 'cenoura', quantidade: '3 unidades médias' },
        { nome: 'ovo', quantidade: '3 unidades' },
        { nome: 'óleo', quantidade: '1 xícara' },
        { nome: 'açúcar', quantidade: '2 xícaras' },
        { nome: 'farinha de trigo', quantidade: '2 xícaras' },
        { nome: 'fermento em pó', quantidade: '1 colher de sopa' },
        { nome: 'chocolate em pó', quantidade: '4 colheres de sopa' },
        { nome: 'manteiga', quantidade: '2 colheres de sopa' },
        { nome: 'leite', quantidade: '1 xícara' }
      ],
      etapas: [
        { numero: 1, descricao: 'Bata no liquidificador a cenoura, os ovos e o óleo.' },
        { numero: 2, descricao: 'Misture à massa o açúcar, a farinha e o fermento peneirados.' },
        { numero: 3, descricao: 'Despeje em forma untada e asse a 180 °C por 35–40 minutos.' },
        { numero: 4, descricao: 'Para a cobertura: misture o chocolate, a manteiga e o leite em panela; cozinhe mexendo até engrossar.' },
        { numero: 5, descricao: 'Desenforme o bolo e despeje a cobertura quente.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    },

    {
      id: 'base_019',
      nome: 'Pudim de Leite Condensado',
      descricao: 'Clássico pudim brasileiro com calda de caramelo. Cremoso e irresistível.',
      categoria: 'Sobremesa',
      tempoPreparo: 70,
      porcoes: 8,
      imagem: '',
      ingredientes: [
        { nome: 'leite condensado', quantidade: '1 lata (395g)' },
        { nome: 'leite', quantidade: '2 xícaras (mesma medida da lata)' },
        { nome: 'ovo', quantidade: '3 unidades' },
        { nome: 'açúcar', quantidade: '1 xícara' }
      ],
      etapas: [
        { numero: 1, descricao: 'Caramelize o açúcar numa forma de pudim até dourar; espalhe pelas paredes.' },
        { numero: 2, descricao: 'Bata no liquidificador os ovos, o leite condensado e o leite por 2 minutos.' },
        { numero: 3, descricao: 'Despeje na forma caramelizada e tampe com papel alumínio.' },
        { numero: 4, descricao: 'Asse em banho-maria a 180 °C por 50–60 minutos.' },
        { numero: 5, descricao: 'Deixe esfriar completamente antes de desenformar.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    },

    {
      id: 'base_020',
      nome: 'Brigadeiro Gourmet',
      descricao: 'Brigadeiro artesanal com chocolate 70% cacau e granulado belga. Perfeito para festas.',
      categoria: 'Sobremesa',
      tempoPreparo: 30,
      porcoes: 30,
      imagem: '',
      ingredientes: [
        { nome: 'leite condensado', quantidade: '1 lata (395g)' },
        { nome: 'chocolate 70% cacau', quantidade: '100g' },
        { nome: 'manteiga', quantidade: '1 colher de sopa' },
        { nome: 'creme de leite', quantidade: '2 colheres de sopa' },
        { nome: 'granulado de chocolate', quantidade: 'a gosto' }
      ],
      etapas: [
        { numero: 1, descricao: 'Derreta o chocolate em banho-maria e reserve.' },
        { numero: 2, descricao: 'Misture o leite condensado, a manteiga e o creme de leite numa panela; leve ao fogo médio.' },
        { numero: 3, descricao: 'Acrescente o chocolate derretido e mexa sem parar até desgrudar do fundo.' },
        { numero: 4, descricao: 'Deixe esfriar e enrole em bolinhas; passe no granulado.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    },

    {
      id: 'base_021',
      nome: 'Torta de Limão',
      descricao: 'Torta com base de biscoito, recheio de leite condensado com limão e merengue.',
      categoria: 'Sobremesa',
      tempoPreparo: 40,
      porcoes: 8,
      imagem: '',
      ingredientes: [
        { nome: 'biscoito maisena', quantidade: '200g' },
        { nome: 'manteiga', quantidade: '80g' },
        { nome: 'leite condensado', quantidade: '1 lata (395g)' },
        { nome: 'suco de limão', quantidade: '1/2 xícara' },
        { nome: 'clara de ovo', quantidade: '3 unidades' },
        { nome: 'açúcar', quantidade: '6 colheres de sopa' }
      ],
      etapas: [
        { numero: 1, descricao: 'Triture o biscoito e misture com a manteiga derretida; forre a forma e leve ao forno por 10 min.' },
        { numero: 2, descricao: 'Misture o leite condensado com o suco de limão até engrossar; espalhe sobre a base.' },
        { numero: 3, descricao: 'Bata as claras em neve; acrescente o açúcar até obter merengue firme.' },
        { numero: 4, descricao: 'Cubra a torta com o merengue e leve ao forno alto por 5 min para dourar.' },
        { numero: 5, descricao: 'Deixe esfriar e leve à geladeira por pelo menos 2 horas.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    },

    {
      id: 'base_022',
      nome: 'Panacota de Baunilha',
      descricao: 'Sobremesa italiana de creme de leite com baunilha, leve e elegante.',
      categoria: 'Sobremesa',
      tempoPreparo: 25,
      porcoes: 4,
      imagem: '',
      ingredientes: [
        { nome: 'creme de leite fresco', quantidade: '500ml' },
        { nome: 'açúcar', quantidade: '80g' },
        { nome: 'essência de baunilha', quantidade: '1 colher de chá' },
        { nome: 'gelatina sem sabor', quantidade: '10g' },
        { nome: 'água', quantidade: '3 colheres de sopa' }
      ],
      etapas: [
        { numero: 1, descricao: 'Hidrate a gelatina na água e reserve.' },
        { numero: 2, descricao: 'Aqueça o creme com o açúcar e a baunilha até quase ferver.' },
        { numero: 3, descricao: 'Dissolva a gelatina no creme quente e misture bem.' },
        { numero: 4, descricao: 'Despeje em forminhas levemente untadas e refrigere por 4 horas.' },
        { numero: 5, descricao: 'Desenforme e sirva com frutas vermelhas ou calda de caramelo.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    },

    // ── LANCHES (5) ──────────────────────────────────

    {
      id: 'base_023',
      nome: 'Sanduíche Natural de Frango',
      descricao: 'Sanduíche leve e nutritivo com frango desfiado, cream cheese e cenoura ralada.',
      categoria: 'Lanche',
      tempoPreparo: 15,
      porcoes: 2,
      imagem: '',
      ingredientes: [
        { nome: 'pão de forma integral', quantidade: '4 fatias' },
        { nome: 'frango cozido desfiado', quantidade: '150g' },
        { nome: 'cream cheese', quantidade: '2 colheres de sopa' },
        { nome: 'cenoura', quantidade: '1 unidade pequena' },
        { nome: 'sal', quantidade: 'a gosto' },
        { nome: 'salsinha', quantidade: '1 colher de sopa' }
      ],
      etapas: [
        { numero: 1, descricao: 'Misture o frango com o cream cheese, a cenoura ralada fina, a salsinha e o sal.' },
        { numero: 2, descricao: 'Espalhe o recheio nas fatias de pão.' },
        { numero: 3, descricao: 'Monte os sanduíches e corte ao meio para servir.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    },

    {
      id: 'base_024',
      nome: 'Tapioca Recheada',
      descricao: 'Tapioca crocante recheada com queijo e presunto. Rápida e sem glúten.',
      categoria: 'Lanche',
      tempoPreparo: 10,
      porcoes: 1,
      imagem: '',
      ingredientes: [
        { nome: 'goma de tapioca', quantidade: '4 colheres de sopa' },
        { nome: 'queijo mussarela', quantidade: '30g' },
        { nome: 'presunto', quantidade: '30g' }
      ],
      etapas: [
        { numero: 1, descricao: 'Espalhe a goma de tapioca em frigideira antiaderente a seco em fogo médio.' },
        { numero: 2, descricao: 'Quando a massa firmar e soltar da frigideira, adicione o queijo e o presunto na metade.' },
        { numero: 3, descricao: 'Dobre ao meio e sirva imediatamente.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    },

    {
      id: 'base_025',
      nome: 'Panqueca Americana',
      descricao: 'Panquecas fofas e grossas no estilo americano. Ótimas com mel e frutas.',
      categoria: 'Lanche',
      tempoPreparo: 20,
      porcoes: 4,
      imagem: '',
      ingredientes: [
        { nome: 'farinha de trigo', quantidade: '1 xícara' },
        { nome: 'leite', quantidade: '3/4 de xícara' },
        { nome: 'ovo', quantidade: '1 unidade' },
        { nome: 'açúcar', quantidade: '1 colher de sopa' },
        { nome: 'fermento em pó', quantidade: '1 colher de chá' },
        { nome: 'sal', quantidade: '1 pitada' },
        { nome: 'manteiga', quantidade: '1 colher de sopa' }
      ],
      etapas: [
        { numero: 1, descricao: 'Misture os ingredientes secos numa tigela.' },
        { numero: 2, descricao: 'Bata o ovo com o leite e a manteiga derretida; junte à mistura seca sem sovar.' },
        { numero: 3, descricao: 'Aqueça frigideira untada e despeje 1/4 de xícara de massa por panqueca.' },
        { numero: 4, descricao: 'Vire quando surgirem bolhas; cozinhe por mais 1 minuto e sirva empilhadas.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    },

    {
      id: 'base_026',
      nome: 'Wrap de Atum',
      descricao: 'Wrap prático com atum, cream cheese, cenoura e alface. Lanche rápido e nutritivo.',
      categoria: 'Lanche',
      tempoPreparo: 10,
      porcoes: 2,
      imagem: '',
      ingredientes: [
        { nome: 'tortilha de trigo', quantidade: '2 unidades' },
        { nome: 'atum em lata', quantidade: '1 lata (140g)' },
        { nome: 'cream cheese', quantidade: '2 colheres de sopa' },
        { nome: 'cenoura', quantidade: '1 unidade' },
        { nome: 'alface', quantidade: '4 folhas' },
        { nome: 'limão', quantidade: '1/2 unidade' },
        { nome: 'sal', quantidade: 'a gosto' }
      ],
      etapas: [
        { numero: 1, descricao: 'Escorra o atum e tempere com limão e sal.' },
        { numero: 2, descricao: 'Espalhe o cream cheese na tortilha; distribua o atum, a cenoura ralada e a alface.' },
        { numero: 3, descricao: 'Enrole firmemente, corte ao meio e sirva.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    },

    {
      id: 'base_027',
      nome: 'Toast de Abacate',
      descricao: 'Torrada com pasta de abacate, temperada com limão e pimenta. Lanche saudável e moderno.',
      categoria: 'Lanche',
      tempoPreparo: 10,
      porcoes: 2,
      imagem: '',
      ingredientes: [
        { nome: 'pão de forma', quantidade: '2 fatias' },
        { nome: 'abacate maduro', quantidade: '1 unidade' },
        { nome: 'limão', quantidade: '1/2 unidade' },
        { nome: 'sal', quantidade: 'a gosto' },
        { nome: 'pimenta vermelha', quantidade: 'a gosto' },
        { nome: 'azeite', quantidade: '1 fio' }
      ],
      etapas: [
        { numero: 1, descricao: 'Toste as fatias de pão.' },
        { numero: 2, descricao: 'Amasse o abacate com o limão, o sal e a pimenta.' },
        { numero: 3, descricao: 'Espalhe sobre as torradas, regue com azeite e sirva imediatamente.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    },

    // ── BEBIDAS (4) ───────────────────────────────────

    {
      id: 'base_028',
      nome: 'Vitamina de Banana com Aveia',
      descricao: 'Vitamina cremosa e nutritiva, ótima para o café da manhã ou lanche.',
      categoria: 'Bebida',
      tempoPreparo: 5,
      porcoes: 2,
      imagem: '',
      ingredientes: [
        { nome: 'banana', quantidade: '2 unidades' },
        { nome: 'leite', quantidade: '400ml' },
        { nome: 'aveia em flocos', quantidade: '3 colheres de sopa' },
        { nome: 'mel', quantidade: '1 colher de sopa' },
        { nome: 'canela em pó', quantidade: '1 pitada' }
      ],
      etapas: [
        { numero: 1, descricao: 'Coloque todos os ingredientes no liquidificador.' },
        { numero: 2, descricao: 'Bata por 1 minuto até ficar homogêneo.' },
        { numero: 3, descricao: 'Sirva imediatamente, polvilhado com canela.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    },

    {
      id: 'base_029',
      nome: 'Limonada Suíça',
      descricao: 'Limonada cremosa batida com leite condensado. Refrescante e irresistível.',
      categoria: 'Bebida',
      tempoPreparo: 5,
      porcoes: 4,
      imagem: '',
      ingredientes: [
        { nome: 'limão', quantidade: '4 unidades' },
        { nome: 'leite condensado', quantidade: '1/2 lata' },
        { nome: 'creme de leite', quantidade: '2 colheres de sopa' },
        { nome: 'água gelada', quantidade: '500ml' },
        { nome: 'gelo', quantidade: '1 xícara' }
      ],
      etapas: [
        { numero: 1, descricao: 'Lave bem os limões; corte-os em 4 partes (com casca).' },
        { numero: 2, descricao: 'Bata no liquidificador com a água, o leite condensado e o creme de leite por 30 segundos.' },
        { numero: 3, descricao: 'Coe rapidamente para retirar bagaço amargo; adicione o gelo e sirva.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    },

    {
      id: 'base_030',
      nome: 'Smoothie Verde Detox',
      descricao: 'Smoothie refrescante com espinafre, maçã verde e gengibre. Cheio de nutrientes.',
      categoria: 'Bebida',
      tempoPreparo: 5,
      porcoes: 2,
      imagem: '',
      ingredientes: [
        { nome: 'espinafre fresco', quantidade: '1 xícara' },
        { nome: 'maçã verde', quantidade: '1 unidade' },
        { nome: 'pepino', quantidade: '1/2 unidade' },
        { nome: 'gengibre fresco', quantidade: '1cm' },
        { nome: 'suco de limão', quantidade: '2 colheres de sopa' },
        { nome: 'água de coco', quantidade: '300ml' }
      ],
      etapas: [
        { numero: 1, descricao: 'Descasque e pique a maçã e o pepino grosseiramente.' },
        { numero: 2, descricao: 'Bata tudo no liquidificador com a água de coco até ficar liso.' },
        { numero: 3, descricao: 'Sirva gelado, com ou sem coagem.' }
      ],
      dataCriacao: '2024-01-01T00:00:00.000Z'
    }
  ];

  // ══════════════════════════════════════════════════
  // INICIALIZAÇÃO
  // ══════════════════════════════════════════════════

  /**
   * Inicializa o banco de receitas no localStorage
   * apenas se ainda não existir (primeira execução).
   */
  function inicializarReceitasBase() {
    var existente = null;
    try {
      existente = localStorage.getItem('receitasBase');
    } catch (_) {}

    if (!existente || existente === '[]') {
      try {
        localStorage.setItem('receitasBase', JSON.stringify(RECEITAS_BASE));
        console.info('[ReceitaFácil] Banco inicial carregado: ' + RECEITAS_BASE.length + ' receitas.');
      } catch (e) {
        console.warn('[ReceitaFácil] Não foi possível salvar o banco inicial:', e);
      }
    }
  }

  // Executa na carga do script
  inicializarReceitasBase();

  // Exporta para uso em outros módulos (ex: recomendações)
  global.RF = global.RF || {};
  global.RF.receitasBase = RECEITAS_BASE;

})(window);
