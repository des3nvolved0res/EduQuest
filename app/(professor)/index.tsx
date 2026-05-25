import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { signOut } from 'firebase/auth'
import { auth, db } from '@/config/firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'

type DadosProfessor = {
  nome: string
}

export default function HomeProfessor() {
  const router = useRouter()
  const [dados, setDados] = useState<DadosProfessor | null>(null)

  useEffect(() => {
    if (!auth.currentUser) return
    const uid = auth.currentUser.uid
    const unsub = onSnapshot(doc(db, 'usuarios', uid), (snap) => {
      if (snap.exists()) setDados(snap.data() as DadosProfessor)
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
            {dados?.nome ? `Mestre ${dados.nome.split(' ')[0]}` : 'Painel do Mestre'}
          </Text>
        </View>
        <TouchableOpacity onPress={sair} style={s.btnSair}>
          <Text style={s.txtSair}>Sair</Text>
        </TouchableOpacity>
      </View>

      <Text style={s.secao}>Ferramentas do mestre</Text>

      <TouchableOpacity
        style={[s.card, { borderLeftColor: '#27AE60' }]}
        onPress={() => router.push('/validar')}
      >
        <Text style={s.cardEmoji}>🎟️</Text>
        <View style={s.cardTexto}>
          <Text style={s.cardTitulo}>Validar voucher</Text>
          <Text style={s.cardDescricao}>Confirme o bônus de nota do aluno</Text>
        </View>
        <Text style={[s.cardSeta, { color: '#27AE60' }]}>→</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[s.card, { borderLeftColor: '#4A90E2' }]}
        onPress={() => router.push('/dashboard')}
      >
        <Text style={s.cardEmoji}>📊</Text>
        <View style={s.cardTexto}>
          <Text style={s.cardTitulo}>Dashboard da turma</Text>
          <Text style={s.cardDescricao}>Acompanhe o progresso dos alunos</Text>
        </View>
        <Text style={[s.cardSeta, { color: '#4A90E2' }]}>→</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[s.card, { borderLeftColor: '#8E44AD' }]}
        onPress={() => router.push('/missoes')}
      >
        <Text style={s.cardEmoji}>⚔️</Text>
        <View style={s.cardTexto}>
          <Text style={s.cardTitulo}>Missões especiais</Text>
          <Text style={s.cardDescricao}>Lance desafios com bônus de XP</Text>
        </View>
        <Text style={[s.cardSeta, { color: '#8E44AD' }]}>→</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#1A1A2E' },
  container: { padding: 24, paddingTop: 60 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 32,
  },
  titulo: { fontSize: 32, fontWeight: 'bold', color: '#4A90E2' },
  subtitulo: { fontSize: 14, color: '#888', marginTop: 2 },
  btnSair: {
    backgroundColor: '#16213E', padding: 10,
    borderRadius: 8, borderWidth: 1, borderColor: '#333',
  },
  txtSair: { color: '#888', fontSize: 14 },
  secao: {
    color: '#888', fontSize: 13, marginBottom: 16,
    textTransform: 'uppercase', letterSpacing: 1,
  },
  card: {
    backgroundColor: '#16213E', borderRadius: 16, padding: 20,
    marginBottom: 16, flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#333', borderLeftWidth: 4,
  },
  cardEmoji: { fontSize: 32, marginRight: 16 },
  cardTexto: { flex: 1 },
  cardTitulo: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  cardDescricao: { color: '#888', fontSize: 13, lineHeight: 18 },
  cardSeta: { fontSize: 20, fontWeight: 'bold' },
})