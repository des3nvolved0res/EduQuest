import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { C, F, FS, PAD } from '@/constants/theme'

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
      { icone: '📊', texto: 'Funcao do 1 grau: f(x) = ax + b' },
      { icone: '📊', texto: 'Funcao do 2 grau: f(x) = ax2 + bx + c' },
      { icone: '💡', texto: 'Grafico do 1 grau e uma reta' },
      { icone: '💡', texto: 'Grafico do 2 grau e uma parabola' },
      { icone: '⚠️', texto: 'Se a > 0 a parabola abre para cima' },
    ],
  },
  celula: {
    titulo: 'CELULA',
    pilulas: [
      { icone: '🔬', texto: 'Procariontes nao tem nucleo definido' },
      { icone: '🔬', texto: 'Eucariontes tem nucleo com membrana' },
      { icone: '💡', texto: 'Mitocondria = usina de energia (ATP)' },
      { icone: '💡', texto: 'Ribossomos = producao de proteinas' },
      { icone: '⚠️', texto: 'So celulas vegetais tem parede celular' },
    ],
  },
  mecanica: {
    titulo: 'MECANICA',
    pilulas: [
      { icone: '⚡', texto: 'Velocidade media = distancia / tempo' },
      { icone: '⚡', texto: 'Aceleracao = variacao velocidade / tempo' },
      { icone: '💡', texto: '1a Lei: corpo em repouso fica em repouso' },
      { icone: '💡', texto: '2a Lei: F = m x a' },
      { icone: '⚠️', texto: '3a Lei: acao e reacao opostas' },
    ],
  },
}

const conteudoPadrao = {
  titulo: 'PILULAS DE CONHECIMENTO',
  pilulas: [
    { icone: '📚', texto: 'Revise o conteudo do seu caderno' },
    { icone: '💡', texto: 'Leia com atencao antes de responder' },
    { icone: '⚠️', texto: 'Se errar, leia a explicacao antes' },
  ],
}

export default function PilulasScreen() {
  const router = useRouter()
  const { portal, materia, topico } = useLocalSearchParams<{
    portal: string; materia: string; topico: string
  }>()
  const dados = conteudo[topico] ?? conteudoPadrao

  function irParaQuest() {
    router.push(`/quest?portal=${portal}&materia=${materia}&topico=${topico}`)
  }

  return (
    <View style={s.root}>
      <ScrollView style={s.scroll} contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>

        <View style={s.win}>
          <View style={s.winInner}>
            <View style={s.winTitle}>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={s.backTxt}>◀ VOLTAR</Text>
              </TouchableOpacity>
              <Text style={s.winTitleTxt}>{dados.titulo}</Text>
            </View>
            <View style={s.titleBody}>
              <Text style={s.titleSub}>REVISE ANTES DO DESAFIO</Text>
            </View>
          </View>
        </View>

        <View style={s.win}>
          <View style={s.winInner}>
            <View style={s.winTitle}>
              <Text style={s.winTitleTxt}>BASE DE DADOS</Text>
              <Text style={s.winTitleSub}>{dados.pilulas.length} ENTRADAS</Text>
            </View>
            {dados.pilulas.map((p, i) => (
              <View key={i} style={s.pilulaRow}>
                <Text style={s.pilulaIcon}>{p.icone}</Text>
                <View style={s.pilulaBody}>
                  <Text style={s.pilulaNum}>#{String(i + 1).padStart(2, '0')}</Text>
                  <Text style={s.pilulaTxt}>{p.texto}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={s.win}>
          <View style={s.winInner}>
            <TouchableOpacity style={s.btnBlue} onPress={irParaQuest} activeOpacity={0.8}>
              <Text style={s.btnBlueTxt}>▶ INICIAR QUEST</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.btnGhost} onPress={irParaQuest} activeOpacity={0.8}>
              <Text style={s.btnGhostTxt}>JA SEI O CONTEUDO: PULAR</Text>
            </TouchableOpacity>
          </View>
        </View>

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
  winTitleSub: { fontFamily: F, fontSize: FS.small, color: C.text3 },
  backTxt: { fontFamily: F, fontSize: FS.small, color: C.text3 },

  titleBody: { padding: PAD.win },
  titleSub: { fontFamily: F, fontSize: FS.small, color: C.text3 },

  pilulaRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    padding: PAD.item,
    borderBottomWidth: 1, borderBottomColor: C.border2,
  },
  pilulaIcon: { fontSize: 20, width: 26, textAlign: 'center', marginTop: 2 },
  pilulaBody: { flex: 1 },
  pilulaNum: { fontFamily: F, fontSize: FS.tiny, color: C.text3, marginBottom: 5 },
  pilulaTxt: { fontFamily: F, fontSize: FS.body, color: C.text, lineHeight: 20 },

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
})