import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'

const topicosPorMateria: Record<string, { id: string; titulo: string; descricao: string }[]> = {
  matematica: [
    { id: 'trigonometria', titulo: 'Trigonometria', descricao: 'Seno, cosseno e tangente' },
    { id: 'funcoes', titulo: 'Funções', descricao: 'Funções do 1º e 2º grau' },
    { id: 'geometria', titulo: 'Geometria', descricao: 'Áreas e volumes' },
    { id: 'estatistica', titulo: 'Estatística', descricao: 'Média, moda e mediana' },
    { id: 'probabilidade', titulo: 'Probabilidade', descricao: 'Eventos e combinações' },
  ],
  portugues: [
    { id: 'interpretacao', titulo: 'Interpretação de texto', descricao: 'Leitura e análise' },
    { id: 'gramatica', titulo: 'Gramática', descricao: 'Classes e funções' },
    { id: 'redacao', titulo: 'Redação', descricao: 'Dissertação e argumentação' },
    { id: 'literatura', titulo: 'Literatura', descricao: 'Movimentos literários' },
  ],
  biologia: [
    { id: 'celula', titulo: 'Célula', descricao: 'Estrutura e funções celulares' },
    { id: 'genetica', titulo: 'Genética', descricao: 'Hereditariedade e DNA' },
    { id: 'ecologia', titulo: 'Ecologia', descricao: 'Ecossistemas e cadeias' },
    { id: 'evolucao', titulo: 'Evolução', descricao: 'Darwin e seleção natural' },
  ],
  historia: [
    { id: 'brasil-colonial', titulo: 'Brasil Colonial', descricao: 'Colonização e resistência' },
    { id: 'revolucoes', titulo: 'Revoluções', descricao: 'Francesa, Industrial e Russa' },
    { id: 'guerra-mundial', titulo: 'Guerras Mundiais', descricao: 'I e II Guerra Mundial' },
    { id: 'brasil-republica', titulo: 'Brasil República', descricao: 'Da proclamação ao presente' },
  ],
  geografia: [
    { id: 'climatologia', titulo: 'Climatologia', descricao: 'Climas e fenômenos' },
    { id: 'geopolitica', titulo: 'Geopolítica', descricao: 'Relações entre países' },
    { id: 'urbanizacao', titulo: 'Urbanização', descricao: 'Cidades e crescimento' },
    { id: 'relevo', titulo: 'Relevo', descricao: 'Formações e processos' },
  ],
  fisica: [
    { id: 'mecanica', titulo: 'Mecânica', descricao: 'Movimento e forças' },
    { id: 'termodinamica', titulo: 'Termodinâmica', descricao: 'Calor e temperatura' },
    { id: 'optica', titulo: 'Óptica', descricao: 'Luz e reflexão' },
    { id: 'eletricidade', titulo: 'Eletricidade', descricao: 'Circuitos e corrente' },
  ],
  quimica: [
    { id: 'atomistica', titulo: 'Atomística', descricao: 'Estrutura do átomo' },
    { id: 'ligacoes', titulo: 'Ligações Químicas', descricao: 'Iônica, covalente e metálica' },
    { id: 'reacoes', titulo: 'Reações', descricao: 'Tipos e balanceamento' },
    { id: 'solucoes', titulo: 'Soluções', descricao: 'Concentração e misturas' },
  ],
  ingles: [
    { id: 'gramatica-en', titulo: 'Grammar', descricao: 'Tenses and structures' },
    { id: 'vocabulary', titulo: 'Vocabulary', descricao: 'Words and expressions' },
    { id: 'reading', titulo: 'Reading', descricao: 'Text comprehension' },
    { id: 'writing', titulo: 'Writing', descricao: 'Essays and composition' },
  ],
}

const nomesMateria: Record<string, string> = {
  matematica: '📐 Matemática',
  portugues: '📝 Português',
  biologia: '🧬 Biologia',
  historia: '📜 História',
  geografia: '🌍 Geografia',
  fisica: '⚡ Física',
  quimica: '🧪 Química',
  ingles: '🌐 Inglês',
}

export default function TopicosScreen() {
  const router = useRouter()
  const { portal, materia } = useLocalSearchParams<{ portal: string; materia: string }>()
  const topicos = topicosPorMateria[materia] ?? []

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.container}>
      <TouchableOpacity onPress={() => router.back()} style={s.btnVoltar}>
        <Text style={s.txtVoltar}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={s.materiaNome}>{nomesMateria[materia] ?? materia}</Text>
      <Text style={s.titulo}>Escolha o tópico</Text>

      {topicos.map((topico, index) => (
        <TouchableOpacity
          key={topico.id}
          style={s.card}
          onPress={() => router.push(`/pilulas?portal=${portal}&materia=${materia}&topico=${topico.id}`)}
        >
          <View style={s.numero}>
            <Text style={s.numeroTexto}>{index + 1}</Text>
          </View>
          <View style={s.cardTexto}>
            <Text style={s.cardTitulo}>{topico.titulo}</Text>
            <Text style={s.cardDescricao}>{topico.descricao}</Text>
          </View>
          <Text style={s.seta}>→</Text>
        </TouchableOpacity>
      ))}
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
  materiaNome: {
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
  numero: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0F3460',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  numeroTexto: {
    color: '#4A90E2',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cardTexto: {
    flex: 1,
  },
  cardTitulo: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDescricao: {
    color: '#888',
    fontSize: 13,
  },
  seta: {
    color: '#4A90E2',
    fontSize: 20,
  },
})