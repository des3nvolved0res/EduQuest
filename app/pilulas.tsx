const conteudo: Record<string, { titulo: string; pilulas: { icone: string; texto: string }[] }> = {
  trigonometria: {
    titulo: 'TRIGONOMETRIA',
    pilulas: [
      { icone: '📐', texto: 'Seno = cateto oposto / hipotenusa' },
      { icone: '📐', texto: 'Cosseno = cateto adjacente / hipotenusa' },
      { icone: '📐', texto: 'Tangente = cateto oposto / cateto adjacente' },
      { icone: '💡', texto: 'Memorize: SOH-CAH-TOA' },
      { icone: '⚠️', texto: 'A hipotenusa e sempre o maior lado' },
    ],
  },
  funcoes: {
    titulo: 'FUNCOES',
    pilulas: [
      { icone: '📊', texto: 'Funcao do 1 grau: f(x) = ax + b, a diferente de 0' },
      { icone: '📊', texto: 'Funcao do 2 grau: f(x) = ax2 + bx + c, a diferente de 0' },
      { icone: '💡', texto: 'Grafico do 1 grau e uma reta' },
      { icone: '💡', texto: 'Grafico do 2 grau e uma parabola' },
      { icone: '⚠️', texto: 'Se a > 0 parabola abre pra cima, se a < 0 abre pra baixo' },
    ],
  },
  geometria: {
    titulo: 'GEOMETRIA',
    pilulas: [
      { icone: '📐', texto: 'Area do triangulo = (base x altura) / 2' },
      { icone: '📐', texto: 'Area do circulo = π x raio²' },
      { icone: '📐', texto: 'Volume do cubo = aresta³' },
      { icone: '💡', texto: 'Soma dos angulos internos do triangulo = 180 graus' },
      { icone: '⚠️', texto: 'Perimetro = soma de todos os lados' },
    ],
  },
  estatistica: {
    titulo: 'ESTATISTICA',
    pilulas: [
      { icone: '📊', texto: 'Media = soma dos valores / quantidade de valores' },
      { icone: '📊', texto: 'Moda = valor que mais se repete' },
      { icone: '📊', texto: 'Mediana = valor central do conjunto ordenado' },
      { icone: '💡', texto: 'Amplitude = maior valor - menor valor' },
      { icone: '⚠️', texto: 'Ordenar os dados antes de calcular a mediana' },
    ],
  },
  probabilidade: {
    titulo: 'PROBABILIDADE',
    pilulas: [
      { icone: '🎲', texto: 'P(evento) = casos favoraveis / casos possiveis' },
      { icone: '🎲', texto: 'Probabilidade varia entre 0 (impossivel) e 1 (certo)' },
      { icone: '💡', texto: 'P(nao A) = 1 - P(A)' },
      { icone: '💡', texto: 'Dado tem 6 faces, moeda tem 2 faces' },
      { icone: '⚠️', texto: 'Espaco amostral = todos os resultados possiveis' },
    ],
  },
  interpretacao: {
    titulo: 'INTERPRETACAO DE TEXTO',
    pilulas: [
      { icone: '📝', texto: 'Leia o texto completo antes de responder' },
      { icone: '📝', texto: 'Identifique a ideia principal de cada paragrafo' },
      { icone: '💡', texto: 'Inferir = concluir o que nao esta explicito' },
      { icone: '💡', texto: 'Contexto ajuda a entender o sentido das palavras' },
      { icone: '⚠️', texto: 'Nao responda com base na sua opiniao, mas no texto' },
    ],
  },
  gramatica: {
    titulo: 'GRAMATICA',
    pilulas: [
      { icone: '📝', texto: 'Substantivo: nomeia seres, lugares, sentimentos' },
      { icone: '📝', texto: 'Adjetivo: caracteriza o substantivo' },
      { icone: '📝', texto: 'Adverbio: modifica verbo, adjetivo ou outro adverbio' },
      { icone: '💡', texto: 'Verbo de ligacao: ser, estar, parecer, ficar, continuar' },
      { icone: '⚠️', texto: 'Sujeito pode ser simples, composto, indeterminado ou oculto' },
    ],
  },
  redacao: {
    titulo: 'REDACAO',
    pilulas: [
      { icone: '✏️', texto: 'Estrutura: introducao, desenvolvimento e conclusao' },
      { icone: '✏️', texto: 'Tese: posicao do autor sobre o tema' },
      { icone: '💡', texto: 'Argumento sustenta a tese com provas e exemplos' },
      { icone: '💡', texto: 'Conectivos de conclusao: portanto, logo, assim' },
      { icone: '⚠️', texto: 'Coesao = ligacao entre as partes do texto' },
    ],
  },
  literatura: {
    titulo: 'LITERATURA',
    pilulas: [
      { icone: '📚', texto: 'Barroco (sec. XVII): conflito entre fe e razao' },
      { icone: '📚', texto: 'Arcadismo (sec. XVIII): razao, natureza e simplicidade' },
      { icone: '📚', texto: 'Romantismo: sentimento, nacionalismo, idealizacao' },
      { icone: '📚', texto: 'Realismo: critica objetiva da sociedade' },
      { icone: '💡', texto: 'Modernismo brasileiro: Semana de Arte Moderna 1922' },
    ],
  },
  celula: {
    titulo: 'CELULA',
    pilulas: [
      { icone: '🔬', texto: 'Procariontes: sem nucleo definido (bacterias)' },
      { icone: '🔬', texto: 'Eucariontes: com nucleo delimitado (animais, plantas)' },
      { icone: '💡', texto: 'Mitocondria = usina de energia (ATP)' },
      { icone: '💡', texto: 'Ribossomos = producao de proteinas' },
      { icone: '⚠️', texto: 'So celulas vegetais tem parede celular e cloroplastos' },
    ],
  },
  genetica: {
    titulo: 'GENETICA',
    pilulas: [
      { icone: '🧬', texto: 'DNA = acido desoxirribonucleico — carrega heranca genetica' },
      { icone: '🧬', texto: 'Gene = trecho do DNA que codifica uma caracteristica' },
      { icone: '💡', texto: 'Dominante se expressa mesmo com um alelo recessivo' },
      { icone: '💡', texto: 'Recessivo so aparece em dose dupla (homozigoto)' },
      { icone: '⚠️', texto: 'Genotipo = genes; fenotipo = caracteristica visivel' },
    ],
  },
  ecologia: {
    titulo: 'ECOLOGIA',
    pilulas: [
      { icone: '🌿', texto: 'Ecossistema = seres vivos + ambiente fisico' },
      { icone: '🌿', texto: 'Produtores: plantas e algas — fazem fotossintese' },
      { icone: '💡', texto: 'Consumidores: animais que comem outros seres' },
      { icone: '💡', texto: 'Decompositores: fungos e bacterias reciclam materia' },
      { icone: '⚠️', texto: 'Cadeia alimentar: produtor → consumidor → decompositor' },
    ],
  },
  evolucao: {
    titulo: 'EVOLUCAO',
    pilulas: [
      { icone: '🦎', texto: 'Darwin: sobrevivencia dos mais adaptados ao ambiente' },
      { icone: '🦎', texto: 'Selecao natural: individuos adaptados se reproduzem mais' },
      { icone: '💡', texto: 'Mutacao: alteracao no DNA — materia-prima da evolucao' },
      { icone: '💡', texto: 'Especiacao: formacao de novas especies por isolamento' },
      { icone: '⚠️', texto: 'Orgaos vestigiais: heranca evolutiva sem funcao atual' },
    ],
  },
  'brasil-colonial': {
    titulo: 'BRASIL COLONIAL',
    pilulas: [
      { icone: '⚓', texto: 'Cabral chegou ao Brasil em 22 de abril de 1500' },
      { icone: '⚓', texto: 'Ciclos economicos: pau-brasil, cana, ouro, cafe' },
      { icone: '💡', texto: 'Palmares: quilombo liderado por Zumbi dos Palmares' },
      { icone: '💡', texto: 'Inconfidencia Mineira (1789): liderada por Tiradentes' },
      { icone: '⚠️', texto: 'Escravidao africana foi base economica do periodo colonial' },
    ],
  },
  revolucoes: {
    titulo: 'REVOLUCOES',
    pilulas: [
      { icone: '⚔️', texto: 'Rev. Francesa (1789): Liberdade, Igualdade e Fraternidade' },
      { icone: '⚔️', texto: 'Rev. Industrial (sec. XVIII): iniciou na Inglaterra' },
      { icone: '💡', texto: 'Rev. Russa (1917): Lenin lidera os bolcheviques ao poder' },
      { icone: '💡', texto: 'Burguesia foi o motor da Revolucao Francesa' },
      { icone: '⚠️', texto: 'URSS criada apos a Revolucao Russa de 1917' },
    ],
  },
  'guerra-mundial': {
    titulo: 'GUERRAS MUNDIAIS',
    pilulas: [
      { icone: '🪖', texto: '1a Guerra (1914-1918): assassinato do arquiduque Francisco Fernando' },
      { icone: '🪖', texto: '2a Guerra (1939-1945): nazismo de Hitler na Alemanha' },
      { icone: '💡', texto: 'Holocausto: exterminio de 6 milhoes de judeus pelos nazistas' },
      { icone: '💡', texto: 'Pearl Harbor (1941): entrada dos EUA na 2a Guerra' },
      { icone: '⚠️', texto: 'ONU criada em 1945 para manter a paz mundial' },
    ],
  },
  'brasil-republica': {
    titulo: 'BRASIL REPUBLICA',
    pilulas: [
      { icone: '🇧🇷', texto: 'Republica proclamada em 15/11/1889 por Deodoro da Fonseca' },
      { icone: '🇧🇷', texto: 'Era Vargas (1930-1945): industrializacao e populismo' },
      { icone: '💡', texto: 'Golpe militar: 31 de marco de 1964' },
      { icone: '💡', texto: 'Lei de Anistia (1979): retorno dos exilados politicos' },
      { icone: '⚠️', texto: 'Primeiras eleicoes diretas pos-ditadura: 1989' },
    ],
  },
  climatologia: {
    titulo: 'CLIMATOLOGIA',
    pilulas: [
      { icone: '🌦️', texto: 'Clima: padrao meteorologico de longo prazo (decadas)' },
      { icone: '🌦️', texto: 'Tempo: estado da atmosfera em um momento especifico' },
      { icone: '💡', texto: 'Estacoes do ano: causadas pela inclinacao do eixo terrestre' },
      { icone: '💡', texto: 'Efeito estufa: retencao de calor pelos gases atmosfericos' },
      { icone: '⚠️', texto: 'El Nino: aquecimento anomalo do Pacifico equatorial' },
    ],
  },
  geopolitica: {
    titulo: 'GEOPOLITICA',
    pilulas: [
      { icone: '🌐', texto: 'Soberania: poder supremo do Estado sobre seu territorio' },
      { icone: '🌐', texto: 'ONU (1945): organizacao para paz e cooperacao mundial' },
      { icone: '💡', texto: 'Guerra Fria: EUA (capitalismo) x URSS (socialismo) 1947-1991' },
      { icone: '💡', texto: 'Globalizacao: integracao economica, cultural e politica mundial' },
      { icone: '⚠️', texto: 'BRICS: Brasil, Russia, India, China e Africa do Sul' },
    ],
  },
  urbanizacao: {
    titulo: 'URBANIZACAO',
    pilulas: [
      { icone: '🏙️', texto: 'Urbanizacao: crescimento da populacao nas cidades' },
      { icone: '🏙️', texto: 'Conurbacao: uniao de areas urbanas de cidades distintas' },
      { icone: '💡', texto: 'Megalopole: conjunto de metropoles unidas (ex: SP-Rio)' },
      { icone: '💡', texto: 'Periferizacao: alto custo central empurra pobres para periferia' },
      { icone: '⚠️', texto: 'Megacidades: superpopulacao, trafego e deficit de infraestrutura' },
    ],
  },
  relevo: {
    titulo: 'RELEVO',
    pilulas: [
      { icone: '⛰️', texto: 'Planicie: terreno plano em baixa altitude' },
      { icone: '⛰️', texto: 'Planalto: terreno elevado e relativamente plano' },
      { icone: '💡', texto: 'Relevo moldado por forcas internas (tectonismo) e externas (erosao)' },
      { icone: '💡', texto: 'Erosao: desgaste do relevo por agua, vento ou gelo' },
      { icone: '⚠️', texto: 'Pico da Neblina (AM): ponto mais alto do Brasil — 2994m' },
    ],
  },
  mecanica: {
    titulo: 'MECANICA',
    pilulas: [
      { icone: '⚡', texto: 'Velocidade media = distancia / tempo' },
      { icone: '⚡', texto: 'Aceleracao = variacao de velocidade / tempo' },
      { icone: '💡', texto: '1a Lei de Newton: Lei da Inercia' },
      { icone: '💡', texto: '2a Lei de Newton: F = m x a' },
      { icone: '⚠️', texto: '3a Lei: toda acao tem reacao igual e contraria' },
    ],
  },
  termodinamica: {
    titulo: 'TERMODINAMICA',
    pilulas: [
      { icone: '🌡️', texto: 'Temperatura: medida da agitacao das moleculas' },
      { icone: '🌡️', texto: 'Calor: energia em transito entre corpos' },
      { icone: '💡', texto: 'Unidade de temperatura no SI: Kelvin (K)' },
      { icone: '💡', texto: 'Dilatacao termica: corpo aumenta com o calor' },
      { icone: '⚠️', texto: 'Conducao: calor por contato direto entre corpos' },
    ],
  },
  optica: {
    titulo: 'OPTICA',
    pilulas: [
      { icone: '🔆', texto: 'Reflexao: luz retorna ao meio de origem' },
      { icone: '🔆', texto: 'Refracao: luz muda de velocidade ao mudar de meio' },
      { icone: '💡', texto: 'Arco-iris: decomposicao da luz por refracao na chuva' },
      { icone: '💡', texto: 'Espelho plano: imagem virtual, direta e do mesmo tamanho' },
      { icone: '⚠️', texto: 'Velocidade da luz no vacuo: 300.000 km/s' },
    ],
  },
  eletricidade: {
    titulo: 'ELETRICIDADE',
    pilulas: [
      { icone: '⚡', texto: 'Corrente eletrica: fluxo ordenado de eletrons' },
      { icone: '⚡', texto: 'Lei de Ohm: V = R x I (tensao = resistencia x corrente)' },
      { icone: '💡', texto: 'Resistencia medida em Ohm (Ω)' },
      { icone: '💡', texto: 'Potencia: P = V x I (medida em Watts)' },
      { icone: '⚠️', texto: 'Em serie: mesma corrente; em paralelo: mesma tensao' },
    ],
  },
  atomistica: {
    titulo: 'ATOMISTICA',
    pilulas: [
      { icone: '⚛️', texto: 'Nucleo: protons (carga +) e neutrons (sem carga)' },
      { icone: '⚛️', texto: 'Numero atomico Z = numero de protons' },
      { icone: '💡', texto: 'Massa atomica = protons + neutrons' },
      { icone: '💡', texto: 'Isotopos: mesmo Z, numero de neutrons diferente' },
      { icone: '⚠️', texto: 'Ion: atomo que ganhou ou perdeu eletrons' },
    ],
  },
  ligacoes: {
    titulo: 'LIGACOES QUIMICAS',
    pilulas: [
      { icone: '🔗', texto: 'Ligacao ionica: transferencia de eletrons (metal + nao-metal)' },
      { icone: '🔗', texto: 'Ligacao covalente: compartilhamento de eletrons' },
      { icone: '💡', texto: 'Ligacao metalica: ions em mar de eletrons livres' },
      { icone: '💡', texto: 'NaCl (sal): ligacao ionica' },
      { icone: '⚠️', texto: 'H2O (agua): ligacao covalente polar' },
    ],
  },
  reacoes: {
    titulo: 'REACOES QUIMICAS',
    pilulas: [
      { icone: '🧪', texto: 'Sintese: A + B → AB (dois reagentes, um produto)' },
      { icone: '🧪', texto: 'Analise: AB → A + B (um reagente, dois produtos)' },
      { icone: '💡', texto: 'Balancear: igualar atomos dos dois lados da equacao' },
      { icone: '💡', texto: 'Oxidacao: perda de eletrons; reducao: ganho de eletrons' },
      { icone: '⚠️', texto: 'Reagente limitante: o que se esgota primeiro' },
    ],
  },
  solucoes: {
    titulo: 'SOLUCOES',
    pilulas: [
      { icone: '🧫', texto: 'Solucao = soluto (dissolvido) + solvente (que dissolve)' },
      { icone: '🧫', texto: 'Agua e o solvente universal' },
      { icone: '💡', texto: 'Solucao saturada: maximo de soluto dissolvido' },
      { icone: '💡', texto: 'Concentracao (g/L) = massa soluto / volume solucao' },
      { icone: '⚠️', texto: 'Solucao e mistura homogenea — aspecto visual uniforme' },
    ],
  },
  'gramatica-en': {
    titulo: 'GRAMMAR',
    pilulas: [
      { icone: '🇬🇧', texto: 'Present simple: He/She/It + verb + s (she likes)' },
      { icone: '🇬🇧', texto: 'Past simple irregular: go→went, buy→bought, see→saw' },
      { icone: '💡', texto: 'Comparative: good→better, bad→worse, far→farther' },
      { icone: '💡', texto: 'Modal verbs: can, should, must, will, would, may' },
      { icone: '⚠️', texto: 'Present perfect: have/has + past participle (I have studied)' },
    ],
  },
  vocabulary: {
    titulo: 'VOCABULARY',
    pilulas: [
      { icone: '📖', texto: 'Synonym: word with similar meaning (happy = joyful)' },
      { icone: '📖', texto: 'Antonym: word with opposite meaning (hot x cold)' },
      { icone: '💡', texto: 'Context helps determine the meaning of unknown words' },
      { icone: '💡', texto: 'Prefix: word beginning that changes meaning (un-, re-, pre-)' },
      { icone: '⚠️', texto: 'Suffix: word ending that changes function (-tion, -ly, -ful)' },
    ],
  },
  reading: {
    titulo: 'READING',
    pilulas: [
      { icone: '📰', texto: 'Skimming: read quickly to get general idea' },
      { icone: '📰', texto: 'Scanning: look for specific information quickly' },
      { icone: '💡', texto: 'Topic sentence: states the main idea of a paragraph' },
      { icone: '💡', texto: 'Inference: concluding what is implied, not stated' },
      { icone: '⚠️', texto: 'Always read questions before reading the text' },
    ],
  },
  writing: {
    titulo: 'WRITING',
    pilulas: [
      { icone: '✍️', texto: 'Essay structure: introduction, body paragraphs, conclusion' },
      { icone: '✍️', texto: 'Thesis statement: main argument in the introduction' },
      { icone: '💡', texto: 'Coherence: ideas flow logically and are connected' },
      { icone: '💡', texto: 'Topic sentence: first sentence of each body paragraph' },
      { icone: '⚠️', texto: 'Always proofread: check grammar, spelling and punctuation' },
    ],
  },
}