import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native'
import { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'

const materias = [
  { id: 'matematica', titulo: 'Matemática', emoji: '📐' },
  { id: 'portugues', titulo: 'Português', emoji: '📝' },
  { id: 'biologia', titulo: 'Biologia', emoji: '🧬' },
  { id: 'historia', titulo: 'História', emoji: '📜' },
  { id: 'geografia', titulo: 'Geografia', emoji: '🌍' },
  { id: 'fisica', titulo: 'Física', emoji: '⚡' },
  { id: 'quimica', titulo: 'Química', emoji: '🧪' },
  { id: 'ingles', titulo: 'Inglês', emoji: '🌐' },
]

type Missao = {
  id: string
  titulo: string
  materia: string
  nomeMateria: string
  bonusXP: number
  criadoEm: string
}

export default function MissoesScreen() {
  const router = useRouter()
  const [titulo, setTitulo] = useState('')
  const [materiaSelecionada, setMateriaSelecionada] = useState<string | null>(null)
  const [bonusXP, setBonusXP] = useState(20)
  const [missoes, setMissoes] = useState<Missao[]>([])
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    async function carregar() {
      try {
        const snap = await getDocs(collection(db, 'missoes'))
        const lista: Missao[] = []
        snap.forEach(doc => lista.push({ id: doc.id, ...doc.data() } as Missao))
        lista.sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
        setMissoes(lista)
      } catch (e) {
        console.log('Erro ao carregar missões:', e)
      }
    }
    carregar()
  }, [])

  async function lancarMissao() {
    if (!titulo.trim()) {
      Alert.alert('Atenção', 'Digite o título da missão.')
      return
    }
    if (!materiaSelecionada) {
      Alert.alert('Atenção', 'Selecione uma matéria.')
      return
    }
    setSalvando(true)
    try {
      const materia = materias.find(m => m.id === materiaSelecionada)
      const nova = {
        titulo: titulo.trim(),
        materia: materiaSelecionada,
        nomeMateria: materia?.titulo,
        emojiMateria: materia?.emoji,
        bonusXP,
        professorId: auth.currentUser?.uid,
        criadoEm: new Date().toISOString(),
      }
      const docRef = await addDoc(collection(db, 'missoes'), nova)
      setMissoes(prev => [{ id: docRef.id, ...nova } as Missao, ...prev])
      setTitulo('')
      setMateriaSelecionada(null)
      setBonusXP(20)
      Alert.alert('✓ Missão lançada!', 'Os alunos serão notificados.')
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível lançar a missão.')
    }
    setSalvando(false)
  }

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.container}>
      <TouchableOpacity onPress={() => router.back()} style={s.btnVoltar}>
        <Text style={s.txtVoltar}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={s.titulo}>Missões especiais</Text>

      <View style={s.form}>
        <Text style={s.secao}>Título da missão</Text>
        <TextInput
          style={s.input}
          placeholder="Ex: Equações do 2º Grau"
          placeholderTextColor="#888"
          value={titulo}
          onChangeText={setTitulo}
        />

        <Text style={s.secao}>Matéria</Text>
        <View style={s.materiasGrade}>
          {materias.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[s.materiaBtn, materiaSelecionada === m.id && s.materiaBtnAtivo]}
              onPress={() => setMateriaSelecionada(m.id)}
            >
              <Text style={s.materiaEmoji}>{m.emoji}</Text>
              <Text style={[s.materiaTxt, materiaSelecionada === m.id && s.materiaTxtAtivo]}>
                {m.titulo}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={s.secao}>Bônus de XP</Text>
        <View style={s.quantidadeRow}>
          <TouchableOpacity
            style={s.btnQtd}
            onPress={() => setBonusXP(q => Math.max(10, q - 10))}
          >
            <Text style={s.txtQtd}>−</Text>
          </TouchableOpacity>
          <View style={s.qtdDisplay}>
            <Text style={s.qtdValor}>{bonusXP}</Text>
            <Text style={s.qtdLabel}>XP bônus</Text>
          </View>
          <TouchableOpacity
            style={s.btnQtd}
            onPress={() => setBonusXP(q => Math.min(100, q + 10))}
          >
            <Text style={s.txtQtd}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[s.btnLancar, salvando && { opacity: 0.6 }]}
          onPress={lancarMissao}
          disabled={salvando}
        >
          <Text style={s.txtLancar}>
            {salvando ? 'Lançando...' : '⚔️ Lançar missão'}
          </Text>
        </TouchableOpacity>
      </View>

      {missoes.length > 0 && (
        <>
          <Text style={s.secao}>Missões ativas</Text>
          {missoes.map((missao) => (
            <View key={missao.id} style={s.missaoCard}>
              <View style={s.missaoHeader}>
                <Text style={s.missaoTitulo}>{missao.titulo}</Text>
                <View style={s.xpBadge}>
                  <Text style={s.xpTxt}>+{missao.bonusXP} XP</Text>
                </View>
              </View>
              <Text style={s.missaoMateria}>{missao.nomeMateria}</Text>
              <Text style={s.missaoData}>
                {new Date(missao.criadoEm).toLocaleDateString('pt-BR')}
              </Text>
            </View>
          ))}
        </>
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
  form: {
    backgroundColor: '#16213E', borderRadius: 16,
    padding: 20, marginBottom: 24,
    borderWidth: 1, borderColor: '#333',
  },
  secao: {
    color: '#888', fontSize: 13, marginBottom: 12,
    textTransform: 'uppercase', letterSpacing: 1,
  },
  input: {
    backgroundColor: '#1A1A2E', borderRadius: 12,
    padding: 16, color: '#fff', fontSize: 16,
    marginBottom: 24, borderWidth: 1, borderColor: '#333',
  },
  materiasGrade: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  materiaBtn: {
    width: '22%', padding: 10, borderRadius: 12,
    backgroundColor: '#1A1A2E', alignItems: 'center',
    borderWidth: 1, borderColor: '#333',
  },
  materiaBtnAtivo: { borderColor: '#8E44AD', backgroundColor: '#2d1a4a' },
  materiaEmoji: { fontSize: 22, marginBottom: 4 },
  materiaTxt: { color: '#888', fontSize: 11, textAlign: 'center' },
  materiaTxtAtivo: { color: '#8E44AD' },
  quantidadeRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 24, marginBottom: 24,
  },
  btnQtd: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#1A1A2E', justifyContent: 'center',
    alignItems: 'center', borderWidth: 1, borderColor: '#333',
  },
  txtQtd: { color: '#fff', fontSize: 22 },
  qtdDisplay: { alignItems: 'center' },
  qtdValor: { color: '#fff', fontSize: 36, fontWeight: 'bold' },
  qtdLabel: { color: '#888', fontSize: 14 },
  btnLancar: {
    backgroundColor: '#8E44AD', padding: 18,
    borderRadius: 16, alignItems: 'center',
  },
  txtLancar: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  missaoCard: {
    backgroundColor: '#16213E', borderRadius: 16, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: '#333',
  },
  missaoHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 8,
  },
  missaoTitulo: { color: '#fff', fontSize: 15, fontWeight: 'bold', flex: 1 },
  xpBadge: {
    backgroundColor: '#2d1a4a', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: '#8E44AD',
  },
  xpTxt: { color: '#8E44AD', fontSize: 13, fontWeight: 'bold' },
  missaoMateria: { color: '#888', fontSize: 13, marginBottom: 4 },
  missaoData: { color: '#555', fontSize: 12 },
})