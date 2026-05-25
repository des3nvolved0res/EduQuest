import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native'
import { useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'

const questoesPorTopico: Record<string, { pergunta: string; alternativas: string[]; correta: number; explicacao: string }[]> = {
  trigonometria: [
    {
      pergunta: 'Em um triângulo retângulo, o seno de um ângulo é igual a:',
      alternativas: ['Cateto adjacente / Hipotenusa', 'Cateto oposto / Hipotenusa', 'Cateto oposto / Cateto adjacente', 'Hipotenusa / Cateto oposto'],
      correta: 1,
      explicacao: 'Seno = cateto oposto / hipotenusa. Lembre: SOH (Seno = Oposto / Hipotenusa).',
    },
    {
      pergunta: 'O cosseno de 60° é igual a:',
      alternativas: ['√3/2', '1/2', '√2/2', '1'],
      correta: 1,
      explicacao: 'cos(60°) = 1/2. Os valores especiais (30°, 45°, 60°) são muito cobrados em provas.',
    },
    {
      pergunta: 'A tangente é definida como:',
      alternativas: ['Seno × Cosseno', 'Cosseno / Seno', 'Seno / Cosseno', 'Hipotenusa / Cateto'],
      correta: 2,
      explicacao: 'Tangente = Seno / Cosseno = Cateto oposto / Cateto adjacente.',
    },
    {
      pergunta: 'Em um triângulo retângulo com hipotenusa 10 e cateto oposto 6, o seno do ângulo é:',
      alternativas: ['0,8', '0,6', '0,75', '0,5'],
      correta: 1,
      explicacao: 'Seno = cateto oposto / hipotenusa = 6/10 = 0,6.',
    },
    {
      pergunta: 'Qual é o valor do seno de 90°?',
      alternativas: ['0', '√2/2', '1/2', '1'],
      correta: 3,
      explicacao: 'sen(90°) = 1. É o valor máximo do seno, que varia entre -1 e 1.',
    },
  ],
  funcoes: [
    {
      pergunta: 'Qual é o gráfico de uma função do 1º grau?',
      alternativas: ['Parábola', 'Hipérbole', 'Reta', 'Circunferência'],
      correta: 2,
      explicacao: 'A função do 1º grau f(x) = ax + b sempre forma uma reta no plano cartesiano.',
    },
    {
      pergunta: 'Na função f(x) = 2x + 3, qual é o valor de f(4)?',
      alternativas: ['8', '10', '11', '14'],
      correta: 2,
      explicacao: 'f(4) = 2×4 + 3 = 8 + 3 = 11.',
    },
    {
      pergunta: 'Uma parábola abre para baixo quando:',
      alternativas: ['a = 0', 'a > 0', 'a < 0', 'b < 0'],
      correta: 2,
      explicacao: 'Na função f(x) = ax² + bx + c, se a < 0 a parábola abre para baixo.',
    },
    {
      pergunta: 'Qual é a raiz da função f(x) = 3x - 9?',
      alternativas: ['x = 9', 'x = 3', 'x = -3', 'x = 27'],
      correta: 1,
      explicacao: 'Raiz é quando f(x) = 0. Logo: 3x - 9 = 0 → 3x = 9 → x = 3.',
    },
    {
      pergunta: 'O coeficiente angular da função f(x) = 5x + 2 é:',
      alternativas: ['2', '7', '5', '10'],
      correta: 2,
      explicacao: 'Na função f(x) = ax + b, o coeficiente angular é "a". Neste caso, a = 5.',
    },
  ],
  celula: [
    {
      pergunta: 'Qual organela é responsável pela produção de energia (ATP) na célula?',
      alternativas: ['Ribossomo', 'Núcleo', 'Mitocôndria', 'Vacúolo'],
      correta: 2,
      explicacao: 'A mitocôndria é a "usina de energia" da célula, responsável pela respiração celular e produção de ATP.',
    },
    {
      pergunta: 'As células procariontes se diferenciam das eucariontes por:',
      alternativas: ['Terem membrana plasmática', 'Não possuírem núcleo definido', 'Realizarem fotossíntese', 'Terem mitocôndrias'],
      correta: 1,
      explicacao: 'Células procariontes (como bactérias) não possuem núcleo delimitado por membrana.',
    },
    {
      pergunta: 'Qual estrutura está presente em células vegetais mas ausente em células animais?',
      alternativas: ['Membrana plasmática', 'Ribossomo', 'Mitocôndria', 'Parede celular'],
      correta: 3,
      explicacao: 'A parede celular (feita de celulose) e os cloroplastos são exclusivos das células vegetais.',
    },
    {
      pergunta: 'Os ribossomos são responsáveis por:',
      alternativas: ['Digestão intracelular', 'Síntese de proteínas', 'Produção de energia', 'Divisão celular'],
      correta: 1,
      explicacao: 'Os ribossomos são as organelas responsáveis pela síntese (produção) de proteínas.',
    },
    {
      pergunta: 'A membrana plasmática é composta principalmente por:',
      alternativas: ['Proteínas e carboidratos', 'Lipídios e proteínas', 'DNA e RNA', 'Celulose e amido'],
      correta: 1,
      explicacao: 'A membrana plasmática é formada por uma bicamada fosfolipídica com proteínas inseridas.',
    },
  ],
  mecanica: [
    {
      pergunta: 'A fórmula da 2ª Lei de Newton é:',
      alternativas: ['F = m/a', 'F = m + a', 'F = m × a', 'F = a/m'],
      correta: 2,
      explicacao: 'F = m × a. Força é igual à massa multiplicada pela aceleração.',
    },
    {
      pergunta: 'Um carro percorre 120 km em 2 horas. Qual é sua velocidade média?',
      alternativas: ['240 km/h', '60 km/h', '80 km/h', '100 km/h'],
      correta: 1,
      explicacao: 'Velocidade média = distância/tempo = 120/2 = 60 km/h.',
    },
    {
      pergunta: 'A 1ª Lei de Newton é conhecida como:',
      alternativas: ['Lei da Ação e Reação', 'Lei da Gravitação', 'Lei da Inércia', 'Lei da Conservação'],
      correta: 2,
      explicacao: 'A 1ª Lei (Inércia) diz que um corpo em repouso tende a permanecer em repouso, e um em movimento tende a continuar em movimento.',
    },
    {
      pergunta: 'Se uma força de 20N é aplicada em um objeto de 4kg, qual é a aceleração?',
      alternativas: ['80 m/s²', '16 m/s²', '24 m/s²', '5 m/s²'],
      correta: 3,
      explicacao: 'Pela 2ª Lei: a = F/m = 20/4 = 5 m/s².',
    },
    {
      pergunta: 'A 3ª Lei de Newton afirma que:',
      alternativas: ['F = ma', 'Todo corpo tende à inércia', 'Toda ação tem reação igual e oposta', 'Energia não se cria nem se destrói'],
      correta: 2,
      explicacao: 'A 3ª Lei (Ação e Reação) diz que para toda ação há uma reação de mesma intensidade e direção oposta.',
    },
  ],
}

const questoesPadrao = [
  {
    pergunta: 'Este tópico está sendo preparado. Qual é a melhor forma de estudar?',
    alternativas: ['Decorar sem entender', 'Estudar com exemplos práticos', 'Estudar só na véspera', 'Não estudar'],
    correta: 1,
    explicacao: 'Estudar com exemplos práticos e conexões com o cotidiano melhora muito a retenção do conteúdo.',
  },
]

const XP_POR_QUESTAO = 10

export default function QuestScreen() {
  const router = useRouter()
  const { portal, materia, topico } = useLocalSearchParams<{
    portal: string
    materia: string
    topico: string
  }>()

  const questoes = questoesPorTopico[topico] ?? questoesPadrao

  const [indice, setIndice] = useState(0)
  const [respostaSelecionada, setRespostaSelecionada] = useState<number | null>(null)
  const [acertos, setAcertos] = useState(0)
  const [finalizado, setFinalizado] = useState(false)
  const [salvando, setSalvando] = useState(false)

  const questaoAtual = questoes[indice]
  const xpGanho = acertos * XP_POR_QUESTAO

  function responder(i: number) {
    if (respostaSelecionada !== null) return
    setRespostaSelecionada(i)
    if (i === questaoAtual.correta) {
      setAcertos(a => a + 1)
    }
  }

  function proxima() {
    if (indice + 1 >= questoes.length) {
      setFinalizado(true)
      salvarXP()
    } else {
      setIndice(i => i + 1)
      setRespostaSelecionada(null)
    }
  }

  async function salvarXP() {
    if (!auth.currentUser) return
    setSalvando(true)
    try {
      const uid = auth.currentUser.uid
      const campo = portal === 'ciclos' ? 'pontosTemporarios' : 'pontosPermanentes'
      await updateDoc(doc(db, 'usuarios', uid), {
        [campo]: increment(xpGanho),
      })
    } catch (e) {
      console.log('Erro ao salvar XP:', e)
    }
    setSalvando(false)
  }

  function corBotao(i: number) {
    if (respostaSelecionada === null) return '#16213E'
    if (i === questaoAtual.correta) return '#1a4a2e'
    if (i === respostaSelecionada) return '#4a1a1a'
    return '#16213E'
  }

  function bordaBotao(i: number) {
    if (respostaSelecionada === null) return '#333'
    if (i === questaoAtual.correta) return '#27AE60'
    if (i === respostaSelecionada) return '#E74C3C'
    return '#333'
  }

  if (finalizado) {
    const percentual = Math.round((acertos / questoes.length) * 100)
    return (
      <ScrollView style={s.scroll} contentContainerStyle={s.container}>
        <Text style={s.resultadoEmoji}>
          {percentual >= 80 ? '🏆' : percentual >= 50 ? '⭐' : '💪'}
        </Text>
        <Text style={s.resultadoTitulo}>Quest concluída!</Text>
        <Text style={s.resultadoSub}>
          {percentual >= 80 ? 'Excelente desempenho!' : percentual >= 50 ? 'Bom trabalho!' : 'Continue praticando!'}
        </Text>

        <View style={s.resultadoCard}>
          <View style={s.resultadoLinha}>
            <Text style={s.resultadoLabel}>Acertos</Text>
            <Text style={s.resultadoValor}>{acertos}/{questoes.length}</Text>
          </View>
          <View style={s.resultadoLinha}>
            <Text style={s.resultadoLabel}>Aproveitamento</Text>
            <Text style={s.resultadoValor}>{percentual}%</Text>
          </View>
          <View style={[s.resultadoLinha, { borderBottomWidth: 0 }]}>
            <Text style={s.resultadoLabel}>XP conquistado</Text>
            <Text style={[s.resultadoValor, { color: '#4A90E2' }]}>+{xpGanho} XP</Text>
          </View>
        </View>

        <TouchableOpacity
          style={s.btnVoltar}
          onPress={() => router.replace('/(aluno)')}
        >
          <Text style={s.txtBtnVoltar}>
            {salvando ? 'Salvando...' : '→ Voltar ao Hub'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.btnRepetir}
          onPress={() => {
            setIndice(0)
            setAcertos(0)
            setRespostaSelecionada(null)
            setFinalizado(false)
          }}
        >
          <Text style={s.txtBtnRepetir}>↺ Repetir quest</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.container}>
      <View style={s.header}>
        <Text style={s.progresso}>Questão {indice + 1} de {questoes.length}</Text>
        <Text style={s.xp}>⚡ {acertos * XP_POR_QUESTAO} XP</Text>
      </View>

      <View style={s.barraContainer}>
        <View style={[s.barra, { width: `${((indice) / questoes.length) * 100}%` }]} />
      </View>

      <Text style={s.pergunta}>{questaoAtual.pergunta}</Text>

      {questaoAtual.alternativas.map((alt, i) => (
        <TouchableOpacity
          key={i}
          style={[s.alternativa, { backgroundColor: corBotao(i), borderColor: bordaBotao(i) }]}
          onPress={() => responder(i)}
        >
          <View style={s.letraContainer}>
            <Text style={s.letra}>{['A', 'B', 'C', 'D'][i]}</Text>
          </View>
          <Text style={s.textoAlternativa}>{alt}</Text>
        </TouchableOpacity>
      ))}

      {respostaSelecionada !== null && (
        <View style={[s.feedback, {
          backgroundColor: respostaSelecionada === questaoAtual.correta ? '#1a4a2e' : '#4a1a1a',
          borderColor: respostaSelecionada === questaoAtual.correta ? '#27AE60' : '#E74C3C',
        }]}>
          <Text style={s.feedbackTitulo}>
            {respostaSelecionada === questaoAtual.correta ? '✓ Correto!' : '✗ Incorreto'}
          </Text>
          <Text style={s.feedbackTexto}>{questaoAtual.explicacao}</Text>

          <TouchableOpacity style={s.btnProxima} onPress={proxima}>
            <Text style={s.txtProxima}>
              {indice + 1 >= questoes.length ? 'Ver resultado →' : 'Próxima →'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  )
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#1A1A2E' },
  container: { padding: 24, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  progresso: { color: '#888', fontSize: 14 },
  xp: { color: '#4A90E2', fontSize: 14, fontWeight: 'bold' },
  barraContainer: { height: 4, backgroundColor: '#333', borderRadius: 2, marginBottom: 32 },
  barra: { height: 4, backgroundColor: '#4A90E2', borderRadius: 2 },
  pergunta: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 24, lineHeight: 30 },
  alternativa: {
    borderRadius: 12, padding: 16, marginBottom: 12,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1,
  },
  letraContainer: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#0F3460', justifyContent: 'center',
    alignItems: 'center', marginRight: 12,
  },
  letra: { color: '#4A90E2', fontSize: 14, fontWeight: 'bold' },
  textoAlternativa: { color: '#fff', fontSize: 15, flex: 1 },
  feedback: {
    borderRadius: 16, padding: 20, marginTop: 8,
    borderWidth: 1,
  },
  feedbackTitulo: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  feedbackTexto: { color: '#ccc', fontSize: 14, lineHeight: 22, marginBottom: 16 },
  btnProxima: { backgroundColor: '#4A90E2', padding: 14, borderRadius: 12, alignItems: 'center' },
  txtProxima: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  resultadoEmoji: { fontSize: 64, textAlign: 'center', marginBottom: 16 },
  resultadoTitulo: { color: '#fff', fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  resultadoSub: { color: '#888', fontSize: 16, textAlign: 'center', marginBottom: 32 },
  resultadoCard: {
    backgroundColor: '#16213E', borderRadius: 16,
    padding: 20, marginBottom: 24,
    borderWidth: 1, borderColor: '#333',
  },
  resultadoLinha: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#333',
  },
  resultadoLabel: { color: '#888', fontSize: 15 },
  resultadoValor: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  btnVoltar: {
    backgroundColor: '#4A90E2', padding: 18,
    borderRadius: 16, alignItems: 'center', marginBottom: 12,
  },
  txtBtnVoltar: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  btnRepetir: { padding: 16, alignItems: 'center' },
  txtBtnRepetir: { color: '#888', fontSize: 15 },
})