import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { doc, updateDoc, increment } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'
import { C, F, FS, PAD } from '@/constants/theme'

const questoesPorTopico: Record<string, {
  pergunta: string
  alternativas: string[]
  correta: number
  explicacao: string
}[]> = {
  trigonometria: [
    { pergunta: 'Em um triangulo retangulo, o seno de um angulo e igual a:', alternativas: ['Cateto adjacente / Hipotenusa', 'Cateto oposto / Hipotenusa', 'Cateto oposto / Cateto adjacente', 'Hipotenusa / Cateto oposto'], correta: 1, explicacao: 'Seno = cateto oposto / hipotenusa. Lembre: SOH.' },
    { pergunta: 'O cosseno de 60 graus e igual a:', alternativas: ['Raiz(3)/2', '1/2', 'Raiz(2)/2', '1'], correta: 1, explicacao: 'cos(60) = 1/2. Valores especiais 30, 45 e 60 sao muito cobrados.' },
    { pergunta: 'A tangente e definida como:', alternativas: ['Seno x Cosseno', 'Cosseno / Seno', 'Seno / Cosseno', 'Hipotenusa / Cateto'], correta: 2, explicacao: 'Tangente = Seno / Cosseno = Cateto oposto / Cateto adjacente.' },
    { pergunta: 'Com hipotenusa 10 e cateto oposto 6, o seno e:', alternativas: ['0,8', '0,6', '0,75', '0,5'], correta: 1, explicacao: 'Seno = cateto oposto / hipotenusa = 6/10 = 0,6.' },
    { pergunta: 'Qual e o valor do seno de 90 graus?', alternativas: ['0', 'Raiz(2)/2', '1/2', '1'], correta: 3, explicacao: 'sen(90) = 1. E o valor maximo do seno.' },
  ],
  funcoes: [
    { pergunta: 'Qual e o grafico de uma funcao do 1 grau?', alternativas: ['Parabola', 'Hiperbole', 'Reta', 'Circunferencia'], correta: 2, explicacao: 'A funcao do 1 grau f(x) = ax + b sempre forma uma reta.' },
    { pergunta: 'Na funcao f(x) = 2x + 3, qual e f(4)?', alternativas: ['8', '10', '11', '14'], correta: 2, explicacao: 'f(4) = 2x4 + 3 = 8 + 3 = 11.' },
    { pergunta: 'Uma parabola abre para baixo quando:', alternativas: ['a = 0', 'a > 0', 'a < 0', 'b < 0'], correta: 2, explicacao: 'Na funcao f(x) = ax2 + bx + c, se a < 0 a parabola abre para baixo.' },
    { pergunta: 'Qual e a raiz da funcao f(x) = 3x - 9?', alternativas: ['x = 9', 'x = 3', 'x = -3', 'x = 27'], correta: 1, explicacao: '3x - 9 = 0 → 3x = 9 → x = 3.' },
    { pergunta: 'O coeficiente angular de f(x) = 5x + 2 e:', alternativas: ['2', '7', '5', '10'], correta: 2, explicacao: 'Na funcao f(x) = ax + b, o coeficiente angular e "a". Aqui a = 5.' },
  ],
  celula: [
    { pergunta: 'Qual organela produz energia (ATP) na celula?', alternativas: ['Ribossomo', 'Nucleo', 'Mitocondria', 'Vacuolo'], correta: 2, explicacao: 'A mitocondria e a usina de energia da celula.' },
    { pergunta: 'Celulas procariontes se diferenciam por:', alternativas: ['Terem membrana', 'Nao ter nucleo definido', 'Fazerem fotossintese', 'Terem mitocondrias'], correta: 1, explicacao: 'Celulas procariontes como bacterias nao tem nucleo delimitado.' },
    { pergunta: 'O que e exclusivo de celulas vegetais?', alternativas: ['Membrana plasmatica', 'Ribossomo', 'Mitocondria', 'Parede celular'], correta: 3, explicacao: 'A parede celular de celulose e exclusiva das celulas vegetais.' },
    { pergunta: 'Os ribossomos sao responsaveis por:', alternativas: ['Digestao intracelular', 'Sintese de proteinas', 'Producao de energia', 'Divisao celular'], correta: 1, explicacao: 'Os ribossomos produzem proteinas.' },
    { pergunta: 'A membrana plasmatica e composta por:', alternativas: ['Proteinas e carboidratos', 'Lipidios e proteinas', 'DNA e RNA', 'Celulose e amido'], correta: 1, explicacao: 'A membrana plasmatica e formada por bicamada fosfolipidica com proteinas.' },
  ],
  mecanica: [
    { pergunta: 'A formula da 2a Lei de Newton e:', alternativas: ['F = m/a', 'F = m + a', 'F = m x a', 'F = a/m'], correta: 2, explicacao: 'F = m x a. Forca = massa x aceleracao.' },
    { pergunta: 'Um carro percorre 120km em 2h. Velocidade media:', alternativas: ['240 km/h', '60 km/h', '80 km/h', '100 km/h'], correta: 1, explicacao: 'Velocidade media = distancia/tempo = 120/2 = 60 km/h.' },
    { pergunta: 'A 1a Lei de Newton e conhecida como:', alternativas: ['Lei da Acao e Reacao', 'Lei da Gravitacao', 'Lei da Inercia', 'Lei da Conservacao'], correta: 2, explicacao: 'A 1a Lei (Inercia): corpo em repouso tende a permanecer em repouso.' },
    { pergunta: 'Forca de 20N em objeto de 4kg. Aceleracao:', alternativas: ['80 m/s2', '16 m/s2', '24 m/s2', '5 m/s2'], correta: 3, explicacao: 'a = F/m = 20/4 = 5 m/s2.' },
    { pergunta: 'A 3a Lei de Newton afirma que:', alternativas: ['F = ma', 'Todo corpo tende a inercia', 'Toda acao tem reacao oposta', 'Energia nao se cria'], correta: 2, explicacao: 'A 3a Lei: para toda acao ha uma reacao de mesma intensidade e direcao oposta.' },
  ],
}

const questoesPadrao = [{
  pergunta: 'Qual e a melhor forma de estudar?',
  alternativas: ['Decorar sem entender', 'Estudar com exemplos praticos', 'Estudar so na vespera', 'Nao estudar'],
  correta: 1,
  explicacao: 'Estudar com exemplos praticos melhora muito a retencao do conteudo.',
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
      const campo = portal === 'ciclos' ? 'pontosTemporarios' : 'pontosPermanentes'
      await updateDoc(doc(db, 'usuarios', auth.currentUser.uid), {
        [campo]: increment(xpGanho),
      })
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
                <Text style={[s.statVal, { color: C.gold2 }]}>+{xpGanho} XP</Text>
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
                onPress={() => { setIndice(0); setAcertos(0); setResposta(null); setFinalizado(false) }}
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
    padding: PAD.item,
    borderBottomWidth: 1,
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
    borderTopWidth: 2, borderLeftWidth: 2,
    borderBottomWidth: 2, borderRightWidth: 2,
    borderTopColor: C.blue2, borderLeftColor: C.blue2,
    borderBottomColor: '#112266', borderRightColor: '#112266',
    paddingVertical: 16, alignItems: 'center',
    margin: 10, marginBottom: 6,
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

  statRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 14, borderBottomWidth: 1, borderBottomColor: C.border2,
  },
  statLbl: { fontFamily: F, fontSize: FS.small, color: C.text2 },
  statVal: { fontFamily: F, fontSize: FS.sub },
})