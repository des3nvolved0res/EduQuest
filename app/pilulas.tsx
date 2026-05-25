import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'

const conteudo: Record<string, { titulo: string; pilulas: { icone: string; texto: string }[] }> = {
  trigonometria: {
    titulo: 'Trigonometria',
    pilulas: [
      { icone: '📐', texto: 'Seno = cateto oposto / hipotenusa' },
      { icone: '📐', texto: 'Cosseno = cateto adjacente / hipotenusa' },
      { icone: '📐', texto: 'Tangente = cateto oposto / cateto adjacente' },
      { icone: '💡', texto: 'Memorize: SOH-CAH-TOA' },
      { icone: '⚠️', texto: 'Em um triângulo retângulo, a hipotenusa é sempre o maior lado' },
    ],
  },
  funcoes: {
    titulo: 'Funções',
    pilulas: [
      { icone: '📊', texto: 'Função do 1º grau: f(x) = ax + b, onde a ≠ 0' },
      { icone: '📊', texto: 'Função do 2º grau: f(x) = ax² + bx + c, onde a ≠ 0' },
      { icone: '💡', texto: 'O gráfico do 1º grau é uma reta' },
      { icone: '💡', texto: 'O gráfico do 2º grau é uma parábola' },
      { icone: '⚠️', texto: 'Se a > 0 a parábola abre para cima, se a < 0 abre para baixo' },
    ],
  },
  celula: {
    titulo: 'Célula',
    pilulas: [
      { icone: '🔬', texto: 'Células procariontes não têm núcleo definido (ex: bactérias)' },
      { icone: '🔬', texto: 'Células eucariontes têm núcleo com membrana (ex: animais e plantas)' },
      { icone: '💡', texto: 'Mitocôndria = usina de energia da célula (ATP)' },
      { icone: '💡', texto: 'Ribossomos = produção de proteínas' },
      { icone: '⚠️', texto: 'Apenas células vegetais têm parede celular e cloroplastos' },
    ],
  },
  genetica: {
    titulo: 'Genética',
    pilulas: [
      { icone: '🧬', texto: 'DNA = ácido desoxirribonucleico, carrega informação genética' },
      { icone: '🧬', texto: 'Gene = trecho do DNA que codifica uma característica' },
      { icone: '💡', texto: 'Dominante (D) se expressa mesmo com um alelo recessivo' },
      { icone: '💡', texto: 'Recessivo (r) só se expressa quando há dois alelos recessivos' },
      { icone: '⚠️', texto: 'Genótipo = composição genética. Fenótipo = característica visível' },
    ],
  },
  mecanica: {
    titulo: 'Mecânica',
    pilulas: [
      { icone: '⚡', texto: 'Velocidade média = distância / tempo (v = Δs/Δt)' },
      { icone: '⚡', texto: 'Aceleração = variação de velocidade / tempo (a = Δv/Δt)' },
      { icone: '💡', texto: '1ª Lei de Newton: todo corpo em repouso tende a continuar em repouso' },
      { icone: '💡', texto: '2ª Lei de Newton: F = m × a' },
      { icone: '⚠️', texto: '3ª Lei de Newton: ação e reação têm mesmo módulo e direções opostas' },
    ],
  },
}

const conteudoPadrao = {
  titulo: 'Pílulas de Conhecimento',
  pilulas: [
    { icone: '📚', texto: 'Revise o conteúdo do seu caderno sobre este tópico' },
    { icone: '💡', texto: 'Leia com atenção as questões antes de responder' },
    { icone: '⚠️', texto: 'Se errar, leia a explicação antes de continuar' },
  ],
}

export default function PilulasScreen() {
  const router = useRouter()
  const { portal, materia, topico } = useLocalSearchParams<{
    portal: string
    materia: string
    topico: string
  }>()

  const dados = conteudo[topico] ?? conteudoPadrao

  function irParaQuiz() {
    router.push(`/quest?portal=${portal}&materia=${materia}&topico=${topico}`)
  }

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.container}>
      <TouchableOpacity onPress={() => router.back()} style={s.btnVoltar}>
        <Text style={s.txtVoltar}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={s.label}>Pílulas de conhecimento</Text>
      <Text style={s.titulo}>{dados.titulo}</Text>
      <Text style={s.descricao}>Revise rapidamente antes do desafio</Text>

      {dados.pilulas.map((pilula, index) => (
        <View key={index} style={s.card}>
          <Text style={s.icone}>{pilula.icone}</Text>
          <Text style={s.texto}>{pilula.texto}</Text>
        </View>
      ))}

      <View style={s.acoes}>
        <TouchableOpacity style={s.btnQuiz} onPress={irParaQuiz}>
          <Text style={s.txtQuiz}>⚔️ Iniciar Quest</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.btnPular} onPress={irParaQuiz}>
          <Text style={s.txtPular}>Já sei o conteúdo → Pular</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  container: {
    padding: 24,
    paddingTop: 60,
  },
  btnVoltar: {
    marginBottom: 24,
  },
  txtVoltar: {
    color: '#4A90E2',
    fontSize: 16,
  },
  label: {
    color: '#888',
    fontSize: 13,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  titulo: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descricao: {
    color: '#888',
    fontSize: 15,
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#16213E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  icone: {
    fontSize: 24,
    marginRight: 16,
  },
  texto: {
    color: '#fff',
    fontSize: 15,
    flex: 1,
    lineHeight: 22,
  },
  acoes: {
    marginTop: 16,
    gap: 12,
  },
  btnQuiz: {
    backgroundColor: '#4A90E2',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  txtQuiz: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  btnPular: {
    padding: 16,
    alignItems: 'center',
  },
  txtPular: {
    color: '#888',
    fontSize: 15,
  },
})