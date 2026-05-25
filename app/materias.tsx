import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'

const materias = [
  { id: 'matematica', titulo: 'Matemática', emoji: '📐', cor: '#4A90E2' },
  { id: 'portugues', titulo: 'Português', emoji: '📝', cor: '#E74C3C' },
  { id: 'biologia', titulo: 'Biologia', emoji: '🧬', cor: '#27AE60' },
  { id: 'historia', titulo: 'História', emoji: '📜', cor: '#E67E22' },
  { id: 'geografia', titulo: 'Geografia', emoji: '🌍', cor: '#1ABC9C' },
  { id: 'fisica', titulo: 'Física', emoji: '⚡', cor: '#9B59B6' },
  { id: 'quimica', titulo: 'Química', emoji: '🧪', cor: '#E91E63' },
  { id: 'ingles', titulo: 'Inglês', emoji: '🌐', cor: '#FF9800' },
]

const nomePortal: Record<string, string> = {
  reliquias: '💎 Portal das Relíquias',
  ciclos: '⏳ Portal dos Ciclos',
  mural: '📜 Mural do Mestre',
}

function calcularDiasRestantes() {
  const agora = new Date()
  const fimDoMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0)
  const diff = fimDoMes.getTime() - agora.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export default function MateriasScreen() {
  const router = useRouter()
  const { portal } = useLocalSearchParams<{ portal: string }>()
  const [diasRestantes, setDiasRestantes] = useState(calcularDiasRestantes())

  useEffect(() => {
    const intervalo = setInterval(() => {
      setDiasRestantes(calcularDiasRestantes())
    }, 60000)
    return () => clearInterval(intervalo)
  }, [])

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.container}>
      <TouchableOpacity onPress={() => router.back()} style={s.btnVoltar}>
        <Text style={s.txtVoltar}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={s.portalNome}>{nomePortal[portal] ?? 'Portal'}</Text>
      <Text style={s.titulo}>Escolha a matéria</Text>

      {portal === 'ciclos' && (
        <View style={s.contador}>
          <Text style={s.contadorEmoji}>⏳</Text>
          <View>
            <Text style={s.contadorTitulo}>
              {diasRestantes === 1
                ? 'Falta 1 dia para o fim do ciclo!'
                : `Faltam ${diasRestantes} dias para o fim do ciclo`}
            </Text>
            <Text style={s.contadorSub}>
              Os pontos temporários expiram no final do mês
            </Text>
          </View>
        </View>
      )}

      <View style={s.grade}>
        {materias.map((materia) => (
          <TouchableOpacity
            key={materia.id}
            style={[s.card, { borderTopColor: materia.cor }]}
            onPress={() => router.push(`/topicos?portal=${portal}&materia=${materia.id}`)}
          >
            <Text style={s.emoji}>{materia.emoji}</Text>
            <Text style={s.cardTitulo}>{materia.titulo}</Text>
            {portal === 'ciclos' && (
              <View style={[s.xpBadge, { backgroundColor: '#2d1a00' }]}>
                <Text style={[s.xpTexto, { color: '#E67E22' }]}>⚡ Bônus</Text>
              </View>
            )}
            {portal !== 'ciclos' && (
              <View style={s.xpBadge}>
                <Text style={s.xpTexto}>0 XP</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#1A1A2E' },
  container: { padding: 24, paddingTop: 60 },
  btnVoltar: { marginBottom: 24 },
  txtVoltar: { color: '#4A90E2', fontSize: 16 },
  portalNome: {
    color: '#888', fontSize: 13, marginBottom: 8,
    textTransform: 'uppercase', letterSpacing: 1,
  },
  titulo: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  contador: {
    backgroundColor: '#2d1a00', borderRadius: 16, padding: 16,
    marginBottom: 24, flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#E67E22', gap: 12,
  },
  contadorEmoji: { fontSize: 28 },
  contadorTitulo: { color: '#E67E22', fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  contadorSub: { color: '#888', fontSize: 13 },
  grade: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 16, justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#16213E', borderRadius: 16, padding: 20,
    width: '47%', alignItems: 'center', borderWidth: 1,
    borderColor: '#333', borderTopWidth: 4,
  },
  emoji: { fontSize: 36, marginBottom: 10 },
  cardTitulo: {
    color: '#fff', fontSize: 15, fontWeight: 'bold',
    textAlign: 'center', marginBottom: 10,
  },
  xpBadge: {
    backgroundColor: '#0F3460', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  xpTexto: { color: '#4A90E2', fontSize: 12, fontWeight: 'bold' },
})