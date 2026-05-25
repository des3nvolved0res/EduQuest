import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { signOut } from 'firebase/auth'
import { auth, db } from '@/config/firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'

const portais = [
  {
    id: 'reliquias',
    titulo: 'Portal das Relíquias',
    descricao: 'Atividades permanentes que valem o ano todo',
    emoji: '💎',
    cor: '#4A90E2',
  },
  {
    id: 'ciclos',
    titulo: 'Portal dos Ciclos',
    descricao: 'Desafios mensais com pontos por tempo limitado',
    emoji: '⏳',
    cor: '#E67E22',
  },
  {
    id: 'mural',
    titulo: 'Mural do Mestre',
    descricao: 'Missões especiais lançadas pelos professores',
    emoji: '📜',
    cor: '#8E44AD',
  },
]

type DadosAluno = {
  nome: string
  pontosPermanentes: number
  pontosTemporarios: number
  nivel: number
}

export default function HubAluno() {
  const router = useRouter()
  const [dados, setDados] = useState<DadosAluno | null>(null)

  useEffect(() => {
    if (!auth.currentUser) return
    const uid = auth.currentUser.uid
    const unsub = onSnapshot(doc(db, 'usuarios', uid), (snap) => {
      if (snap.exists()) {
        setDados(snap.data() as DadosAluno)
      }
    })
    return () => unsub()
  }, [])

  async function sair() {
    await signOut(auth)
    router.replace('/(auth)/login')
  }

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.container}>
      <View style={s.header}>
  <View>
    <Text style={s.titulo}>EduQuest</Text>
    <Text style={s.subtitulo}>
      {dados?.nome ? `Olá, ${dados.nome.split(' ')[0]}!` : 'Escolha seu caminho'}
    </Text>
  </View>
  <View style={{ flexDirection: 'row', gap: 8 }}>
    <TouchableOpacity
      onPress={() => router.push('/perfil')}
      style={s.btnSair}
    >
      <Text style={s.txtSair}>👤 Perfil</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={sair} style={s.btnSair}>
      <Text style={s.txtSair}>Sair</Text>
    </TouchableOpacity>
  </View>
  </View>

      <View style={s.xpContainer}>
        <Text style={s.xpTitulo}>Seu progresso</Text>
        <View style={s.xpRow}>
          <View style={s.xpCard}>
            <Text style={s.xpEmoji}>💎</Text>
            <Text style={s.xpValor}>{dados?.pontosPermanentes ?? 0}</Text>
            <Text style={s.xpLabel}>Cristais</Text>
          </View>
          <View style={s.xpCard}>
            <Text style={s.xpEmoji}>⚡</Text>
            <Text style={s.xpValor}>{dados?.pontosTemporarios ?? 0}</Text>
            <Text style={s.xpLabel}>Bônus ciclo</Text>
          </View>
          <View style={s.xpCard}>
            <Text style={s.xpEmoji}>🏆</Text>
            <Text style={s.xpValor}>{dados?.nivel ?? 1}</Text>
            <Text style={s.xpLabel}>Nível</Text>
          </View>
        </View>
      </View>

      <Text style={s.secaoTitulo}>Os Três Caminhos</Text>

      {portais.map((portal) => (
        <TouchableOpacity
          key={portal.id}
          style={[s.card, { borderLeftColor: portal.cor }]}
          onPress={() => router.push(`/materias?portal=${portal.id}`)}
        >
          <Text style={s.cardEmoji}>{portal.emoji}</Text>
          <View style={s.cardTexto}>
            <Text style={s.cardTitulo}>{portal.titulo}</Text>
            <Text style={s.cardDescricao}>{portal.descricao}</Text>
          </View>
          <Text style={[s.cardSeta, { color: portal.cor }]}>→</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
  style={[s.card, { borderLeftColor: '#F1C40F' }]}
  onPress={() => router.push('/loja')}
>
  <Text style={s.cardEmoji}>🏪</Text>
  <View style={s.cardTexto}>
    <Text style={s.cardTitulo}>Loja de Conquistas</Text>
    <Text style={s.cardDescricao}>Troque XP por benefícios acadêmicos</Text>
  </View>
  <Text style={[s.cardSeta, { color: '#F1C40F' }]}>→</Text>
</TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  subtitulo: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  btnSair: {
    backgroundColor: '#16213E',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  txtSair: {
    color: '#888',
    fontSize: 14,
  },
  xpContainer: {
    backgroundColor: '#16213E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#333',
  },
  xpTitulo: {
    color: '#888',
    fontSize: 13,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  xpCard: {
    alignItems: 'center',
  },
  xpEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  xpValor: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  xpLabel: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  secaoTitulo: {
    color: '#888',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#16213E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    borderLeftWidth: 4,
  },
  cardEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  cardTexto: {
    flex: 1,
  },
  cardTitulo: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDescricao: {
    color: '#888',
    fontSize: 13,
    lineHeight: 18,
  },
  cardSeta: {
    fontSize: 20,
    fontWeight: 'bold',
  },
})