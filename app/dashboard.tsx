import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/config/firebase'

type Aluno = {
  id: string
  nome: string
  pontosPermanentes: number
  pontosTemporarios: number
  nivel: number
  perfil: string
}

export default function DashboardScreen() {
  const router = useRouter()
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [carregando, setCarregando] = useState(true)
  const [totalVouchers, setTotalVouchers] = useState(0)
  const [vouchersValidados, setVouchersValidados] = useState(0)

  useEffect(() => {
    async function carregar() {
      try {
        const snapUsuarios = await getDocs(collection(db, 'usuarios'))
        const lista: Aluno[] = []
        snapUsuarios.forEach((doc) => {
          const dados = doc.data()
          if (dados.perfil === 'aluno') {
            lista.push({ id: doc.id, ...dados } as Aluno)
          }
        })
        lista.sort((a, b) => b.pontosPermanentes - a.pontosPermanentes)
        setAlunos(lista)

        const snapVouchers = await getDocs(collection(db, 'vouchers'))
        setTotalVouchers(snapVouchers.size)
        setVouchersValidados(
          snapVouchers.docs.filter(d => d.data().validado).length
        )
      } catch (e) {
        console.log('Erro ao carregar dashboard:', e)
      }
      setCarregando(false)
    }
    carregar()
  }, [])

  const totalXP = alunos.reduce((acc, a) => acc + a.pontosPermanentes, 0)
  const mediaXP = alunos.length > 0 ? Math.round(totalXP / alunos.length) : 0

  function medalha(index: number) {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `${index + 1}º`
  }

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.container}>
      <TouchableOpacity onPress={() => router.back()} style={s.btnVoltar}>
        <Text style={s.txtVoltar}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={s.titulo}>Dashboard da turma</Text>

      <View style={s.statsRow}>
        <View style={s.statCard}>
          <Text style={s.statEmoji}>👥</Text>
          <Text style={s.statValor}>{alunos.length}</Text>
          <Text style={s.statLabel}>Alunos</Text>
        </View>
        <View style={s.statCard}>
          <Text style={s.statEmoji}>⚡</Text>
          <Text style={s.statValor}>{mediaXP}</Text>
          <Text style={s.statLabel}>XP médio</Text>
        </View>
        <View style={s.statCard}>
          <Text style={s.statEmoji}>🎟️</Text>
          <Text style={s.statValor}>{vouchersValidados}/{totalVouchers}</Text>
          <Text style={s.statLabel}>Vouchers</Text>
        </View>
      </View>

      <Text style={s.secao}>Ranking de alunos</Text>

      {carregando ? (
        <Text style={s.carregando}>Carregando...</Text>
      ) : alunos.length === 0 ? (
        <View style={s.vazio}>
          <Text style={s.vazioEmoji}>📭</Text>
          <Text style={s.vazioTxt}>Nenhum aluno cadastrado ainda</Text>
        </View>
      ) : (
        alunos.map((aluno, index) => (
          <View key={aluno.id} style={[s.alunoCard, index === 0 && s.alunoDestaque]}>
            <Text style={s.medalha}>{medalha(index)}</Text>
            <View style={s.alunoInfo}>
              <Text style={s.alunoNome}>{aluno.nome}</Text>
              <View style={s.alunoXpRow}>
                <Text style={s.alunoXp}>💎 {aluno.pontosPermanentes} cristais</Text>
                <Text style={s.alunoXp}>⚡ {aluno.pontosTemporarios} bônus</Text>
              </View>
            </View>
            <View style={s.nivelBadge}>
              <Text style={s.nivelTxt}>Nv.{aluno.nivel}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  )
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#1A1A2E' },
  container: { padding: 24, paddingTop: 60 },
  btnVoltar: { marginBottom: 24 },
  txtVoltar: { color: '#4A90E2', fontSize: 16 },
  titulo: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  statCard: {
    flex: 1, backgroundColor: '#16213E', borderRadius: 16,
    padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#333',
  },
  statEmoji: { fontSize: 24, marginBottom: 6 },
  statValor: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: '#888', fontSize: 12, marginTop: 2 },
  secao: {
    color: '#888', fontSize: 13, marginBottom: 16,
    textTransform: 'uppercase', letterSpacing: 1,
  },
  carregando: { color: '#888', textAlign: 'center', marginTop: 32 },
  vazio: { alignItems: 'center', marginTop: 48 },
  vazioEmoji: { fontSize: 48, marginBottom: 16 },
  vazioTxt: { color: '#888', fontSize: 16 },
  alunoCard: {
    backgroundColor: '#16213E', borderRadius: 16, padding: 16,
    marginBottom: 12, flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#333',
  },
  alunoDestaque: { borderColor: '#F1C40F' },
  medalha: { fontSize: 24, marginRight: 16, width: 36, textAlign: 'center' },
  alunoInfo: { flex: 1 },
  alunoNome: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  alunoXpRow: { flexDirection: 'row', gap: 12 },
  alunoXp: { color: '#888', fontSize: 12 },
  nivelBadge: {
    backgroundColor: '#0F3460', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  nivelTxt: { color: '#4A90E2', fontSize: 13, fontWeight: 'bold' },
})