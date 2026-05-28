import { auth, db } from '@/config/firebase'
import { C, F, FS, PAD } from '@/constants/theme'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { doc, getDoc, increment, updateDoc } from 'firebase/firestore'
import { useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const questoesPorTopico: Record<string, {
  pergunta: string
  alternativas: string[]
  correta: number
  explicacao: string
}[]> = {
  trigonometria: [
    { pergunta: 'Em um triangulo retangulo, o seno de um angulo e igual a:', alternativas: ['Cateto adjacente / Hipotenusa', 'Cateto oposto / Hipotenusa', 'Cateto oposto / Cateto adjacente', 'Hipotenusa / Cateto oposto'], correta: 1, explicacao: 'Seno = cateto oposto / hipotenusa. Lembre: SOH.' },
    { pergunta: 'O cosseno de 60 graus e igual a:', alternativas: ['Raiz(3)/2', '1/2', 'Raiz(2)/2', '1'], correta: 1, explicacao: 'cos(60) = 1/2. Valores especiais 30, 45 e 60 sao muito cobrados.' },
    { pergunta: 'A tangente e definida como:', alternativas: ['Seno x Cosseno', 'Cosseno / Seno', 'Seno / Cosseno', 'Hipotenusa / Cateto'], correta: 2, explicacao: 'Tangente = Seno / Cosseno.' },
    { pergunta: 'Com hipotenusa 10 e cateto oposto 6, o seno e:', alternativas: ['0,8', '0,6', '0,75', '0,5'], correta: 1, explicacao: 'Seno = 6/10 = 0,6.' },
    { pergunta: 'Qual e o valor do seno de 90 graus?', alternativas: ['0', 'Raiz(2)/2', '1/2', '1'], correta: 3, explicacao: 'sen(90) = 1. E o valor maximo do seno.' },
  ],
  funcoes: [
    { pergunta: 'Qual e o grafico de uma funcao do 1 grau?', alternativas: ['Parabola', 'Hiperbole', 'Reta', 'Circunferencia'], correta: 2, explicacao: 'A funcao do 1 grau f(x) = ax + b sempre forma uma reta.' },
    { pergunta: 'Na funcao f(x) = 2x + 3, qual e f(4)?', alternativas: ['8', '10', '11', '14'], correta: 2, explicacao: 'f(4) = 2x4 + 3 = 11.' },
    { pergunta: 'Uma parabola abre para baixo quando:', alternativas: ['a = 0', 'a > 0', 'a < 0', 'b < 0'], correta: 2, explicacao: 'Se a < 0 a parabola abre para baixo.' },
    { pergunta: 'Qual e a raiz da funcao f(x) = 3x - 9?', alternativas: ['x = 9', 'x = 3', 'x = -3', 'x = 27'], correta: 1, explicacao: '3x - 9 = 0 → x = 3.' },
    { pergunta: 'O coeficiente angular de f(x) = 5x + 2 e:', alternativas: ['2', '7', '5', '10'], correta: 2, explicacao: 'Na funcao f(x) = ax + b, o coeficiente angular e "a". Aqui a = 5.' },
  ],
  geometria: [
    { pergunta: 'A area de um triangulo com base 8 e altura 5 e:', alternativas: ['40', '20', '13', '80'], correta: 1, explicacao: 'Area = (base x altura) / 2 = 20.' },
    { pergunta: 'O volume de um cubo com aresta 3 e:', alternativas: ['9', '18', '27', '81'], correta: 2, explicacao: 'Volume = aresta³ = 27.' },
    { pergunta: 'A area de um circulo com raio 4 e:', alternativas: ['8π', '16π', '4π', '12π'], correta: 1, explicacao: 'Area = π x r² = 16π.' },
    { pergunta: 'Quantos graus tem a soma dos angulos internos de um triangulo?', alternativas: ['90', '180', '270', '360'], correta: 1, explicacao: 'A soma dos angulos internos de qualquer triangulo e 180 graus.' },
    { pergunta: 'O perimetro de um quadrado de lado 6 e:', alternativas: ['12', '24', '36', '6'], correta: 1, explicacao: 'Perimetro = 4 x lado = 24.' },
  ],
  estatistica: [
    { pergunta: 'A media aritmetica de 4, 6 e 8 e:', alternativas: ['5', '6', '7', '8'], correta: 1, explicacao: 'Media = (4 + 6 + 8) / 3 = 6.' },
    { pergunta: 'A moda de: 2, 3, 3, 4, 5 e:', alternativas: ['2', '3', '4', '5'], correta: 1, explicacao: 'Moda e o valor que mais aparece. O 3 aparece 2 vezes.' },
    { pergunta: 'A mediana de: 1, 3, 5, 7, 9 e:', alternativas: ['3', '5', '7', '9'], correta: 1, explicacao: 'Mediana e o valor central = 5.' },
    { pergunta: 'Qual a amplitude do conjunto: 2, 5, 8, 11?', alternativas: ['6', '8', '9', '13'], correta: 2, explicacao: 'Amplitude = 11 - 2 = 9.' },
    { pergunta: 'Em uma pesquisa, 30 de 120 alunos preferem matematica. Qual a porcentagem?', alternativas: ['15%', '20%', '25%', '30%'], correta: 2, explicacao: '30/120 = 25%.' },
  ],
  probabilidade: [
    { pergunta: 'Ao lancar um dado, qual a probabilidade de sair o numero 3?', alternativas: ['1/3', '1/4', '1/6', '1/2'], correta: 2, explicacao: 'O dado tem 6 faces. P(3) = 1/6.' },
    { pergunta: 'Uma moeda e lancada. Qual a probabilidade de sair cara?', alternativas: ['1/4', '1/3', '1/2', '2/3'], correta: 2, explicacao: 'A moeda tem 2 faces. P(cara) = 1/2.' },
    { pergunta: 'De um baralho de 52 cartas, qual a probabilidade de tirar um as?', alternativas: ['1/13', '1/4', '1/52', '4/13'], correta: 0, explicacao: 'Ha 4 ases em 52 cartas. P = 1/13.' },
    { pergunta: 'Qual o espaco amostral ao lancar 2 moedas?', alternativas: ['2', '3', '4', '6'], correta: 2, explicacao: 'CC, CK, KC, KK — 4 resultados possiveis.' },
    { pergunta: 'Se P(A) = 0,3, qual e P(nao A)?', alternativas: ['0,3', '0,5', '0,6', '0,7'], correta: 3, explicacao: 'P(nao A) = 1 - 0,3 = 0,7.' },
  ],
  interpretacao: [
    { pergunta: 'O que e inferencia em leitura?', alternativas: ['Copiar o texto', 'Concluir algo nao dito explicitamente', 'Resumir o texto', 'Identificar o autor'], correta: 1, explicacao: 'Inferir e deduzir informacoes que nao estao explicitas no texto.' },
    { pergunta: 'O que e ideia principal de um texto?', alternativas: ['O titulo', 'A conclusao', 'A informacao mais importante', 'O primeiro paragrafo'], correta: 2, explicacao: 'A ideia principal e o tema central que o texto desenvolve.' },
    { pergunta: 'O que sao ideias secundarias?', alternativas: ['Informacoes que contradizem o texto', 'Detalhes que apoiam a ideia principal', 'O resumo do texto', 'A opiniao do autor'], correta: 1, explicacao: 'Ideias secundarias complementam a ideia principal.' },
    { pergunta: 'O que e o contexto de uma palavra?', alternativas: ['O dicionario', 'O sinonimo', 'O conjunto de palavras ao redor', 'A etimologia'], correta: 2, explicacao: 'O contexto determina o sentido da palavra.' },
    { pergunta: 'Qual o objetivo de um texto argumentativo?', alternativas: ['Narrar uma historia', 'Descrever um lugar', 'Convencer o leitor', 'Explicar um processo'], correta: 2, explicacao: 'O texto argumentativo busca persuadir o leitor.' },
  ],
  gramatica: [
    { pergunta: 'Qual a funcao do adverbio?', alternativas: ['Substituir o substantivo', 'Modificar o verbo, adjetivo ou outro adverbio', 'Ligar oracoes', 'Indicar o sujeito'], correta: 1, explicacao: 'O adverbio modifica o verbo, o adjetivo ou outro adverbio.' },
    { pergunta: 'Quais sao os tipos de sujeito?', alternativas: ['Simples e composto', 'Simples, composto e indeterminado', 'Determinado e indeterminado', 'Simples, composto, indeterminado e oculto'], correta: 3, explicacao: 'Os tipos de sujeito sao: simples, composto, indeterminado e oculto.' },
    { pergunta: 'O que e um substantivo proprio?', alternativas: ['Nomeia qualquer ser', 'Nomeia ser especifico com letra maiuscula', 'Indica qualidade', 'Substitui o nome'], correta: 1, explicacao: 'Substantivo proprio nomeia ser especifico com letra maiuscula.' },
    { pergunta: 'A palavra "rapidamente" e um:', alternativas: ['Adjetivo', 'Substantivo', 'Adverbio', 'Verbo'], correta: 2, explicacao: 'Palavras terminadas em -mente geralmente sao adverbios.' },
    { pergunta: 'Qual a classificacao do verbo "ser"?', alternativas: ['Transitivo direto', 'Intransitivo', 'De ligacao', 'Transitivo indireto'], correta: 2, explicacao: 'O verbo "ser" e de ligacao.' },
  ],
  redacao: [
    { pergunta: 'Qual a estrutura de uma dissertacao?', alternativas: ['Introducao e conclusao', 'Desenvolvimento e conclusao', 'Introducao, desenvolvimento e conclusao', 'Apenas desenvolvimento'], correta: 2, explicacao: 'A dissertacao tem 3 partes: introducao, desenvolvimento e conclusao.' },
    { pergunta: 'O que e um argumento?', alternativas: ['Uma opiniao sem base', 'Uma razao que sustenta uma tese', 'Um exemplo isolado', 'Uma pergunta retorica'], correta: 1, explicacao: 'Argumento e uma razao que sustenta a tese.' },
    { pergunta: 'O que e coesao textual?', alternativas: ['A beleza do texto', 'A ligacao entre as partes do texto', 'A opiniao do autor', 'A extensao do texto'], correta: 1, explicacao: 'Coesao e a conexao entre os elementos do texto.' },
    { pergunta: 'Qual e a funcao da introducao?', alternativas: ['Resolver o problema', 'Apresentar a tese e contextualizar', 'Listar argumentos', 'Concluir o texto'], correta: 1, explicacao: 'A introducao apresenta o tema e anuncia a tese.' },
    { pergunta: 'O que e um conectivo de conclusao?', alternativas: ['Porem', 'Portanto', 'Alem disso', 'Entretanto'], correta: 1, explicacao: '"Portanto" e conectivo conclusivo.' },
  ],
  literatura: [
    { pergunta: 'Qual movimento literario valorizava a razao e a ciencia?', alternativas: ['Romantismo', 'Barroco', 'Arcadismo', 'Modernismo'], correta: 2, explicacao: 'O Arcadismo (sec. XVIII) valorizava a razao e a ciencia.' },
    { pergunta: 'O Romantismo brasileiro iniciou-se com:', alternativas: ['Machado de Assis', 'Gonzaga', 'Goncalves Dias', 'Drummond'], correta: 2, explicacao: 'Goncalves Dias e considerado o iniciador do Romantismo brasileiro.' },
    { pergunta: 'Realismo e Naturalismo caracterizam-se por:', alternativas: ['Idealismo e fuga da realidade', 'Analise critica e objetiva da sociedade', 'Valorizacao da natureza', 'Nacionalismo exacerbado'], correta: 1, explicacao: 'Realismo e Naturalismo retratavam a realidade de forma critica.' },
    { pergunta: 'Quem escreveu "Dom Casmurro"?', alternativas: ['Jose de Alencar', 'Euclides da Cunha', 'Machado de Assis', 'Graciliano Ramos'], correta: 2, explicacao: '"Dom Casmurro" (1899) e obra de Machado de Assis.' },
    { pergunta: 'O Modernismo brasileiro iniciou-se em:', alternativas: ['1808', '1888', '1922', '1945'], correta: 2, explicacao: 'A Semana de Arte Moderna de 1922 marcou o inicio do Modernismo.' },
  ],
  celula: [
    { pergunta: 'Qual organela produz energia (ATP) na celula?', alternativas: ['Ribossomo', 'Nucleo', 'Mitocondria', 'Vacuolo'], correta: 2, explicacao: 'A mitocondria e a usina de energia da celula.' },
    { pergunta: 'Celulas procariontes se diferenciam por:', alternativas: ['Terem membrana', 'Nao ter nucleo definido', 'Fazerem fotossintese', 'Terem mitocondrias'], correta: 1, explicacao: 'Celulas procariontes nao tem nucleo delimitado.' },
    { pergunta: 'O que e exclusivo de celulas vegetais?', alternativas: ['Membrana plasmatica', 'Ribossomo', 'Mitocondria', 'Parede celular'], correta: 3, explicacao: 'A parede celular e exclusiva das celulas vegetais.' },
    { pergunta: 'Os ribossomos sao responsaveis por:', alternativas: ['Digestao intracelular', 'Sintese de proteinas', 'Producao de energia', 'Divisao celular'], correta: 1, explicacao: 'Os ribossomos produzem proteinas.' },
    { pergunta: 'A membrana plasmatica e composta por:', alternativas: ['Proteinas e carboidratos', 'Lipidios e proteinas', 'DNA e RNA', 'Celulose e amido'], correta: 1, explicacao: 'A membrana e formada por bicamada fosfolipidica com proteinas.' },
  ],
  genetica: [
    { pergunta: 'O DNA e composto por:', alternativas: ['Aminoacidos', 'Nucleotideos', 'Lipidios', 'Carboidratos'], correta: 1, explicacao: 'O DNA e formado por nucleotideos.' },
    { pergunta: 'O que e genotipo?', alternativas: ['A aparencia do individuo', 'O conjunto de genes do individuo', 'A cor dos olhos', 'A altura'], correta: 1, explicacao: 'Genotipo e a constituicao genetica do individuo.' },
    { pergunta: 'O que e fenotipo?', alternativas: ['Os genes recessivos', 'A caracteristica observavel do individuo', 'O cromossomo X', 'O DNA mitocondrial'], correta: 1, explicacao: 'Fenotipo e a expressao observavel dos genes.' },
    { pergunta: 'Um alelo dominante:', alternativas: ['So se expressa em dose dupla', 'Se expressa mesmo com um alelo recessivo', 'Nao se expressa nunca', 'So existe em mulheres'], correta: 1, explicacao: 'O alelo dominante se expressa mesmo sendo heterozigoto.' },
    { pergunta: 'Qual par de cromossomos determina o sexo humano?', alternativas: ['Par 1', 'Par 21', 'Par 23', 'Par 12'], correta: 2, explicacao: 'O par 23 determina o sexo: XX = feminino, XY = masculino.' },
  ],
  ecologia: [
    { pergunta: 'O que e uma cadeia alimentar?', alternativas: ['Um tipo de dieta', 'A sequencia de quem come quem em um ecossistema', 'Uma rede de supermercados', 'O ciclo da agua'], correta: 1, explicacao: 'Cadeia alimentar e a sequencia de organismos onde cada um serve de alimento ao seguinte.' },
    { pergunta: 'Os produtores em uma cadeia alimentar sao:', alternativas: ['Animais herbivoros', 'Fungos', 'Plantas e algas', 'Bacterias decompositoras'], correta: 2, explicacao: 'Produtores sao organismos autorofos que produzem seu proprio alimento.' },
    { pergunta: 'O que e um ecossistema?', alternativas: ['Apenas os seres vivos de uma regiao', 'Os seres vivos e o ambiente fisico interagindo', 'O clima de uma regiao', 'A flora de uma floresta'], correta: 1, explicacao: 'Ecossistema e o conjunto de seres vivos e ambiente fisico em interacao.' },
    { pergunta: 'O que sao decompositores?', alternativas: ['Animais predadores', 'Organismos que decompoem materia organica', 'Plantas carnivoras', 'Herbivoros'], correta: 1, explicacao: 'Decompositores reciclam a materia organica devolvendo nutrientes ao solo.' },
    { pergunta: 'O que e biodiversidade?', alternativas: ['Numero de florestas', 'Variedade de especies em um local', 'Quantidade de agua disponivel', 'Tipo de solo'], correta: 1, explicacao: 'Biodiversidade e a variedade de formas de vida em uma area.' },
  ],
  evolucao: [
    { pergunta: 'Quem formulou a teoria da evolucao por selecao natural?', alternativas: ['Lamarck', 'Mendel', 'Darwin', 'Pasteur'], correta: 2, explicacao: 'Charles Darwin formulou a teoria da evolucao por selecao natural.' },
    { pergunta: 'O que e selecao natural?', alternativas: ['Escolha artificial de animais', 'Sobrevivencia dos mais adaptados ao ambiente', 'Mutacao genetica forcada', 'Reproducao em laboratorio'], correta: 1, explicacao: 'Selecao natural: individuos mais adaptados sobrevivem e reproduzem mais.' },
    { pergunta: 'O que e uma mutacao?', alternativas: ['Doenca genetica', 'Alteracao na sequencia do DNA', 'Cruzamento de especies', 'Reproducao asexuada'], correta: 1, explicacao: 'Mutacao e uma alteracao na sequencia do DNA.' },
    { pergunta: 'O que sao orgaos vestigiais?', alternativas: ['Orgaos em desenvolvimento', 'Orgaos sem funcao aparente, heranca evolutiva', 'Orgaos transplantados', 'Orgaos artificiais'], correta: 1, explicacao: 'Orgaos vestigiais perderam a funcao ao longo da evolucao.' },
    { pergunta: 'O que e especiacao?', alternativas: ['Extincao de uma especie', 'Formacao de novas especies', 'Migracao de animais', 'Adaptacao ao clima'], correta: 1, explicacao: 'Especiacao e a formacao de novas especies a partir de populacoes ancestrais.' },
  ],
  'brasil-colonial': [
    { pergunta: 'Em que ano o Brasil foi descoberto pelos portugueses?', alternativas: ['1492', '1498', '1500', '1502'], correta: 2, explicacao: 'Pedro Alvares Cabral chegou ao Brasil em 22 de abril de 1500.' },
    { pergunta: 'Qual o primeiro ciclo economico do Brasil colonial?', alternativas: ['Ouro', 'Cafe', 'Pau-brasil', 'Cana-de-acucar'], correta: 2, explicacao: 'O pau-brasil foi o primeiro produto de exploracao economica do Brasil.' },
    { pergunta: 'O que foi o Quilombo dos Palmares?', alternativas: ['Uma fazenda colonial', 'Um territorio de escravos fugidos', 'Uma missao jesuitica', 'Uma vila portuguesa'], correta: 1, explicacao: 'Palmares foi o maior quilombo brasileiro, liderado por Zumbi.' },
    { pergunta: 'O que foi a Inconfidencia Mineira?', alternativas: ['Uma guerra com a Espanha', 'Uma revolta contra o dominio portugues', 'Uma reforma religiosa', 'Uma epidemia'], correta: 1, explicacao: 'A Inconfidencia Mineira (1789) foi uma conspiracao para libertar o Brasil.' },
    { pergunta: 'Quem foi Tiradentes?', alternativas: ['Um rei portugues', 'Um lider da Inconfidencia Mineira', 'Um capitao-geral', 'Um jesuita'], correta: 1, explicacao: 'Tiradentes foi martir da Inconfidencia Mineira.' },
  ],
  revolucoes: [
    { pergunta: 'Em que ano ocorreu a Revolucao Francesa?', alternativas: ['1776', '1789', '1804', '1815'], correta: 1, explicacao: 'A Revolucao Francesa comecou em 1789 com a queda da Bastilha.' },
    { pergunta: 'O lema da Revolucao Francesa era:', alternativas: ['Deus, Patria e Familia', 'Liberdade, Igualdade e Fraternidade', 'Paz e Amor', 'Trabalho e Progresso'], correta: 1, explicacao: 'Liberte, Egalite, Fraternite simbolizou os ideais da Revolucao Francesa.' },
    { pergunta: 'A Revolucao Industrial iniciou-se em:', alternativas: ['Franca', 'Alemanha', 'Inglaterra', 'Estados Unidos'], correta: 2, explicacao: 'A Revolucao Industrial comecou na Inglaterra no seculo XVIII.' },
    { pergunta: 'O que foi a Revolucao Russa de 1917?', alternativas: ['Uma guerra civil', 'A tomada do poder pelos comunistas', 'Uma invasao estrangeira', 'Uma reforma religiosa'], correta: 1, explicacao: 'A Revolucao Russa de 1917 levou os bolcheviques ao poder.' },
    { pergunta: 'Quem liderou a Revolucao Russa?', alternativas: ['Stalin', 'Trotsky', 'Lenin', 'Kruschev'], correta: 2, explicacao: 'Lenin liderou os bolcheviques na Revolucao de Outubro de 1917.' },
  ],
  'guerra-mundial': [
    { pergunta: 'Em que ano comecou a 1a Guerra Mundial?', alternativas: ['1910', '1914', '1918', '1939'], correta: 1, explicacao: 'A 1a Guerra Mundial comecou em 1914.' },
    { pergunta: 'O que foi o nazismo?', alternativas: ['Um movimento democratico', 'Uma ideologia totalitaria de extrema-direita', 'Um partido socialista', 'Uma corrente religiosa'], correta: 1, explicacao: 'O nazismo foi uma ideologia totalitaria e racista liderada por Hitler.' },
    { pergunta: 'Em que ano terminou a 2a Guerra Mundial?', alternativas: ['1943', '1944', '1945', '1946'], correta: 2, explicacao: 'A 2a Guerra Mundial terminou em 1945.' },
    { pergunta: 'O que foi o Holocausto?', alternativas: ['Uma batalha naval', 'O genocidio de judeus pelo regime nazista', 'Um bombardeio atomico', 'Uma epidemia'], correta: 1, explicacao: 'O Holocausto foi o exterminio de 6 milhoes de judeus pelo nazismo.' },
    { pergunta: 'Qual evento levou os EUA a entrar na 2a Guerra?', alternativas: ['Invasao da Polonia', 'Queda de Paris', 'Ataque a Pearl Harbor', 'Rendicao da Italia'], correta: 2, explicacao: 'O ataque a Pearl Harbor em 1941 levou os EUA a entrar na guerra.' },
  ],
  'brasil-republica': [
    { pergunta: 'Em que ano foi proclamada a Republica no Brasil?', alternativas: ['1822', '1850', '1888', '1889'], correta: 3, explicacao: 'A Republica foi proclamada em 15/11/1889 por Deodoro da Fonseca.' },
    { pergunta: 'O que foi a Era Vargas?', alternativas: ['Um periodo medieval', 'O governo de Getulio Vargas (1930-1945 e 1950-1954)', 'A ditadura militar', 'O Imperio brasileiro'], correta: 1, explicacao: 'A Era Vargas foi marcada pelo populismo e industrializacao.' },
    { pergunta: 'Em que ano foi instaurada a ditadura militar no Brasil?', alternativas: ['1960', '1964', '1968', '1970'], correta: 1, explicacao: 'O golpe militar ocorreu em 31 de marco de 1964.' },
    { pergunta: 'O que foi a Lei de Anistia de 1979?', alternativas: ['Uma lei de reforma agraria', 'Uma lei que permitiu o retorno de exilados politicos', 'Uma lei economica', 'Uma constituicao'], correta: 1, explicacao: 'A Lei de Anistia de 1979 permitiu o retorno de exilados politicos.' },
    { pergunta: 'Em que ano o Brasil voltou a ter eleicoes diretas para presidente?', alternativas: ['1985', '1989', '1994', '2002'], correta: 1, explicacao: 'As primeiras eleicoes diretas pos-ditadura ocorreram em 1989.' },
  ],
  climatologia: [
    { pergunta: 'O que diferencia clima de tempo?', alternativas: ['Sao a mesma coisa', 'Clima e de longo prazo, tempo e momentaneo', 'Tempo e de longo prazo, clima e momentaneo', 'Clima e local, tempo e global'], correta: 1, explicacao: 'Clima e padrao de longo prazo. Tempo e o estado atmosferico atual.' },
    { pergunta: 'O que causa as estacoes do ano?', alternativas: ['A distancia da Terra ao Sol', 'A inclinacao do eixo terrestre', 'A rotacao da Terra', 'As manchas solares'], correta: 1, explicacao: 'As estacoes sao causadas pela inclinacao do eixo terrestre.' },
    { pergunta: 'O que e o efeito estufa?', alternativas: ['Aquecimento de estufas agricolas', 'Retencao de calor pelos gases atmosfericos', 'Buraco na camada de ozonio', 'Correntes oceanicas'], correta: 1, explicacao: 'O efeito estufa e a retencao de calor pelos gases atmosfericos.' },
    { pergunta: 'Qual e o clima predominante na Amazonia?', alternativas: ['Semiarido', 'Tropical umido', 'Subtropical', 'Equatorial'], correta: 3, explicacao: 'A Amazonia tem clima equatorial com chuvas abundantes.' },
    { pergunta: 'O que e o El Nino?', alternativas: ['Um tipo de furacao', 'Aquecimento das aguas do Pacifico', 'Um vento polar', 'Uma corrente do Atlantico'], correta: 1, explicacao: 'El Nino e o aquecimento anomalo das aguas do Pacifico equatorial.' },
  ],
  geopolitica: [
    { pergunta: 'O que e soberania nacional?', alternativas: ['O exercito de um pais', 'O poder supremo de um Estado sobre seu territorio', 'A moeda nacional', 'A populacao de um pais'], correta: 1, explicacao: 'Soberania e o poder supremo do Estado sobre seu territorio.' },
    { pergunta: 'O que e a ONU?', alternativas: ['Uma alianca militar', 'Organizacao das Nacoes Unidas', 'Um banco mundial', 'Um acordo comercial'], correta: 1, explicacao: 'A ONU foi criada em 1945 para promover a paz mundial.' },
    { pergunta: 'O que foi a Guerra Fria?', alternativas: ['Uma guerra no Polo Norte', 'Tensao politica entre EUA e URSS', 'Um conflito na Asia', 'Uma guerra economica europeia'], correta: 1, explicacao: 'A Guerra Fria (1947-1991) foi a disputa entre EUA e URSS.' },
    { pergunta: 'O que e globalizacao?', alternativas: ['Aquecimento global', 'Integracao economica, cultural e politica mundial', 'Exploracao espacial', 'Migracao de populacoes'], correta: 1, explicacao: 'Globalizacao e a integracao mundial em todas as esferas.' },
    { pergunta: 'O que e o BRICS?', alternativas: ['Uma moeda unica', 'Grupo de paises emergentes: Brasil, Russia, India, China e Africa do Sul', 'Uma alianca militar', 'Um tratado ambiental'], correta: 1, explicacao: 'BRICS e o grupo das principais economias emergentes mundiais.' },
  ],
  urbanizacao: [
    { pergunta: 'O que e urbanizacao?', alternativas: ['Construcao de predios', 'Crescimento da populacao urbana em relacao a rural', 'Reforma de cidades', 'Criacao de novas cidades'], correta: 1, explicacao: 'Urbanizacao e o processo de crescimento e expansao das cidades.' },
    { pergunta: 'O que sao megalopoles?', alternativas: ['Cidades medievais', 'Conjuntos de metropoles unidas', 'Cidades sustentaveis', 'Capitais de paises'], correta: 1, explicacao: 'Megalopoles sao enormes conurbacoes formadas pela uniao de metropoles.' },
    { pergunta: 'O que causa a periferizacao urbana?', alternativas: ['Aumento do turismo', 'Alto custo das areas centrais empurrando pobres para periferia', 'Desastres naturais', 'Politicas publicas de moradia'], correta: 1, explicacao: 'A especulacao imobiliaria empurra a populacao de baixa renda para a periferia.' },
    { pergunta: 'O que e conurbacao?', alternativas: ['Tipo de transporte urbano', 'Uniao de areas urbanas de cidades distintas', 'Area rural dentro da cidade', 'Zona industrial'], correta: 1, explicacao: 'Conurbacao e a uniao de cidades vizinhas formando area continua.' },
    { pergunta: 'Qual o maior problema das megacidades?', alternativas: ['Excesso de verde', 'Superpopulacao, trafego e falta de infraestrutura', 'Falta de industrias', 'Excesso de emprego'], correta: 1, explicacao: 'Megacidades enfrentam superpopulacao, transito e deficit de infraestrutura.' },
  ],
  relevo: [
    { pergunta: 'O que e uma planicie?', alternativas: ['Terreno muito elevado', 'Terreno plano em baixa altitude', 'Terreno acidentado', 'Terreno submerso'], correta: 1, explicacao: 'Planicie e terreno plano ou levemente ondulado em baixa altitude.' },
    { pergunta: 'O que e um planalto?', alternativas: ['Montanha isolada', 'Terreno elevado e relativamente plano', 'Vale profundo', 'Litoral'], correta: 1, explicacao: 'Planalto e uma extensao elevada com superficie relativamente plana.' },
    { pergunta: 'O que causa o relevo?', alternativas: ['Apenas o vento', 'Forcas internas (tectonismo) e externas (erosao)', 'Apenas a chuva', 'Apenas o ser humano'], correta: 1, explicacao: 'O relevo e modelado por forcas internas e externas.' },
    { pergunta: 'O que e erosao?', alternativas: ['Formacao de montanhas', 'Desgaste do relevo por agentes externos', 'Deposito de sedimentos', 'Movimento de placas'], correta: 1, explicacao: 'Erosao e o desgaste do relevo por agua, vento, gelo ou gravidade.' },
    { pergunta: 'Qual o ponto mais alto do Brasil?', alternativas: ['Pico da Bandeira', 'Pico da Neblina', 'Serra do Mar', 'Chapada Diamantina'], correta: 1, explicacao: 'O Pico da Neblina (2994m) no Amazonas e o ponto mais alto do Brasil.' },
  ],
  mecanica: [
    { pergunta: 'A formula da 2a Lei de Newton e:', alternativas: ['F = m/a', 'F = m + a', 'F = m x a', 'F = a/m'], correta: 2, explicacao: 'F = m x a. Forca = massa x aceleracao.' },
    { pergunta: 'Um carro percorre 120km em 2h. Velocidade media:', alternativas: ['240 km/h', '60 km/h', '80 km/h', '100 km/h'], correta: 1, explicacao: 'Velocidade media = 120/2 = 60 km/h.' },
    { pergunta: 'A 1a Lei de Newton e conhecida como:', alternativas: ['Lei da Acao e Reacao', 'Lei da Gravitacao', 'Lei da Inercia', 'Lei da Conservacao'], correta: 2, explicacao: 'A 1a Lei (Inercia): corpo em repouso tende a permanecer em repouso.' },
    { pergunta: 'Forca de 20N em objeto de 4kg. Aceleracao:', alternativas: ['80 m/s2', '16 m/s2', '24 m/s2', '5 m/s2'], correta: 3, explicacao: 'a = F/m = 20/4 = 5 m/s2.' },
    { pergunta: 'A 3a Lei de Newton afirma que:', alternativas: ['F = ma', 'Todo corpo tende a inercia', 'Toda acao tem reacao oposta', 'Energia nao se cria'], correta: 2, explicacao: 'A 3a Lei: para toda acao ha uma reacao de mesma intensidade e direcao oposta.' },
  ],
  termodinamica: [
    { pergunta: 'O que e temperatura?', alternativas: ['Quantidade de calor', 'Medida da agitacao das moleculas', 'Pressao do gas', 'Volume do corpo'], correta: 1, explicacao: 'Temperatura e a medida da agitacao termica das moleculas.' },
    { pergunta: 'O que e calor?', alternativas: ['Temperatura alta', 'Energia em transito entre corpos', 'Sensacao de quente', 'Estado da materia'], correta: 1, explicacao: 'Calor e energia termica em transito entre corpos.' },
    { pergunta: 'Em que unidade medimos temperatura no SI?', alternativas: ['Celsius', 'Fahrenheit', 'Kelvin', 'Joule'], correta: 2, explicacao: 'No SI, a temperatura e medida em Kelvin (K).' },
    { pergunta: 'O que e dilatacao termica?', alternativas: ['Reducao do volume com calor', 'Aumento do volume com o calor', 'Mudanca de estado', 'Conducao de calor'], correta: 1, explicacao: 'Dilatacao termica e o aumento das dimensoes ao receber calor.' },
    { pergunta: 'O que e conducao termica?', alternativas: ['Transmissao por correntes de fluido', 'Transmissao por ondas', 'Transmissao por contato direto', 'Transmissao no vacuo'], correta: 2, explicacao: 'Conducao e a transferencia de calor por contato direto.' },
  ],
  optica: [
    { pergunta: 'O que e reflexao da luz?', alternativas: ['Dobramento da luz', 'Retorno da luz ao meio de origem', 'Absorcao da luz', 'Emissao de luz'], correta: 1, explicacao: 'Reflexao e o retorno da luz ao meio de origem.' },
    { pergunta: 'O que e refracao?', alternativas: ['Reflexao total', 'Mudanca de velocidade e direcao da luz ao mudar de meio', 'Absorcao de luz', 'Decomposicao da luz'], correta: 1, explicacao: 'Refracao e a mudanca de velocidade da luz ao mudar de meio.' },
    { pergunta: 'O arco-iris e formado por:', alternativas: ['Reflexao simples', 'Refracao e reflexao da luz nas gotas de chuva', 'Emissao de luz pelas nuvens', 'Absorcao de luz'], correta: 1, explicacao: 'O arco-iris ocorre pela decomposicao da luz por refracao nas gotas.' },
    { pergunta: 'O que e um espelho plano?', alternativas: ['Lente convergente', 'Superficie polida que reflete a luz regularmente', 'Superficie que refrata a luz', 'Prisma optico'], correta: 1, explicacao: 'Espelho plano produz imagens virtuais e simetricas.' },
    { pergunta: 'Qual a velocidade da luz no vacuo?', alternativas: ['300 km/s', '300.000 km/s', '3.000 km/s', '30.000 km/s'], correta: 1, explicacao: 'A velocidade da luz no vacuo e aproximadamente 300.000 km/s.' },
  ],
  eletricidade: [
    { pergunta: 'O que e corrente eletrica?', alternativas: ['Tensao entre dois pontos', 'Fluxo ordenado de cargas eletricas', 'Resistencia de um condutor', 'Potencia de um circuito'], correta: 1, explicacao: 'Corrente eletrica e o fluxo ordenado de eletrons em um condutor.' },
    { pergunta: 'A Lei de Ohm relaciona:', alternativas: ['Massa e energia', 'Tensao, corrente e resistencia', 'Forca e aceleracao', 'Calor e temperatura'], correta: 1, explicacao: 'A Lei de Ohm: V = R x I.' },
    { pergunta: 'A unidade de resistencia eletrica e:', alternativas: ['Volt', 'Ampere', 'Ohm', 'Watt'], correta: 2, explicacao: 'A resistencia eletrica e medida em Ohm.' },
    { pergunta: 'O que e um circuito em serie?', alternativas: ['Componentes em caminhos paralelos', 'Componentes em sequencia num unico caminho', 'Circuito sem resistencia', 'Circuito de corrente alternada'], correta: 1, explicacao: 'Em serie, os componentes estao ligados sequencialmente.' },
    { pergunta: 'O que e potencia eletrica?', alternativas: ['Energia armazenada', 'Taxa de consumo ou producao de energia', 'Tensao do circuito', 'Resistencia do fio'], correta: 1, explicacao: 'Potencia e a taxa de transferencia de energia. P = V x I.' },
  ],
  atomistica: [
    { pergunta: 'Quantas particulas existem no nucleo do atomo?', alternativas: ['Apenas eletrons', 'Protons e eletrons', 'Protons e neutrons', 'Apenas protons'], correta: 2, explicacao: 'O nucleo e formado por protons e neutrons.' },
    { pergunta: 'O numero atomico (Z) indica:', alternativas: ['O numero de neutrons', 'O numero de protons', 'A massa do atomo', 'O numero de eletrons da ultima camada'], correta: 1, explicacao: 'O numero atomico Z indica a quantidade de protons no nucleo.' },
    { pergunta: 'O que sao isotopos?', alternativas: ['Atomos de elementos diferentes', 'Atomos do mesmo elemento com numero de neutrons diferente', 'Ions positivos', 'Moleculas com a mesma formula'], correta: 1, explicacao: 'Isotopos sao atomos do mesmo elemento com numero de neutrons diferente.' },
    { pergunta: 'A massa atomica e calculada por:', alternativas: ['Protons + Eletrons', 'Protons + Neutrons', 'Neutrons - Protons', 'Eletrons x Protons'], correta: 1, explicacao: 'Massa atomica = protons + neutrons.' },
    { pergunta: 'O que e um ion?', alternativas: ['Atomo neutro', 'Atomo que ganhou ou perdeu eletrons', 'Molecula polar', 'Elemento radioativo'], correta: 1, explicacao: 'Ion e um atomo que ganhou ou perdeu eletrons.' },
  ],
  ligacoes: [
    { pergunta: 'O que e ligacao ionica?', alternativas: ['Compartilhamento de eletrons', 'Transferencia de eletrons entre atomos', 'Ligacao entre metais', 'Ligacao em moleculas organicas'], correta: 1, explicacao: 'Ligacao ionica e a transferencia de eletrons entre atomos.' },
    { pergunta: 'O que e ligacao covalente?', alternativas: ['Transferencia de eletrons', 'Compartilhamento de pares de eletrons', 'Atracao entre ions', 'Ligacao metalica'], correta: 1, explicacao: 'Ligacao covalente e o compartilhamento de pares de eletrons.' },
    { pergunta: 'O que caracteriza a ligacao metalica?', alternativas: ['Ions em mar de eletrons livres', 'Compartilhamento covalente', 'Transferencia ionica', 'Ligacao de hidrogenio'], correta: 0, explicacao: 'Ligacao metalica: ions positivos em mar de eletrons livres.' },
    { pergunta: 'O NaCl (sal de cozinha) tem ligacao:', alternativas: ['Covalente polar', 'Covalente apolar', 'Ionica', 'Metalica'], correta: 2, explicacao: 'O NaCl e formado por ligacao ionica.' },
    { pergunta: 'A agua (H2O) tem ligacao:', alternativas: ['Ionica', 'Covalente polar', 'Covalente apolar', 'Metalica'], correta: 1, explicacao: 'A agua tem ligacao covalente polar.' },
  ],
  reacoes: [
    { pergunta: 'O que e uma reacao de sintese?', alternativas: ['A + B → C + D', 'A + B → AB', 'AB → A + B', 'AB + CD → AD + CB'], correta: 1, explicacao: 'Reacao de sintese: dois reagentes formam um unico produto.' },
    { pergunta: 'O que e uma reacao de analise?', alternativas: ['A + B → AB', 'AB → A + B', 'A + B → C + D', 'AB + C → AC + B'], correta: 1, explicacao: 'Reacao de analise: um composto se separa em dois ou mais produtos.' },
    { pergunta: 'O que e balancear uma equacao?', alternativas: ['Achar os produtos', 'Igualar o numero de atomos dos dois lados', 'Calcular a massa molar', 'Determinar o estado fisico'], correta: 1, explicacao: 'Balancear e igualar o numero de atomos de cada lado da equacao.' },
    { pergunta: 'Na reacao: Fe + O2 → Fe2O3, o ferro sofre:', alternativas: ['Reducao', 'Oxidacao', 'Neutralizacao', 'Decomposicao'], correta: 1, explicacao: 'O ferro perde eletrons (oxidacao).' },
    { pergunta: 'O que e reagente limitante?', alternativas: ['O reagente mais abundante', 'O reagente que se esgota primeiro', 'O produto final', 'O catalisador'], correta: 1, explicacao: 'Reagente limitante e o que se esgota primeiro.' },
  ],
  solucoes: [
    { pergunta: 'O que e soluto?', alternativas: ['O liquido que dissolve', 'A substancia dissolvida', 'O resultado da mistura', 'A temperatura da solucao'], correta: 1, explicacao: 'Soluto e a substancia que se dissolve no solvente.' },
    { pergunta: 'O que e solvente?', alternativas: ['A substancia dissolvida', 'O meio que dissolve o soluto', 'A concentracao da solucao', 'O precipitado'], correta: 1, explicacao: 'Solvente e a substancia que dissolve o soluto.' },
    { pergunta: 'O que e uma solucao saturada?', alternativas: ['Muito diluida', 'Com o maximo de soluto dissolvido', 'Sem soluto', 'Com dois solventes'], correta: 1, explicacao: 'Solucao saturada contem o maximo de soluto dissolvido.' },
    { pergunta: 'O que e concentracao em g/L?', alternativas: ['Moles por litro', 'Gramas de soluto por litro de solucao', 'Massa do solvente', 'Temperatura de ebulicao'], correta: 1, explicacao: 'Concentracao (g/L) = massa do soluto / volume da solucao.' },
    { pergunta: 'Dissolver sal na agua e um exemplo de:', alternativas: ['Reacao quimica', 'Mistura heterogenea', 'Solucao (mistura homogenea)', 'Precipitacao'], correta: 2, explicacao: 'Sal dissolvido em agua forma uma solucao — mistura homogenea.' },
  ],
  'gramatica-en': [
    { pergunta: 'What is the past tense of "go"?', alternativas: ['Goed', 'Gone', 'Went', 'Going'], correta: 2, explicacao: '"Go" is irregular. Past simple: went.' },
    { pergunta: 'Which sentence is correct?', alternativas: ["She don't like coffee", "She doesn't likes coffee", "She doesn't like coffee", 'She not like coffee'], correta: 2, explicacao: 'With he/she/it use does + base verb.' },
    { pergunta: 'What is the comparative form of "good"?', alternativas: ['Gooder', 'More good', 'Better', 'Best'], correta: 2, explicacao: '"Good" is irregular: good → better → best.' },
    { pergunta: 'Which is a modal verb?', alternativas: ['Run', 'Should', 'Quickly', 'Beautiful'], correta: 1, explicacao: 'Modal verbs: can, should, must, will, would, may, might.' },
    { pergunta: 'What tense is: "I have studied for two hours"?', alternativas: ['Simple past', 'Present continuous', 'Present perfect', 'Past perfect'], correta: 2, explicacao: 'Present perfect: have/has + past participle.' },
  ],
  vocabulary: [
    { pergunta: 'What does "enormous" mean?', alternativas: ['Very small', 'Very large', 'Very fast', 'Very old'], correta: 1, explicacao: '"Enormous" means extremely large.' },
    { pergunta: 'What is a synonym for "happy"?', alternativas: ['Sad', 'Angry', 'Joyful', 'Tired'], correta: 2, explicacao: '"Joyful" is a synonym for happy.' },
    { pergunta: 'What does "ancient" mean?', alternativas: ['Modern', 'Very old', 'Broken', 'Expensive'], correta: 1, explicacao: '"Ancient" means very old.' },
    { pergunta: 'What is an antonym for "difficult"?', alternativas: ['Hard', 'Complex', 'Easy', 'Complicated'], correta: 2, explicacao: '"Easy" is the antonym of "difficult".' },
    { pergunta: 'What does "frequently" mean?', alternativas: ['Never', 'Sometimes', 'Always', 'Often'], correta: 3, explicacao: '"Frequently" means often.' },
  ],
  reading: [
    { pergunta: 'What is the main idea of a text?', alternativas: ['The first sentence', 'The title only', 'The central topic the text discusses', 'The conclusion'], correta: 2, explicacao: 'The main idea is the central point the text develops.' },
    { pergunta: 'What does "to infer" mean in reading?', alternativas: ['To copy the text', 'To translate the text', 'To draw conclusions not explicitly stated', 'To summarize'], correta: 2, explicacao: 'To infer means to deduce implied information.' },
    { pergunta: 'What is a "topic sentence"?', alternativas: ['The last sentence of a paragraph', 'The sentence that states the main idea of a paragraph', 'A question in the text', 'A definition'], correta: 1, explicacao: 'A topic sentence introduces the main idea of a paragraph.' },
    { pergunta: 'What is context in reading?', alternativas: ['The dictionary definition', 'The surrounding text that helps determine meaning', "The author's name", 'The title'], correta: 1, explicacao: 'Context helps clarify the meaning of words.' },
    { pergunta: 'What is skimming?', alternativas: ['Reading every word carefully', 'Reading quickly to get the general idea', 'Looking for specific information', 'Translating the text'], correta: 1, explicacao: 'Skimming is reading quickly for general meaning.' },
  ],
  writing: [
    { pergunta: 'What is a thesis statement?', alternativas: ['A question', 'The main argument of an essay', 'A conclusion', 'A definition'], correta: 1, explicacao: 'A thesis statement presents the main argument of an essay.' },
    { pergunta: 'What is a paragraph?', alternativas: ['A single sentence', 'A group of sentences about one idea', 'An entire essay', 'A title'], correta: 1, explicacao: 'A paragraph develops one main idea.' },
    { pergunta: 'What is coherence in writing?', alternativas: ['Using long words', 'Logical connection between ideas', 'Writing quickly', 'Using many examples'], correta: 1, explicacao: 'Coherence means ideas flow logically.' },
    { pergunta: 'What is a topic sentence in a paragraph?', alternativas: ['The last sentence', 'The sentence that introduces the main idea', 'A quotation', 'A statistic'], correta: 1, explicacao: 'The topic sentence introduces the paragraph.' },
    { pergunta: 'What does "proofread" mean?', alternativas: ['Write a first draft', 'Read and correct errors in a text', 'Create an outline', 'Research a topic'], correta: 1, explicacao: 'Proofreading means reviewing and fixing errors.' },
  ],
}

const questoesPadrao = [{
  pergunta: 'Qual e a melhor forma de estudar?',
  alternativas: ['Decorar sem entender', 'Estudar com exemplos praticos', 'Estudar so na vespera', 'Nao estudar'],
  correta: 1,
  explicacao: 'Estudar com exemplos praticos melhora a retencao do conteudo.',
}]

const LETRAS = ['A', 'B', 'C', 'D']
const XP_POR_QUESTAO = 10

export default function QuestScreen() {
  const router = useRouter()
  const { portal, materia, topico } = useLocalSearchParams<{
    portal: string; materia: string; topico: string
  }>()

  const questoes = questoesPorTopico[topico] ?? questoesPadrao
  const [indice, setIndice] = useState(0)
  const [resposta, setResposta] = useState<number | null>(null)
  const [acertos, setAcertos] = useState(0)
  const [finalizado, setFinalizado] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState('')

  const questao = questoes[indice]
  const xpGanho = acertos * XP_POR_QUESTAO

  function responder(i: number) {
    if (resposta !== null) return
    setResposta(i)
    if (i === questao.correta) setAcertos(a => a + 1)
  }

  function proxima() {
    if (indice + 1 >= questoes.length) {
      setFinalizado(true)
      salvarXP()
    } else {
      setIndice(i => i + 1)
      setResposta(null)
    }
  }

  async function salvarXP() {
  if (!auth.currentUser) return
  setSalvando(true)
  try {
    const uid = auth.currentUser.uid
    const campo = portal === 'ciclos' ? 'pontosTemporarios' : 'pontosPermanentes'
    const xpFinal = portal === 'mural' ? xpGanho + 10 : xpGanho
    const userRef = doc(db, 'usuarios', uid)
    const snap = await getDoc(userRef)
    const dados = snap.data()
    const xpAtual = (dados?.pontosPermanentes ?? 0) + (portal !== 'ciclos' ? xpFinal : 0)

    const niveis = [0, 50, 150, 300, 500, 750, 1000, 1500, 2000, 3000]
    let novoNivel = 1
    for (let i = 0; i < niveis.length; i++) {
      if (xpAtual >= niveis[i]) novoNivel = i + 1
    }

    await updateDoc(userRef, {
      [campo]: increment(xpFinal),
      nivel: novoNivel,
      [`xpMaterias.${materia}`]: increment(xpFinal),
    })

    setFeedbackMsg(
      `+${xpFinal} XP EM ${materia?.toUpperCase()}${portal === 'mural' ? ' +BONUS MURAL!' : ''}`
    )
  } catch (e) {
    console.log('Erro ao salvar XP:', e)
  }
  setSalvando(false)
}
  function corBorda(i: number) {
    if (resposta === null) return C.border2
    if (i === questao.correta) return C.green
    if (i === resposta) return C.red
    return C.border2
  }

  function corBg(i: number) {
    if (resposta === null) return C.panel
    if (i === questao.correta) return '#001a08'
    if (i === resposta) return '#1a0000'
    return C.panel
  }

  if (finalizado) {
    const pct = Math.round((acertos / questoes.length) * 100)
    return (
      <View style={s.root}>
        <ScrollView style={s.scroll} contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>

          <View style={s.win}>
            <View style={s.winInner}>
              <View style={s.winTitle}>
                <Text style={s.winTitleTxt}>RESULTADO DA QUEST</Text>
              </View>
              <View style={s.resultBody}>
                <Text style={s.resultEmoji}>
                  {pct >= 80 ? '🏆' : pct >= 50 ? '⭐' : '💪'}
                </Text>
                <Text style={s.resultTitulo}>QUEST CONCLUIDA!</Text>
                <Text style={s.resultSub}>
                  {pct >= 80 ? 'EXCELENTE DESEMPENHO!' : pct >= 50 ? 'BOM TRABALHO!' : 'CONTINUE PRATICANDO!'}
                </Text>
                <View style={s.resultCtx}>
                  <Text style={s.resultCtxTxt}>
                    {materia?.toUpperCase()} · {topico?.toUpperCase().replace(/-/g, ' ')}
                  </Text>
                </View>
                {feedbackMsg !== '' && (
                  <View style={s.feedbackXP}>
                    <Text style={s.feedbackXPTxt}>⚡ {feedbackMsg}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={s.win}>
            <View style={s.winInner}>
              <View style={s.winTitle}>
                <Text style={s.winTitleTxt}>ESTATISTICAS</Text>
              </View>
              <View style={s.statRow}>
                <Text style={s.statLbl}>ACERTOS</Text>
                <Text style={[s.statVal, { color: C.green2 }]}>{acertos}/{questoes.length}</Text>
              </View>
              <View style={s.statRow}>
                <Text style={s.statLbl}>APROVEITAMENTO</Text>
                <Text style={[s.statVal, { color: C.blue2 }]}>{pct}%</Text>
              </View>
              <View style={[s.statRow, { borderBottomWidth: 0 }]}>
                <Text style={s.statLbl}>XP CONQUISTADO</Text>
                <Text style={[s.statVal, { color: C.gold2 }]}>
                +{portal === 'mural' ? xpGanho + 10 : xpGanho} XP
                </Text>
              </View>
            </View>
          </View>

          <View style={s.win}>
            <View style={s.winInner}>
              <TouchableOpacity style={s.btnBlue} onPress={() => router.replace('/(aluno)/')} activeOpacity={0.8}>
                <Text style={s.btnBlueTxt}>{salvando ? 'SALVANDO...' : '▶ VOLTAR AO HUB'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.btnGhost}
                onPress={() => { setIndice(0); setAcertos(0); setResposta(null); setFinalizado(false); setFeedbackMsg('') }}
                activeOpacity={0.8}
              >
                <Text style={s.btnGhostTxt}>REPETIR QUEST</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </View>
    )
  }

  return (
    <View style={s.root}>
      <ScrollView style={s.scroll} contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>

        <View style={s.win}>
          <View style={s.winInner}>
            <View style={s.winTitle}>
              <Text style={s.winTitleTxt}>Q {indice + 1}/{questoes.length}</Text>
              <Text style={[s.winTitleTxt, { color: C.gold2 }]}>+{acertos * XP_POR_QUESTAO} XP</Text>
            </View>
            <View style={s.progTrack}>
              <View style={[s.progFill, { width: `${(indice / questoes.length) * 100}%` as any }]} />
            </View>
          </View>
        </View>

        <View style={s.win}>
          <View style={s.winInner}>
            <View style={s.winTitle}>
              <Text style={s.winTitleTxt}>QUESTAO</Text>
            </View>
            <View style={s.questaoBody}>
              <Text style={s.questaoTxt}>{questao.pergunta}</Text>
            </View>
          </View>
        </View>

        <View style={s.win}>
          <View style={s.winInner}>
            <View style={s.winTitle}>
              <Text style={s.winTitleTxt}>ALTERNATIVAS</Text>
            </View>
            {questao.alternativas.map((alt, i) => (
              <TouchableOpacity
                key={i}
                style={[s.optRow, { backgroundColor: corBg(i), borderBottomColor: corBorda(i) }]}
                onPress={() => responder(i)}
                activeOpacity={0.8}
              >
                <View style={[s.optKey, { borderColor: corBorda(i) }]}>
                  <Text style={[s.optKeyTxt, { color: resposta !== null ? corBorda(i) : C.text3 }]}>
                    {LETRAS[i]}
                  </Text>
                </View>
                <Text style={s.optTxt}>{alt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {resposta !== null && (
          <View style={s.win}>
            <View style={s.winInner}>
              <View style={[s.winTitle, { borderBottomColor: resposta === questao.correta ? C.green : C.red }]}>
                <Text style={[s.winTitleTxt, { color: resposta === questao.correta ? C.green2 : C.red2 }]}>
                  {resposta === questao.correta ? '✔ CORRETO!' : '✘ INCORRETO'}
                </Text>
              </View>
              <View style={s.feedbackBody}>
                <Text style={s.feedbackTxt}>{questao.explicacao}</Text>
              </View>
              <TouchableOpacity style={s.btnBlue} onPress={proxima} activeOpacity={0.8}>
                <Text style={s.btnBlueTxt}>
                  {indice + 1 >= questoes.length ? '▶ VER RESULTADO' : '▶ PROXIMA'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  container: { padding: PAD.screen, paddingTop: PAD.top, paddingBottom: 32, gap: 8 },

  win: { borderWidth: 1, borderColor: C.border, backgroundColor: C.panel },
  winInner: { borderWidth: 1, borderColor: C.border2, margin: 2 },
  winTitle: {
    backgroundColor: C.panel,
    borderBottomWidth: 1, borderBottomColor: C.border,
    paddingVertical: 8, paddingHorizontal: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  winTitleTxt: { fontFamily: F, fontSize: FS.title, color: C.blue2, letterSpacing: 1 },

  progTrack: { height: 6, backgroundColor: '#000', overflow: 'hidden' },
  progFill: { height: '100%', backgroundColor: C.blue },

  questaoBody: { padding: 16 },
  questaoTxt: { fontFamily: F, fontSize: FS.body, color: C.text, lineHeight: 22 },

  optRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: PAD.item, borderBottomWidth: 1,
  },
  optKey: {
    width: 28, height: 28, backgroundColor: '#000',
    borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  optKeyTxt: { fontFamily: F, fontSize: FS.small },
  optTxt: { fontFamily: F, fontSize: FS.small, color: C.text2, flex: 1, lineHeight: 18 },

  feedbackBody: { padding: 14 },
  feedbackTxt: { fontFamily: F, fontSize: FS.small, color: C.text2, lineHeight: 18 },

  btnBlue: {
    backgroundColor: C.blue,
    borderTopWidth: 2, borderLeftWidth: 2, borderBottomWidth: 2, borderRightWidth: 2,
    borderTopColor: C.blue2, borderLeftColor: C.blue2,
    borderBottomColor: '#112266', borderRightColor: '#112266',
    paddingVertical: 16, alignItems: 'center', margin: 10, marginBottom: 6,
  },
  btnBlueTxt: { fontFamily: F, fontSize: FS.body, color: '#000', letterSpacing: 1 },
  btnGhost: {
    paddingVertical: 12, alignItems: 'center',
    margin: 10, marginTop: 0,
    borderWidth: 1, borderColor: C.border2,
  },
  btnGhostTxt: { fontFamily: F, fontSize: FS.small, color: C.text3, letterSpacing: 1 },

  resultBody: { padding: 20, alignItems: 'center' },
  resultEmoji: { fontSize: 48, marginBottom: 14 },
  resultTitulo: { fontFamily: F, fontSize: FS.title, color: C.text, marginBottom: 8 },
  resultSub: { fontFamily: F, fontSize: FS.small, color: C.text3 },
  resultCtx: {
    marginTop: 12, backgroundColor: '#000',
    borderWidth: 1, borderColor: C.border,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  resultCtxTxt: {
    fontFamily: F, fontSize: FS.tiny,
    color: C.blue2, textAlign: 'center', letterSpacing: 1,
  },
  feedbackXP: {
    marginTop: 10, backgroundColor: '#000',
    borderWidth: 1, borderColor: C.blue,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  feedbackXPTxt: {
    fontFamily: F, fontSize: FS.small,
    color: C.blue2, textAlign: 'center', letterSpacing: 1,
  },

  statRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 14, borderBottomWidth: 1, borderBottomColor: C.border2,
  },
  statLbl: { fontFamily: F, fontSize: FS.small, color: C.text2 },
  statVal: { fontFamily: F, fontSize: FS.sub },
})